import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { StyleSheet, View } from 'react-native';

import { clockLong } from '@/domain/format';
import type { Match } from '@/domain/types';
import { colors, fonts, radii, space } from '@/theme';
import { AppText } from '../ui/AppText';
import { Avatar } from '../ui/Avatar';
import { GlassCard } from '../ui/GlassCard';

/** Live scoreboard with telemetry (possession, shots, corners) when the match has stats. */
export function Scoreboard({ match }: { match: Match }) {
  const s = match.stats;
  return (
    <GlassCard style={{ gap: space.lg }}>
      <View style={styles.row}>
        <TeamSide team={match.home} align="left" />
        <View style={styles.center}>
          <AppText variant="headline-xl" weight={fonts.display800}>
            {match.home.score} : {match.away.score}
          </AppText>
          <View style={styles.clock}>
            <AppText variant="label-md" weight={fonts.mono700}>
              {clockLong(match.clock)}
            </AppText>
            {match.clock.mode === 'up' && (
              <AppText variant="label-sm" color={colors.textSecondary}>
                2H
              </AppText>
            )}
          </View>
        </View>
        <TeamSide team={match.away} align="right" />
      </View>

      {s && (
        <View style={{ gap: space.sm }}>
          {s.alert && (
            <View style={[styles.inline, { alignSelf: 'center' }]}>
              <MaterialCommunityIcons name="alert-outline" size={12} color={colors.no} />
              <AppText variant="label-sm" upper color={colors.no}>
                {s.alert}
              </AppText>
            </View>
          )}
          <View style={styles.between}>
            <AppText variant="label-sm" upper>
              Possession {s.possession[0]}%
            </AppText>
            <AppText variant="label-sm" upper>
              {s.possession[1]}% Possession
            </AppText>
          </View>
          <View style={styles.bar}>
            <View style={{ flex: s.possession[0], backgroundColor: colors.yes }} />
            <View style={{ flex: s.possession[1], backgroundColor: colors.no }} />
          </View>
          <View style={styles.between}>
            <Stat label="Shots on target" value={s.shotsOnTarget[0]} />
            <Stat label="Corner advantage" value={`${s.corners[0]}-${s.corners[1]}`} center />
            <Stat label="Shots on target" value={s.shotsOnTarget[1]} right />
          </View>
        </View>
      )}
    </GlassCard>
  );
}

function TeamSide({ team, align }: { team: Match['home']; align: 'left' | 'right' }) {
  const right = align === 'right';
  return (
    <View style={[styles.team, right && { flexDirection: 'row-reverse' }]}>
      <Avatar initials={team.code} color={team.color} size={40} />
      <View style={{ flexShrink: 1, alignItems: right ? 'flex-end' : 'flex-start' }}>
        <AppText variant="headline-md" upper numberOfLines={1}>
          {team.short}
        </AppText>
        {team.tag && (
          <AppText variant="label-sm" color={right ? colors.no : colors.yes} numberOfLines={2} align={right ? 'right' : 'left'}>
            {team.tag}
          </AppText>
        )}
      </View>
    </View>
  );
}

function Stat({ label, value, center, right }: { label: string; value: string | number; center?: boolean; right?: boolean }) {
  return (
    <View style={{ flex: 1, alignItems: center ? 'center' : right ? 'flex-end' : 'flex-start' }}>
      <AppText variant="label-sm" upper color={colors.textSecondary}>
        {label}
      </AppText>
      <AppText variant="label-md">{value}</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: space.sm },
  team: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: space.sm },
  center: { alignItems: 'center', gap: 4 },
  clock: {
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
    paddingHorizontal: space.sm,
    paddingVertical: 3,
    borderRadius: radii.sm + 2,
    backgroundColor: colors.inset,
    borderWidth: 1,
    borderColor: colors.border,
  },
  between: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: space.sm },
  inline: { flexDirection: 'row', alignItems: 'center', gap: 4, flexShrink: 1 },
  bar: { flexDirection: 'row', height: 6, borderRadius: 6, overflow: 'hidden', gap: 2 },
});
