import { averageIn, contractsFor, hedgedPnl, marketValue, quote, returnPct, sidePrice, unrealizedPnl } from '../pricing';
import { multiplierFor, nextTier } from '../progression';
import type { Position } from '../types';

const position: Position = { id: 'p', marketId: 'm', side: 'YES', contracts: 150, avgPrice: 52, openedAt: 0 };

describe('pricing', () => {
  it('prices NO as the complement of YES', () => {
    expect(sidePrice(64, 'YES')).toBe(64);
    expect(sidePrice(64, 'NO')).toBe(36);
  });

  it('buys whole contracts only', () => {
    expect(contractsFor(50, 64)).toBe(78);
    expect(contractsFor(0.5, 64)).toBe(0);
  });

  it('quotes the Trade mockup: $50 YES @ 64¢', () => {
    const q = quote(50, 64);
    expect(q.contracts).toBe(78);
    expect(q.cost).toBe(49.92);
    expect(q.payout).toBe(78);
    expect(q.profit).toBe(28.08);
    expect(q.profitPct).toBeCloseTo(0.5625, 4);
    expect(q.fee).toBe(0);
  });

  it('computes return multiples per side', () => {
    expect(Math.round(returnPct(64) * 100)).toBe(56);
    expect(Math.round(returnPct(36) * 100)).toBe(178);
  });

  it('marks positions to market (Portfolio mockup: 150 YES @ 52¢, now 64¢)', () => {
    expect(marketValue(position, 64)).toBe(96);
    expect(unrealizedPnl(position, 64)).toBe(18);
    expect(marketValue({ ...position, side: 'NO' }, 64)).toBe(54);
  });

  it('volume-weights the average entry when adding to a position', () => {
    expect(averageIn({ contracts: 100, avgPrice: 40 }, 100, 60)).toEqual({ contracts: 200, avgPrice: 50 });
  });

  it('locks in P&L with a full hedge', () => {
    // 150 YES @ 52 + 150 NO @ 36 = $132 cost, $150 guaranteed payout.
    expect(hedgedPnl(position, 36)).toBe(18);
  });
});

describe('progression', () => {
  it('maps streaks onto the ladder', () => {
    expect(multiplierFor(0)).toBe(1);
    expect(multiplierFor(1)).toBe(1.1);
    expect(multiplierFor(4)).toBe(1.5);
    expect(multiplierFor(7)).toBe(2.5);
    expect(multiplierFor(12)).toBe(3);
    expect(nextTier(7)).toEqual({ minStreak: 8, multiplier: 3 });
    expect(nextTier(9)).toBeNull();
  });
});
