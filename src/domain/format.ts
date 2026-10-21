import type { Match, MatchClock } from './types';

const usd = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 });
const usd0 = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

export const money = (n: number) => usd.format(n);
export const money0 = (n: number) => usd0.format(n);
export const signedMoney = (n: number) => `${n >= 0 ? '+' : '-'}${usd.format(Math.abs(n))}`;
export const signedMoney0 = (n: number) => `${n >= 0 ? '+' : '-'}${usd0.format(Math.abs(n))}`;
export const pct = (ratio: number, digits = 1) => `${(ratio * 100).toFixed(digits)}%`;
export const signedPct = (ratio: number, digits = 1) => `${ratio >= 0 ? '+' : ''}${(ratio * 100).toFixed(digits)}%`;
export const cents = (c: number) => `${Math.round(c)}¢`;
export const compact = (n: number) =>
  n >= 1_000_000 ? `${(n / 1_000_000).toFixed(1)}M` : n >= 1000 ? `${(n / 1000).toFixed(1)}K` : `${Math.round(n)}`;
export const int = (n: number) => Math.round(n).toLocaleString('en-US');

const pad = (n: number) => String(Math.max(0, Math.floor(n))).padStart(2, '0');

export const mmss = (seconds: number) => `${pad(seconds / 60)}:${pad(seconds % 60)}`;

/** Compact clock: `68'` for soccer, `Q4 02:45` for timed periods, or the static label. */
export function clockShort(clock: MatchClock) {
  if (clock.mode === 'static') return clock.label ?? '';
  if (clock.mode === 'up') return `${Math.floor(clock.seconds / 60)}'`;
  return `${clock.periods?.[clock.period] ?? ''} ${mmss(clock.seconds)}`.trim();
}

/** Detailed clock: `68:24` for soccer. */
export function clockLong(clock: MatchClock) {
  if (clock.mode === 'up') return mmss(clock.seconds);
  return clockShort(clock);
}

const LEAGUE_SHORT: Record<string, string> = {
  'UEFA Champions League': 'UCL',
  'Premier League': 'EPL',
};

export const leagueShort = (league: string) => LEAGUE_SHORT[league] ?? league.split(' · ')[0];

export const scoreLine =(m: Match) => `${m.home.code} ${m.home.score} - ${m.away.score} ${m.away.code}`;
