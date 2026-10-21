import { ScrollView, StyleSheet } from 'react-native';

import { clockShort, leagueShort } from '@/domain/format';
import { useResponsive } from '@/hooks/useResponsive';
import { useMarketStore } from '@/store/marketStore';
import { colors, radii, space } from '@/theme';
import { AppText } from '../ui/AppText';
import { LiveDot } from '../ui/LiveDot';
import { PressableScale } from '../ui/PressableScale';

/** Horizontal strip of live scores; tapping one jumps to its lead market. */
export function LiveScoreTicker({ onSelectMatch }: { onSelectMatch: (matchId: string) => void }) {
  const matches = useMarketStore((s) => s.matches);
  const { margin } = useResponsive();
  const live = matches.filter((m) => m.status === 'live' || m.status === 'break');

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -margin }} contentContainerStyle={[styles.row, { paddingHorizontal: margin }]}>
      {live.map((m) => (
        <PressableScale key={m.id} style={styles.pill} onPress={() => onSelectMatch(m.id)}>
          <LiveDot color={colors.no} size={7} ping={m.status === 'live'} />
          <AppText variant="label-md" color={colors.textSecondary} upper>
            {leagueShort(m.league)}
          </AppText>
          <AppText variant="label-md">
            {m.home.code} {m.home.score} - {m.away.score} {m.away.code}
          </AppText>
          <AppText variant="label-md" color={colors.cyan}>
            {clockShort(m.clock)}
          </AppText>
        </PressableScale>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: { gap: space.sm },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
    height: 36,
    paddingHorizontal: space.md,
    borderRadius: radii.full,
    backgroundColor: colors.cardSolid,
    borderWidth: 1,
    borderColor: colors.border,
  },
});
