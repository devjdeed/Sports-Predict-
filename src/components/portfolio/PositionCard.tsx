import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import * as Haptics from 'expo-haptics';
import { StyleSheet, View } from 'react-native';

import { clockShort, money, signedMoney, signedPct } from '@/domain/format';
import { costBasis, marketValue, opposite, pnlPct, sidePrice, unrealizedPnl } from '@/domain/pricing';
import type { Position } from '@/domain/types';
import { useMarket, useMatch } from '@/store/marketStore';
import { toast } from '@/store/toastStore';
import { useTradingStore, type Result } from '@/store/tradingStore';
import { colors, fonts, radii, space } from '@/theme';
import { AppText } from '../ui/AppText';
import { ProgressBar } from '../ui/Bars';
import { GlassCard } from '../ui/GlassCard';
import { PressableScale } from '../ui/PressableScale';
import { PriceFlash } from '../ui/PriceFlash';
import { Tag } from '../ui/Tag';

const report = (r: Result) => {
  Haptics.notificationAsync(r.ok ? Haptics.NotificationFeedbackType.Success : Haptics.NotificationFeedbackType.Error).catch(() => {});
  toast(r.message, r.ok ? 'yes' : 'no');
};

/** Live contract position with cash-out / hedge execution. */
export function PositionCard({ position, expanded, onToggle }: { position: Position; expanded: boolean; onToggle: () => void }) {
  const market = useMarket(position.marketId);
  const match = useMatch(market?.matchId);
  const cashOut = useTradingStore((s) => s.cashOut);
  const hedge = useTradingStore((s) => s.hedge);
  if (!market || !match) return null;

  const current = sidePrice(market.yesPrice, position.side);
  const prev = sidePrice(market.prevYesPrice, position.side);
  const tick = current - prev;
  const value = marketValue(position, market.yesPrice);
  const pnl = unrealizedPnl(position, market.yesPrice);
  const up = pnl >= 0;
  const hedgeSide = opposite(position.side);
  const hedgePrice = sidePrice(market.yesPrice, hedgeSide);
  const live = match.status === 'live';
  const nearSettlement = current >= 90;

  return (
    <PressableScale haptic="none" onPress={onToggle} accessibilityLabel={`${market.shortTitle} position`}>
      <GlassCard aura={expanded ? (up ? 'bull' : 'bear') : undefined} style={{ gap: space.md }}>
        <View style={styles.between}>
          <View style={styles.inline}>
            <Tag label={market.kind === 'prop' ? market.tag : match.league.replace('UEFA Champions League', 'UEFA CL')} />
            <Tag label={live ? `${clockShort(match.clock)}${match.clock.mode === 'up' ? ' Live' : ''}` : clockShort(match.clock)} tone="neutral" dotColor={live ? colors.no : colors.gold} live={live} style={styles.bare} />
          </View>
          <Tag label={`${signedMoney(pnl)} (${signedPct(pnlPct(position, market.yesPrice))})`} tone={up ? 'yes' : 'no'} />
        </View>

        <AppText variant="headline-md">{market.shortTitle}</AppText>

        <View style={styles.grid}>
          <Cell label="Holding" value={`${position.contracts} ${position.side}`} sub={`@ ${Math.round(position.avgPrice)}¢ avg`} />
          <View style={{ flex: 1, gap: 2 }}>
            <AppText variant="label-sm" color={colors.textSecondary}>
              Current
            </AppText>
            <PriceFlash value={current} suffix="¢" variant="label-lg" color={colors.yes} />
            <AppText variant="label-sm" color={nearSettlement ? colors.yes : tick >= 0 ? colors.yes : colors.no}>
              {nearSettlement ? 'Near Settlement' : `${tick >= 0 ? '+' : '-'}$${Math.abs(tick / 100).toFixed(2)}/ct`}
            </AppText>
          </View>
          <Cell label="Market Value" value={money(value)} sub={`Cost: ${money(costBasis(position))}`} right />
        </View>

        {nearSettlement && !expanded && <ProgressBar value={current / 100} height={6} />}

        {expanded ? (
          <View style={styles.actions}>
            <PressableScale haptic="heavy" onPress={() => report(cashOut(position.id))} style={styles.cashOut}>
              <AppText variant="headline-sm" weight={fonts.display800} color={colors.onYes} upper align="center">
                Cash Out {money(value)}
              </AppText>
            </PressableScale>
            <PressableScale haptic="medium" onPress={() => report(hedge(position.id))} style={styles.hedge}>
              <MaterialCommunityIcons name="swap-horizontal" size={18} color={colors.text} />
              <AppText variant="headline-sm" weight={fonts.display800} color={colors.no} upper align="center" style={{ flexShrink: 1 }}>
                Hedge {hedgeSide}
                {'\n'}({hedgePrice}¢)
              </AppText>
            </PressableScale>
          </View>
        ) : (
          <View style={styles.between}>
            <View style={[styles.inline, { flex: 1 }]}>
              <MaterialCommunityIcons name={match.sport === 'soccer' ? 'soccer' : 'scoreboard-outline'} size={14} color={colors.textSecondary} />
              <AppText variant="label-sm" color={colors.textSecondary} style={{ flex: 1 }} numberOfLines={2}>
                {market.context ?? `${match.home.code} ${match.home.score} - ${match.away.score} ${match.away.code}`}
              </AppText>
            </View>
            {up ? (
              <AppText variant="label-sm" upper color={colors.cyan} weight={fonts.mono700}>
                Manage Slip ›
              </AppText>
            ) : (
              <PressableScale onPress={() => report(cashOut(position.id))}>
                <AppText variant="label-sm" upper color={colors.no} weight={fonts.mono700} align="right">
                  Cut Loss @{'\n'}
                  {current}¢
                </AppText>
              </PressableScale>
            )}
          </View>
        )}
      </GlassCard>
    </PressableScale>
  );
}

function Cell({ label, value, sub, right }: { label: string; value: string; sub: string; right?: boolean }) {
  return (
    <View style={{ flex: 1, gap: 2, alignItems: right ? 'flex-end' : 'flex-start' }}>
      <AppText variant="label-sm" color={colors.textSecondary}>
        {label}
      </AppText>
      <AppText variant="label-lg">{value}</AppText>
      <AppText variant="label-sm" color={colors.textSecondary}>
        {sub}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  between: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: space.sm },
  inline: { flexDirection: 'row', alignItems: 'center', gap: space.sm, flexShrink: 1 },
  bare: { backgroundColor: 'transparent', borderColor: 'transparent', paddingHorizontal: 0 },
  grid: { flexDirection: 'row', gap: space.sm, padding: space.md, borderRadius: radii.md, backgroundColor: colors.inset },
  actions: { flexDirection: 'row', gap: space.md },
  cashOut: {
    flex: 1,
    minHeight: 64,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radii.md,
    backgroundColor: colors.yes,
    paddingHorizontal: space.md,
    shadowColor: colors.yes,
    shadowOpacity: 0.35,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 4 },
  },
  hedge: {
    flex: 1,
    minHeight: 64,
    flexDirection: 'row',
    gap: space.sm,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radii.md,
    backgroundColor: colors.elevated,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    paddingHorizontal: space.md,
  },
});
