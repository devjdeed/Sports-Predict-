import { createMarkets } from '@/data/markets';
import { matches } from '@/data/matches';
import { step, type SimState } from '../liveSimulator';

const fresh = (): SimState => ({ markets: createMarkets(), matches: structuredClone(matches) });

function seeded(seed = 1) {
  return () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
}

describe('liveSimulator', () => {
  it('keeps prices inside 1–99¢ and advances live clocks', () => {
    let state = fresh();
    const rand = seeded(42);
    const startRma = state.matches.find((m) => m.id === 'rma-bay')!.clock.seconds;
    for (let i = 0; i < 20; i++) state = step(state, rand);
    for (const m of state.markets.filter((x) => x.status === 'open')) {
      expect(m.yesPrice).toBeGreaterThanOrEqual(1);
      expect(m.yesPrice).toBeLessThanOrEqual(99);
    }
    expect(state.matches.find((m) => m.id === 'rma-bay')!.clock.seconds).toBeGreaterThan(startRma);
    expect(state.matches.find((m) => m.id === 'mci-wol')!.status).toBe('upcoming');
  });

  it('resolves a market once its window closes, exactly once', () => {
    let state = fresh();
    const rand = seeded(7);
    const resolved: string[] = [];
    // RMA next-goal closes at 75:00; the match starts at 68:24 and runs 6s/tick.
    for (let i = 0; i < 80; i++) {
      const next = step(state, rand);
      resolved.push(...next.resolutions.map((r) => r.marketId));
      state = next;
    }
    expect(resolved.filter((id) => id === 'rma-next-goal')).toHaveLength(1);
    const market = state.markets.find((m) => m.id === 'rma-next-goal')!;
    expect(market.status).toBe('settled');
    expect([0, 100]).toContain(market.yesPrice);
  });

  it('keeps event markers aligned once history hits its cap', () => {
    let state = fresh();
    const rand = seeded(3);
    for (let i = 0; i < 60; i++) state = step(state, rand);
    const market = state.markets.find((m) => m.id === 'rma-next-goal')!;
    expect(market.history.length).toBeLessThanOrEqual(120);
    expect(market.events[0].at).toBe(54 - (81 + 60 - 120));
  });
});
