import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { StyleSheet, View } from 'react-native';

import { multiplierFor, STREAK_GOAL } from '@/domain/progression';
import { useTradingStore } from '@/store/tradingStore';
import { colors, fonts, radii, space } from '@/theme';
import { AppText } from '../ui/AppText';
import { ProgressBar } from '../ui/Bars';
import { GlassCard } from '../ui/GlassCard';
import { Tag } from '../ui/Tag';

export function StreakBanner() {
  const streak = useTradingStore((s) => s.profile.streak);
  const day = Math.min(streak, STREAK_GOAL);

  return (
    <GlassCard style={styles.card}>
      <View style={styles.row}>
        <View style={styles.icon}>
          <MaterialCommunityIcons name="lightning-bolt" size={22} color={colors.yes} />
        </View>
        <View style={{ flex: 1, gap: 2 }}>
          <View style={styles.titleRow}>
            <AppText variant="headline-sm" weight={fonts.display700} upper>
              {streak > 0 ? `${streak}-Day Streak Active` : 'Start a Streak'}
            </AppText>
            {streak > 0 && <Tag label={`${multiplierFor(streak).toFixed(1)}x XP`} tone="yes" solid />}
          </View>
          <AppText variant="body-sm" color={colors.textSecondary}>
            Next win triggers a <AppText variant="body-sm" color={colors.yes} weight={fonts.body700}>$5 Risk-Free</AppText> boost
          </AppText>
        </View>
        <View style={{ alignItems: 'flex-end', gap: 2 }}>
          <AppText variant="label-md" color={colors.gold} weight={fonts.mono700}>
            DAY {day}/{STREAK_GOAL}
          </AppText>
          <MaterialCommunityIcons name="star-four-points-outline" size={18} color={colors.gold} />
        </View>
      </View>
      <ProgressBar value={day / STREAK_GOAL} height={6} />
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  card: { gap: space.md },
  row: { flexDirection: 'row', alignItems: 'center', gap: space.md },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: space.sm, flexWrap: 'wrap' },
  icon: {
    width: 40,
    height: 40,
    borderRadius: radii.md + 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.yesTint,
    borderWidth: 1,
    borderColor: 'rgba(0,245,155,0.25)',
  },
});
