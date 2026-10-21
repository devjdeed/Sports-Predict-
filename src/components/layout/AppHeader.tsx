import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { money, signedPct } from '@/domain/format';
import { multiplierFor } from '@/domain/progression';
import { usePortfolio } from '@/hooks/usePortfolio';
import { useResponsive } from '@/hooks/useResponsive';
import { useTradingStore } from '@/store/tradingStore';
import { colors, fonts, radii, space } from '@/theme';
import { AppText } from '../ui/AppText';
import { Avatar } from '../ui/Avatar';
import { PressableScale } from '../ui/PressableScale';
import { PriceFlash } from '../ui/PriceFlash';

export function AppHeader() {
  const insets = useSafeAreaInsets();
  const { margin } = useResponsive();
  const { netWorth, weekPct } = usePortfolio();
  const streak = useTradingStore((s) => s.profile.streak);
  const up = weekPct >= 0;

  return (
    <View style={[styles.wrap, { paddingTop: insets.top + space.sm, paddingHorizontal: margin }]}>
      <LinearGradient colors={[colors.yes, '#00B377']} style={styles.logo}>
        <MaterialCommunityIcons name="lightning-bolt" size={20} color={colors.onYes} />
      </LinearGradient>

      <PressableScale style={styles.center} onPress={() => router.navigate('/portfolio')} accessibilityLabel="Open portfolio">
        <View style={styles.row}>
          <PriceFlash value={netWorth} format={money} variant="label-lg" weight={fonts.mono700} />
          <View style={[styles.delta, { backgroundColor: up ? colors.yesTint : colors.noTint }]}>
            <MaterialCommunityIcons name={up ? 'trending-up' : 'trending-down'} size={12} color={up ? colors.yes : colors.no} />
            <AppText variant="label-sm" color={up ? colors.yes : colors.no}>
              {signedPct(weekPct)}
            </AppText>
          </View>
        </View>
        <View style={styles.streak}>
          <AppText variant="label-sm">🔥</AppText>
          <AppText variant="label-sm" color={colors.gold}>
            {streak} STREAK
          </AppText>
          <AppText variant="label-sm" color={colors.textMuted}>
            ·
          </AppText>
          <AppText variant="label-sm" color={colors.textSecondary}>
            {multiplierFor(streak).toFixed(1)}x XP
          </AppText>
        </View>
      </PressableScale>

      <PressableScale onPress={() => router.navigate('/ranks')} accessibilityLabel="Open profile and ranks">
        <Avatar initials="YO" size={40} color={colors.cyan} online ring={colors.cyan} />
      </PressableScale>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: space.md,
    backgroundColor: colors.bg,
  },
  logo: { width: 36, height: 36, borderRadius: radii.md + 2, alignItems: 'center', justifyContent: 'center' },
  center: { alignItems: 'center', gap: 4 },
  row: { flexDirection: 'row', alignItems: 'center', gap: space.sm },
  delta: { flexDirection: 'row', alignItems: 'center', gap: 2, paddingHorizontal: 6, paddingVertical: 2, borderRadius: radii.sm },
  streak: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: space.sm,
    paddingVertical: 2,
    borderRadius: radii.sm + 2,
    backgroundColor: colors.ghost,
    borderWidth: 1,
    borderColor: colors.border,
  },
});
