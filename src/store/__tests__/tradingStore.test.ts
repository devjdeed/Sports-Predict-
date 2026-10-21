import { useMarketStore } from '../marketStore';
import { initialTradingData, netWorthOf, useTradingStore } from '../tradingStore';

const trading = () => useTradingStore.getState();
const setPrice = (id: string, yesPrice: number) =>
  useMarketStore.setState((s) => ({ markets: s.markets.map((m) => (m.id === id ? { ...m, yesPrice, prevYesPrice: yesPrice } : m)) }));

beforeEach(() => {
  useTradingStore.setState(initialTradingData());
  setPrice('rma-next-goal', 64);
  setPrice('kc-next-td', 48);
  setPrice('haaland-2g', 71);
});

describe('trading loop', () => {
  it('seeds a portfolio matching the mockup net worth', () => {
    expect(netWorthOf(trading(), useMarketStore.getState().markets)).toBe(4820.5);
  });

  it('buys contracts, debits cash and awards XP', () => {
    const { cash, profile } = trading();
    const r = trading().buy('kc-next-td', 'YES', 50);
    expect(r.ok).toBe(true);
    const p = trading().positions.find((x) => x.marketId === 'kc-next-td')!;
    expect(p.contracts).toBe(104);
    expect(trading().cash).toBeCloseTo(cash - 49.92, 2);
    expect(trading().profile.xp).toBeGreaterThan(profile.xp);
  });

  it('averages into an existing same-side position', () => {
    trading().buy('kc-next-td', 'YES', 48);
    setPrice('kc-next-td', 52);
    trading().buy('kc-next-td', 'YES', 52);
    const p = trading().positions.filter((x) => x.marketId === 'kc-next-td');
    expect(p).toHaveLength(1);
    expect(p[0].contracts).toBe(200);
    expect(p[0].avgPrice).toBe(50);
  });

  it('rejects trades it cannot afford', () => {
    useTradingStore.setState({ cash: 0.1 });
    expect(trading().buy('kc-next-td', 'YES', 50).ok).toBe(false);
  });

  it('cashes out at the current price and extends the streak on a win', () => {
    const before = trading();
    const r = trading().cashOut('p-rma');
    expect(r.ok).toBe(true);
    expect(trading().cash).toBeCloseTo(before.cash + 96, 2);
    expect(trading().positions.find((p) => p.id === 'p-rma')).toBeUndefined();
    expect(trading().settled[0]).toMatchObject({ pnl: 18, reason: 'cashout', title: expect.any(String) });
    expect(trading().profile.streak).toBe(before.profile.streak + 1);
  });

  it('resets the streak on a losing exit', () => {
    trading().cashOut('p-luka'); // 80 YES @ 42¢, marked at 38¢
    expect(trading().profile.streak).toBe(0);
  });

  it('hedges with the opposite side and refuses to double-hedge', () => {
    expect(trading().hedge('p-rma').ok).toBe(true);
    const no = trading().positions.find((p) => p.marketId === 'rma-next-goal' && p.side === 'NO')!;
    expect(no.contracts).toBe(150);
    expect(no.avgPrice).toBe(36);
    expect(trading().hedge('p-rma').ok).toBe(false);
  });

  it('settles hedged markets as a single result with the locked-in P&L', () => {
    trading().hedge('p-rma');
    const cash = trading().cash;
    const streak = trading().profile.streak;
    trading().applyResolutions([{ marketId: 'rma-next-goal', outcome: 'NO' }]);
    expect(trading().cash).toBeCloseTo(cash + 150, 2);
    expect(trading().positions.some((p) => p.marketId === 'rma-next-goal')).toBe(false);
    expect(trading().profile.streak).toBe(streak + 1);
  });

  it('reserves cash for limit orders, fills at a better price and refunds the difference', () => {
    const cash = trading().cash;
    trading().placeLimit('kc-next-td', 'YES', 45, 45); // 100 contracts reserved at 45¢
    expect(trading().cash).toBeCloseTo(cash - 45, 2);
    setPrice('kc-next-td', 43);
    trading().fillLimits();
    const p = trading().positions.find((x) => x.marketId === 'kc-next-td')!;
    expect(p).toMatchObject({ contracts: 100, avgPrice: 43 });
    expect(trading().cash).toBeCloseTo(cash - 43, 2);
  });

  it('refunds cancelled limit orders', () => {
    const cash = trading().cash;
    trading().cancelLimit('l-haaland');
    expect(trading().cash).toBeCloseTo(cash + 32.5, 2);
    expect(trading().limits).toHaveLength(0);
  });

  it('copy-trades through the same buy path', () => {
    const r = trading().copyForecaster('oracle', 25);
    expect(r.ok).toBe(true);
    expect(trading().copied).toContain('oracle');
    expect(trading().positions.some((p) => p.marketId === 'mci-rma-btts')).toBe(true);
  });
});
