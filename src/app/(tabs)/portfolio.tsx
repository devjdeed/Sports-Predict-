import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Screen } from '@/components/layout/Screen';
import { Split } from '@/components/layout/Split';
import { LimitRow, SettledRow } from '@/components/portfolio/OrderLists';
import { PositionCard } from '@/components/portfolio/PositionCard';
import { BattleRibbons, ExecutionDiagnostic, NetWorthCard, WinRatioCard } from '@/components/portfolio/Summary';
import { AppText } from '@/components/ui/AppText';
import { PressableScale } from '@/components/ui/PressableScale';
import { SegmentedTabs } from '@/components/ui/SegmentedTabs';
import { unrealizedPnl } from '@/domain/pricing';
import { useResponsive } from '@/hooks/useResponsive';
import { useMarketStore } from '@/store/marketStore';
import { useTradingStore } from '@/store/tradingStore';
import { colors, space } from '@/theme';

type View_ = 'active' | 'settled' | 'limit';

export default function PortfolioScreen() {
  const { isTablet } = useResponsive();
  const positions = useTradingStore((s) => s.positions);
  const settled = useTradingStore((s) => s.settled);
  const limits = useTradingStore((s) => s.limits);
  const markets = useMarketStore((s) => s.markets);
  const [view, setView] = useState<View_>('active');
  const [sortByPnl, setSortByPnl] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(positions[0]?.id ?? null);

  const sorted = useMemo(() => {
    if (!sortByPnl) return positions;
    const price = new Map(markets.map((m) => [m.id, m.yesPrice]));
    return [...positions].sort((a, b) => unrealizedPnl(b, price.get(b.marketId) ?? b.avgPrice) - unrealizedPnl(a, price.get(a.marketId) ?? a.avgPrice));
  }, [positions, markets, sortByPnl]);

  const summary = (
    <>
      <NetWorthCard />
      <View style={styles.pair}>
        <WinRatioCard />
        <BattleRibbons />
      </View>
      {isTablet && <ExecutionDiagnostic />}
    </>
  );

  const lists = (
    <>
      <SegmentedTabs
        options={[
          { key: 'active', label: `Active (${positions.length})` },
          { key: 'settled', label: `Settled (${settled.length})` },
          { key: 'limit', label: `Limit (${limits.length})` },
        ]}
        value={view}
        onChange={setView}
      />

      {view === 'active' && (
        <>
          <View style={styles.between}>
            <AppText variant="label-md" upper color={colors.textSecondary}>
              Live Contract Positions
            </AppText>
            <PressableScale onPress={() => setSortByPnl((v) => !v)} style={styles.inline}>
              <AppText variant="label-md" color={sortByPnl ? colors.yes : colors.cyan}>
                Sort by P&L
              </AppText>
              <MaterialCommunityIcons name="tune-variant" size={14} color={sortByPnl ? colors.yes : colors.cyan} />
            </PressableScale>
          </View>
          {sorted.length === 0 && <Empty text="No open positions. Pick a market and make your call." />}
          {sorted.map((p) => (
            <PositionCard key={p.id} position={p} expanded={expanded === p.id} onToggle={() => setExpanded((e) => (e === p.id ? null : p.id))} />
          ))}
        </>
      )}

      {view === 'settled' && (settled.length ? settled.map((s) => <SettledRow key={s.id + s.closedAt} item={s} />) : <Empty text="Nothing settled yet." />)}

      {view === 'limit' && (limits.length ? limits.map((l) => <LimitRow key={l.id} order={l} />) : <Empty text="No resting limit orders. Use Limit mode on the trade slip." />)}

      {!isTablet && <ExecutionDiagnostic />}
    </>
  );

  if (isTablet) {
    return (
      <Screen fixed>
        <Split left={summary} right={lists} />
      </Screen>
    );
  }

  return (
    <Screen>
      {summary}
      {lists}
    </Screen>
  );
}

function Empty({ text }: { text: string }) {
  return (
    <AppText variant="body-md" color={colors.textSecondary} align="center" style={{ paddingVertical: space.xl }}>
      {text}
    </AppText>
  );
}

const styles = StyleSheet.create({
  pair: { flexDirection: 'row', gap: space.md },
  between: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  inline: { flexDirection: 'row', alignItems: 'center', gap: 6 },
});
