import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { StyleSheet, View } from 'react-native';

import { money, signedMoney, signedPct } from '@/domain/format';
import { usePortfolio } from '@/hooks/usePortfolio';
import { useTradingStore } from '@/store/tradingStore';
import { colors, fonts, radii, space } from '@/theme';
import { AreaChart } from '../charts/AreaChart';
import { RingProgress } from '../charts/RingProgress';
import { AppText } from '../ui/AppText';
import { GlassCard } from '../ui/GlassCard';
import { PriceFlash } from '../ui/PriceFlash';
import { Tag } from '../ui/Tag';

export function NetWorthCard() {
  const p = usePortfolio();
  const up = p.todayChange >= 0;
  return (
    <GlassCard hero style={{ gap: space.lg }}>
      <View style={styles.between}>
        <View style={styles.inline}>
          <AppText variant="label-md" upper color={colors.textSecondary}>
            Total Portfolio Net Worth
          </AppText>
          <MaterialCommunityIcons name="check-decagram-outline" size={14} color={colors.cyan} />
        </View>
        <Tag label="Live Telemetry" tone="yes" dotColor={colors.yes} live />
      </View>

      <View style={{ gap: space.sm }}>
        <View style={[styles.inline, { alignItems: 'baseline' }]}>
          <PriceFlash value={p.netWorth} format={money} variant="headline-xl" weight={fonts.display800} />
          <AppText variant="label-md" color={colors.textSecondary}>
            USD
          </AppText>
        </View>
        <View style={[styles.change, { borderColor: up ? 'rgba(0,245,155,0.2)' : 'rgba(255,51,102,0.2)' }]}>
          <MaterialCommunityIcons name={up ? 'trending-up' : 'trending-down'} size={16} color={up ? colors.yes : colors.no} />
          <AppText variant="label-md" color={up ? colors.yes : colors.no}>
            {signedMoney(p.todayChange)} ({signedPct(p.todayPct, 2)} today)
          </AppText>
        </View>
      </View>

      <View style={{ gap: space.sm }}>
        <View style={styles.between}>
          <AppText variant="label-sm" upper color={colors.textSecondary}>
            7D Trajectory
          </AppText>
          <AppText variant="label-sm" color={p.weekPct >= 0 ? colors.yes : colors.no}>
            {signedPct(p.weekPct)} weekly ROI
          </AppText>
        </View>
        <AreaChart data={p.trajectory} height={80} />
      </View>

      <View style={styles.tiles}>
        <Tile icon="cash" label="Cash Available" value={money(p.cash)} />
        <Tile icon="lock-outline" label="Locked in Contracts" value={money(p.locked)} />
      </View>
    </GlassCard>
  );
}

function Tile({ icon, label, value }: { icon: keyof typeof MaterialCommunityIcons.glyphMap; label: string; value: string }) {
  return (
    <View style={styles.tile}>
      <View style={styles.inline}>
        <MaterialCommunityIcons name={icon} size={13} color={colors.textSecondary} />
        <AppText variant="label-sm" color={colors.textSecondary}>
          {label}
        </AppText>
      </View>
      <AppText variant="label-lg" weight={fonts.mono700}>
        {value}
      </AppText>
    </View>
  );
}

export function WinRatioCard() {
  const { wins, losses } = useTradingStore((s) => s.profile);
  const ratio = wins + losses ? wins / (wins + losses) : 0;
  return (
    <GlassCard style={[styles.inline, { flex: 1, gap: space.md }]}>
      <RingProgress value={ratio} label={`${Math.round(ratio * 100)}%`} />
      <View style={{ flex: 1 }}>
        <AppText variant="label-sm" upper color={colors.textSecondary}>
          Win Ratio
        </AppText>
        <AppText variant="headline-md" numberOfLines={1} adjustsFontSizeToFit>
          {wins}W-{losses}L
        </AppText>
        <AppText variant="label-sm" color={colors.textSecondary} numberOfLines={1}>
          UCL Apex: 8-2
        </AppText>
      </View>
    </GlassCard>
  );
}

export function BattleRibbons() {
  const streak = useTradingStore((s) => s.profile.streak);
  return (
    <GlassCard style={{ flex: 1, gap: space.sm }}>
      <View style={styles.between}>
        <AppText variant="label-sm" upper color={colors.textSecondary}>
          Battle Ribbons
        </AppText>
        <MaterialCommunityIcons name="trophy-variant-outline" size={14} color={colors.cyan} />
      </View>
      <Ribbon emoji="🎯" label="Clutch Sniper" />
      <Ribbon emoji="🏆" label={streak >= 10 ? '10-Streak Veteran' : `${streak}-Streak Runner`} />
    </GlassCard>
  );
}

function Ribbon({ emoji, label }: { emoji: string; label: string }) {
  return (
    <View style={styles.ribbon}>
      <AppText variant="label-sm">{emoji}</AppText>
      <AppText variant="label-sm" color={colors.gold}>
        {label}
      </AppText>
    </View>
  );
}

export function ExecutionDiagnostic() {
  const trades = useTradingStore((s) => s.settled.length + s.positions.length + 45);
  return (
    <GlassCard style={{ gap: space.sm }}>
      <View style={styles.between}>
        <AppText variant="headline-sm" weight={fonts.display700}>
          Execution Speed Diagnostic
        </AppText>
        <MaterialCommunityIcons name="lightning-bolt-outline" size={18} color={colors.yes} />
      </View>
      <AppText variant="body-sm" color={colors.textSecondary}>
        Your orders route via the Apex Instant Liquidity Router. Average matched speed across your last {trades} trades is{' '}
        <AppText variant="body-sm" color={colors.yes} weight={fonts.body700}>
          142ms
        </AppText>{' '}
        with 0% slippage.
      </AppText>
      <View style={styles.between}>
        <View style={{ flex: 1, height: 4, borderRadius: 4, backgroundColor: colors.ghost, overflow: 'hidden' }}>
          <View style={{ width: '99.8%', height: 4, backgroundColor: colors.yes }} />
        </View>
        <AppText variant="label-sm" color={colors.textSecondary}>
          99.8% Fill Rate
        </AppText>
      </View>
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  between: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: space.sm },
  inline: { flexDirection: 'row', alignItems: 'center', gap: space.sm },
  change: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
    padding: space.sm + 2,
    borderRadius: radii.md,
    backgroundColor: colors.inset,
    borderWidth: 1,
  },
  tiles: { flexDirection: 'row', gap: space.md },
  tile: { flex: 1, gap: 4, padding: space.md, borderRadius: radii.md, backgroundColor: colors.inset, borderWidth: 1, borderColor: colors.border },
  ribbon: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: space.sm, paddingVertical: 5, borderRadius: radii.sm + 2, backgroundColor: colors.ghost },
});
