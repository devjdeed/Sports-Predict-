import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { StyleSheet, View } from 'react-native';

import { compact, int } from '@/domain/format';
import type { Market } from '@/domain/types';
import { colors, fonts, space } from '@/theme';
import { AppText } from '../ui/AppText';
import { ProgressBar, SplitBar } from '../ui/Bars';
import { GlassCard } from '../ui/GlassCard';

/** Synthetic top-of-book derived from price and liquidity (deterministic per price level). */
function book(market: Market) {
  const base = market.liquidity / 22;
  const skew = (market.yesPrice - market.prevYesPrice) * 0.08;
  const bid = Math.round(base * (1 + skew) * (0.9 + ((market.yesPrice * 7) % 10) / 25));
  const ask = Math.round(base * (1 - skew) * (0.5 + ((market.yesPrice * 3) % 10) / 25));
  return { bid, ask, max: Math.max(bid, ask) };
}

export function OrderBook({ market }: { market: Market }) {
  const { bid, ask, max } = book(market);
  return (
    <GlassCard style={styles.card}>
      <View style={styles.between}>
        <AppText variant="label-sm" upper color={colors.textSecondary}>
          Order Book
        </AppText>
        <AppText variant="label-sm" color={colors.cyan}>
          ${compact(market.liquidity)} VOL
        </AppText>
      </View>
      <Level label={`${market.yesPrice}¢ BID`} size={bid} max={max} color={colors.yes} />
      <Level label={`${Math.min(99, market.yesPrice + 1)}¢ ASK`} size={ask} max={max} color={colors.no} />
    </GlassCard>
  );
}

function Level({ label, size, max, color }: { label: string; size: number; max: number; color: string }) {
  return (
    <View style={{ gap: 4 }}>
      <View style={styles.between}>
        <AppText variant="label-md" color={color}>
          {label}
        </AppText>
        <AppText variant="label-md">{int(size)} sh</AppText>
      </View>
      <ProgressBar value={size / max} height={4} color={color} />
    </View>
  );
}

export function Consensus({ market }: { market: Market }) {
  // Crowd leans slightly harder than price, like real retail sentiment.
  const yes = Math.min(97, Math.max(3, Math.round(market.yesPrice + (market.yesPrice - 50) * 0.25)));
  return (
    <GlassCard style={styles.card}>
      <View style={styles.between}>
        <AppText variant="label-sm" upper color={colors.textSecondary}>
          Community{'\n'}Consensus
        </AppText>
        <AppText variant="label-sm" color={colors.textSecondary} align="right">
          {int(market.votes)}
          {'\n'}votes
        </AppText>
      </View>
      <View style={styles.between}>
        <AppText variant="headline-md" weight={fonts.display800} color={colors.yes}>
          {yes}% YES
        </AppText>
        <AppText variant="label-md" color={colors.no}>
          {100 - yes}% NO
        </AppText>
      </View>
      <SplitBar yes={yes} height={6} />
      <View style={styles.inline}>
        <MaterialCommunityIcons name="trending-up" size={13} color={colors.yes} />
        <AppText variant="label-sm" color={colors.textMuted}>
          Whale flow favors {yes >= 50 ? 'YES' : 'NO'}
        </AppText>
      </View>
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  card: { flex: 1, gap: space.sm, padding: space.md },
  between: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: space.sm },
  inline: { flexDirection: 'row', alignItems: 'center', gap: 4 },
});
