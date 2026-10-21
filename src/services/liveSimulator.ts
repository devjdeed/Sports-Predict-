import { clampPrice } from '@/domain/pricing';
import type { Market, Match, Side } from '@/domain/types';

export const TICK_MS = 1500;
const HISTORY_CAP = 120;
/** Game seconds that pass per tick, per sport — fast enough to watch markets settle. */
const GAME_SECONDS_PER_TICK: Record<Match['sport'], number> = { soccer: 6, nba: 2, nfl: 4, esports: 5, ufc: 0 };

export interface Resolution {
  marketId: string;
  outcome: Side;
}

export interface SimState {
  markets: Market[];
  matches: Match[];
}

function advanceClock(match: Match, rand: () => number): Match {
  if (match.status !== 'live') return match;
  const step = GAME_SECONDS_PER_TICK[match.sport];
  const { clock } = match;

  if (clock.mode === 'up') {
    const seconds = Math.min(clock.length, clock.seconds + step);
    const done = seconds >= clock.length;
    return {
      ...match,
      status: done ? 'final' : 'live',
      clock: done ? { ...clock, seconds, mode: 'static', label: 'FT' } : { ...clock, seconds },
    };
  }

  if (clock.mode === 'down') {
    let { seconds, period } = clock;
    seconds -= step;
    let { home, away } = match;
    // Basketball/football scoring trickles in while the clock runs.
    if (match.sport === 'nba' && rand() < 0.22) {
      const pts = rand() < 0.3 ? 3 : 2;
      if (rand() < 0.5) home = { ...home, score: home.score + pts };
      else away = { ...away, score: away.score + pts };
    }
    if (seconds <= 0) {
      const lastPeriod = (clock.periods?.length ?? 1) - 1;
      if (period >= lastPeriod) {
        return { ...match, home, away, status: 'final', clock: { ...clock, seconds: 0, mode: 'static', label: 'FINAL' } };
      }
      period += 1;
      seconds = clock.length;
    }
    return { ...match, home, away, clock: { ...clock, seconds, period } };
  }

  return match;
}

/** Mean-reverting random walk in whole cents; live markets move more than pre-match ones. */
function nudgePrice(market: Market, live: boolean, rand: () => number): Market {
  const moveChance = live ? 0.55 : 0.18;
  if (rand() > moveChance) {
    return { ...market, ...append(market, market.yesPrice), prevYesPrice: market.yesPrice };
  }
  const magnitude = live && rand() < 0.12 ? 3 : 1;
  const drift = (50 - market.yesPrice) * 0.004;
  const direction = rand() + drift < 0.5 ? -1 : 1;
  const yesPrice = clampPrice(market.yesPrice + direction * magnitude);
  return {
    ...market,
    prevYesPrice: market.yesPrice,
    yesPrice,
    volume: market.volume + Math.round(rand() * 400),
    ...append(market, yesPrice),
  };
}

/** Append a price point, dropping the oldest at the cap and keeping event indices aligned. */
function append(market: Market, price: number): Pick<Market, 'history' | 'events'> {
  if (market.history.length < HISTORY_CAP) return { history: [...market.history, price], events: market.events };
  return {
    history: [...market.history.slice(1), price],
    events: market.events.map((e) => ({ ...e, at: e.at - 1 })).filter((e) => e.at >= 0),
  };
}

/**
 * One simulation step: advance clocks, move prices, and resolve markets whose
 * window has closed (outcome drawn with the market's implied probability).
 */
export function step(state: SimState, rand: () => number = Math.random): SimState & { resolutions: Resolution[] } {
  const matches = state.matches.map((m) => advanceClock(m, rand));
  const byId = new Map(matches.map((m) => [m.id, m]));
  const resolutions: Resolution[] = [];

  const markets = state.markets.map((market) => {
    if (market.status === 'settled') return market;
    const match = byId.get(market.matchId);
    if (!match) return market;

    const windowClosed =
      match.status === 'final' ||
      (market.closesAt !== undefined && match.clock.mode === 'up' && match.clock.seconds >= market.closesAt);

    if (windowClosed) {
      const outcome: Side = rand() * 100 < market.yesPrice ? 'YES' : 'NO';
      resolutions.push({ marketId: market.id, outcome });
      const final = outcome === 'YES' ? 100 : 0;
      return { ...market, ...append(market, final), status: 'settled' as const, outcome, prevYesPrice: market.yesPrice, yesPrice: final };
    }

    return nudgePrice(market, match.status === 'live', rand);
  });

  return { markets, matches, resolutions };
}
