import { useMemo } from 'react';

import { useMarketStore } from '@/store/marketStore';
import { lockedInLimits, lockedInPositions, netWorthOf, useTradingStore } from '@/store/tradingStore';

/** Live portfolio totals derived from the trading store and current market prices. */
export function usePortfolio() {
  const markets = useMarketStore((s) => s.markets);
  const cash = useTradingStore((s) => s.cash);
  const positions = useTradingStore((s) => s.positions);
  const limits = useTradingStore((s) => s.limits);
  const history = useTradingStore((s) => s.netWorthHistory);

  return useMemo(() => {
    const netWorth = netWorthOf({ cash, positions, limits }, markets);
    const startOfDay = history[history.length - 1] ?? netWorth;
    const weekStart = history[0] ?? netWorth;
    return {
      netWorth,
      cash,
      locked: lockedInPositions(positions) + lockedInLimits(limits),
      todayChange: netWorth - startOfDay,
      todayPct: startOfDay ? (netWorth - startOfDay) / startOfDay : 0,
      weekPct: weekStart ? (netWorth - weekStart) / weekStart : 0,
      trajectory: [...history, netWorth],
    };
  }, [markets, cash, positions, limits, history]);
}
