import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { BADGES_TOTAL, BADGES_UNLOCKED, badges, streakLadder, type LeaderEntry } from '@/data/social';
import { int, money, pct, signedMoney0 } from '@/domain/format';
import { multiplierFor, nextTier, STREAK_GOAL } from '@/domain/progression';
import { usePortfolio } from '@/hooks/usePortfolio';
import { useTradingStore } from '@/store/tradingStore';
import { colors, fonts, radii, space } from '@/theme';
import { AppText } from '../ui/AppText';
import { Avatar } from '../ui/Avatar';
import { ProgressBar } from '../ui/Bars';
import { GlassCard } from '../ui/GlassCard';
import { PressableScale } from '../ui/PressableScale';
import { Tag } from '../ui/Tag';

const SEASON_END = Date.now() + ((4 * 24 + 14) * 60 + 22) * 60_000;

function useCountdown(end: number) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 30_000);
    return () => clearInterval(t);
  }, []);
  const mins = Math.max(0, Math.floor((end - now) / 60_000));
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${pad(Math.floor(mins / 1440))}D : ${pad(Math.floor((mins % 1440) / 60))}H : ${pad(mins % 60)}M`;
}

export function SeasonHero() {
  const profile = useTradingStore((s) => s.profile);
  const countdown = useCountdown(SEASON_END);
  return (
    <GlassCard hero style={{ gap: space.md }}>
      <View style={styles.between}>
        <Tag label="Season 4 Sprint" tone="yes" dotColor={colors.yes} live />
        <View style={styles.timer}>
          <MaterialCommunityIcons name="timer-outline" size={14} color={colors.text} />
          <AppText variant="label-md">{countdown}</AppText>
        </View>
      </View>
      <AppText variant="headline-xl" weight={fonts.display800} upper>
        Apex Champions League Sprint
      </AppText>
      <View style={[styles.inline, { flexWrap: 'wrap' }]}>
        <AppText variant="label-md" upper color={colors.textSecondary}>
          Prize Pool:
        </AppText>
        <AppText variant="headline-md" color={colors.yes}>
          $25,000 USDC
        </AppText>
        <AppText variant="body-sm" color={colors.textSecondary}>
          • VIP Box Pass
        </AppText>
      </View>
      <View style={styles.rankBox}>
        <View>
          <Avatar icon="diamond-stone" size={48} color={colors.cyan} square />
          <View style={styles.rankBadge}>
            <AppText variant="label-sm" weight={fonts.mono700} color={colors.onYes} style={{ fontSize: 8 }}>
              #{profile.rank}
            </AppText>
          </View>
        </View>
        <View style={{ flex: 1, gap: 2 }}>
          <AppText variant="headline-sm" weight={fonts.display700}>
            RANK #{profile.rank}
          </AppText>
          <AppText variant="label-sm" color={colors.textSecondary}>
            of {int(profile.rankOf)} · Diamond I
          </AppText>
        </View>
        <View style={{ alignItems: 'flex-end', gap: 2 }}>
          <AppText variant="label-lg">{int(profile.xp)} XP</AppText>
          <AppText variant="label-sm" color={colors.yes}>
            Top {((profile.rank / profile.rankOf) * 100).toFixed(1)}% Bracket
          </AppText>
        </View>
      </View>
    </GlassCard>
  );
}

export function StreakCard() {
  const streak = useTradingStore((s) => s.profile.streak);
  const next = nextTier(streak);

  return (
    <GlassCard style={{ gap: space.lg }}>
      <View style={styles.inline}>
        <View style={styles.flame}>
          <AppText style={{ fontSize: 26, lineHeight: 32 }}>🔥</AppText>
        </View>
        <View style={{ flex: 1 }}>
          <View style={[styles.inline, { flexWrap: 'wrap' }]}>
            <AppText variant="headline-md" upper>
              {streak} Consecutive Wins
            </AppText>
            {streak >= 7 && <Tag label="Max Heat" tone="yes" />}
          </View>
          <AppText variant="label-md" color={colors.yes}>
            {multiplierFor(streak).toFixed(1)}x XP Boost Active
          </AppText>
        </View>
        <MaterialCommunityIcons name="information-outline" size={22} color={colors.textSecondary} />
      </View>

      {next && (
        <View style={styles.target}>
          <View style={styles.inline}>
            <View style={styles.dot} />
            <AppText variant="label-md" upper color={colors.cyan}>
              Next Multiplier Target
            </AppText>
          </View>
          <AppText variant="body-sm" color={colors.textSecondary}>
            Predict {next.minStreak - streak} more winning market{next.minStreak - streak > 1 ? 's' : ''} to unlock{' '}
            <AppText variant="body-sm" color={colors.text} weight={fonts.body700}>
              {next.multiplier.toFixed(1)}x multiplier
            </AppText>{' '}
            and a <AppText variant="body-sm" color={colors.yes} weight={fonts.body700}>$10 bonus trading token</AppText>.
          </AppText>
        </View>
      )}

      <View style={{ gap: space.sm }}>
        <View style={styles.between}>
          <AppText variant="label-sm" upper color={colors.textSecondary}>
            Streak Ladder
          </AppText>
          <AppText variant="label-sm" color={colors.yes}>
            Next: Day {STREAK_GOAL} ($100 Token)
          </AppText>
        </View>
        <ProgressBar value={Math.min(streak, STREAK_GOAL) / STREAK_GOAL} height={8} />
        <View style={styles.ladder}>
          {streakLadder.map((step) => {
            const current = streak === step.day;
            const done = streak > step.day;
            const locked = streak < step.day;
            return (
              <View key={step.day} style={styles.step}>
                <View style={[styles.node, done && styles.nodeDone, current && styles.nodeCurrent, locked && styles.nodeLocked]}>
                  {locked ? (
                    <MaterialCommunityIcons name={step.day === STREAK_GOAL ? 'gift-outline' : 'lock-outline'} size={14} color={colors.textMuted} />
                  ) : current ? (
                    <AppText variant="label-md" weight={fonts.mono700} color={colors.onYes}>
                      {step.day}
                    </AppText>
                  ) : (
                    <MaterialCommunityIcons name="check" size={16} color={colors.onYes} />
                  )}
                </View>
                <AppText variant="label-sm" color={current ? colors.text : colors.textSecondary} weight={current ? fonts.mono700 : undefined}>
                  {step.label}
                </AppText>
                <AppText variant="label-sm" color={locked ? colors.textMuted : colors.yes}>
                  {step.reward}
                </AppText>
              </View>
            );
          })}
        </View>
      </View>
    </GlassCard>
  );
}

export function BadgeGrid({ columns }: { columns: number }) {
  return (
    <View style={{ gap: space.md }}>
      <View style={styles.between}>
        <AppText variant="headline-md" upper>
          Arena Badges
        </AppText>
        <AppText variant="label-sm" color={colors.yes}>
          {BADGES_UNLOCKED} / {BADGES_TOTAL} UNLOCKED
        </AppText>
      </View>
      <View style={styles.grid}>
        {badges.slice(0, columns >= 6 ? 6 : 4).map((b) => (
          <GlassCard key={b.id} style={[styles.badge, { flexBasis: `${100 / Math.min(columns, 6) - 3}%` }]}>
            <Avatar icon={b.icon as never} size={44} color={b.color} />
            <AppText variant="label-md" align="center" numberOfLines={2}>
              {b.name}
            </AppText>
            <AppText variant="label-sm" color={b.unlocked ? b.color : colors.textMuted}>
              {b.tier}
            </AppText>
          </GlassCard>
        ))}
      </View>
    </View>
  );
}

const MEDAL = [colors.gold, colors.cyan, colors.yes];

export function LeaderRow({ entry }: { entry: LeaderEntry }) {
  const top = entry.rank <= 3;
  const medal = MEDAL[entry.rank - 1];
  return (
    <GlassCard accent={top ? medal : undefined} style={styles.leader}>
      {top ? (
        <View>
          <Avatar icon={entry.rank === 1 ? 'crown' : 'medal'} size={40} color={medal} />
          <View style={[styles.place, { backgroundColor: medal }]}>
            <AppText variant="label-sm" weight={fonts.mono700} color={colors.onYes} style={{ fontSize: 9 }}>
              {entry.rank}
            </AppText>
          </View>
        </View>
      ) : (
        <AppText variant="headline-sm" color={colors.textSecondary} align="center" style={{ width: 40 }}>
          {entry.rank}
        </AppText>
      )}
      <View style={{ flex: 1, gap: 2 }}>
        <View style={styles.inline}>
          <AppText variant="headline-sm" weight={fonts.display700} numberOfLines={1}>
            {entry.handle}
          </AppText>
          {entry.verified && <MaterialCommunityIcons name="check-decagram-outline" size={14} color={colors.yes} />}
        </View>
        <AppText variant="label-sm" color={colors.textSecondary} numberOfLines={1}>
          <AppText variant="label-sm" color={colors.yes}>
            {pct(entry.hitRate)} Hit Rate
          </AppText>{' '}
          · {entry.predictions} Predictions
        </AppText>
      </View>
      <View style={{ alignItems: 'flex-end' }}>
        <AppText variant="headline-sm" weight={fonts.display800} color={colors.yes}>
          {signedMoney0(entry.pnl)}
        </AppText>
        <AppText variant="label-sm" color={colors.textSecondary}>
          Net P&L
        </AppText>
      </View>
    </GlassCard>
  );
}

export function MyRankBar({ onJump }: { onJump: () => void }) {
  const { netWorth } = usePortfolio();
  const { rank, wins, losses } = useTradingStore((s) => s.profile);
  return (
    <GlassCard style={[styles.leader, { backgroundColor: colors.elevated }]}>
      <LinearGradient colors={[colors.yes, colors.yesDeep]} style={styles.me}>
        <AppText variant="label-md" weight={fonts.mono700} color={colors.onYes}>
          #{rank}
        </AppText>
      </LinearGradient>
      <View style={{ flex: 1 }}>
        <View style={styles.inline}>
          <AppText variant="headline-sm" weight={fonts.display700}>
            You
          </AppText>
          <Tag label={`${pct(wins / Math.max(1, wins + losses))} ACC`} tone="yes" />
        </View>
        <AppText variant="headline-sm" weight={fonts.display800} color={colors.yes}>
          +{money(netWorth)}
        </AppText>
      </View>
      <PressableScale onPress={onJump} style={styles.jump}>
        <MaterialCommunityIcons name="crosshairs-gps" size={16} color={colors.text} />
        <AppText variant="label-md" upper>
          Jump to me
        </AppText>
      </PressableScale>
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  between: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: space.sm },
  inline: { flexDirection: 'row', alignItems: 'center', gap: space.sm },
  timer: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: space.sm, paddingVertical: 4, borderRadius: radii.md, backgroundColor: colors.inset, borderWidth: 1, borderColor: colors.border },
  rankBox: { flexDirection: 'row', alignItems: 'center', gap: space.md, padding: space.md, borderRadius: radii.md + 2, backgroundColor: colors.inset, borderWidth: 1, borderColor: colors.border },
  rankBadge: { position: 'absolute', bottom: -6, right: -6, paddingHorizontal: 4, paddingVertical: 1, borderRadius: 8, backgroundColor: colors.yes },
  flame: { width: 52, height: 52, borderRadius: radii.md + 4, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,120,40,0.14)', borderWidth: 1, borderColor: 'rgba(255,120,40,0.3)' },
  target: { gap: 4, padding: space.md, borderRadius: radii.md + 2, backgroundColor: colors.inset, borderWidth: 1, borderColor: colors.border },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.cyan },
  ladder: { flexDirection: 'row', justifyContent: 'space-between', marginTop: space.xs },
  step: { alignItems: 'center', gap: 4 },
  node: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  nodeDone: { backgroundColor: colors.yes },
  nodeCurrent: { backgroundColor: colors.yes, borderWidth: 3, borderColor: 'rgba(0,245,155,0.35)', width: 36, height: 36, borderRadius: 18 },
  nodeLocked: { backgroundColor: colors.ghost, borderWidth: 1, borderColor: colors.border },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: space.sm, justifyContent: 'space-between' },
  badge: { flexGrow: 1, alignItems: 'center', gap: space.sm, padding: space.md },
  leader: { flexDirection: 'row', alignItems: 'center', gap: space.md, padding: space.md, paddingLeft: space.lg },
  place: { position: 'absolute', bottom: -4, right: -4, width: 16, height: 16, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  me: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
  jump: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: space.md, paddingVertical: space.sm + 2, borderRadius: radii.md, backgroundColor: colors.ghost, borderWidth: 1, borderColor: colors.borderStrong },
});
