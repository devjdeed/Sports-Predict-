import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { clockShort, compact, leagueShort, money0 } from '@/domain/format';
import { returnPct, sidePrice } from '@/domain/pricing';
import type { Market, Match, Side } from '@/domain/types';
import { useMatch } from '@/store/marketStore';
import { colors, fonts, radii, space } from '@/theme';
import { CandleMini } from '../charts/CandleMini';
import { AppText } from '../ui/AppText';
import { Avatar } from '../ui/Avatar';
import { SplitBar } from '../ui/Bars';
import { GlassCard } from '../ui/GlassCard';
import { LiveDot } from '../ui/LiveDot';
import { PressableScale } from '../ui/PressableScale';
import { PriceFlash } from '../ui/PriceFlash';
import { Tag } from '../ui/Tag';
import { YesNoButton } from '../ui/YesNoButton';

export interface MarketCardProps {
  market: Market;
  onOpen: () => void;
  onTrade: (side: Side, stake?: number) => void;
  selected?: boolean;
}

/** Feed card; layout follows the market kind (match / spread / player prop) as in the Markets mockup. */
export function MarketCard(props: MarketCardProps) {
  const match = useMatch(props.market.matchId);
  if (!match) return null;
  const Body = props.market.kind === 'spread' ? SpreadBody : props.market.kind === 'prop' ? PropBody : MatchBody;
  const leaning = props.market.yesPrice >= 50 ? 'bull' : 'bear';

  return (
    <PressableScale haptic="none" onPress={props.onOpen} accessibilityLabel={props.market.question}>
      <GlassCard aura={match.status === 'live' ? leaning : undefined} style={[styles.card, props.selected && styles.selected]}>
        <Body {...props} match={match} />
        {props.market.status === 'settled' && <SettledOverlay outcome={props.market.outcome!} />}
      </GlassCard>
    </PressableScale>
  );
}

type BodyProps = MarketCardProps & { match: Match };

function ClockPill({ match }: { match: Match }) {
  const live = match.status === 'live';
  return (
    <View style={[styles.clock, live && { backgroundColor: colors.noTint }]}>
      {match.status !== 'upcoming' && <LiveDot color={live ? colors.no : colors.gold} size={7} ping={live} />}
      <AppText variant="label-md" color={live ? colors.text : colors.textSecondary} weight={fonts.mono600}>
        {clockShort(match.clock)}
        {live && match.clock.mode === 'up' ? ' LIVE' : ''}
      </AppText>
    </View>
  );
}

function MatchBody({ market, match, onTrade }: BodyProps) {
  const yes = market.yesPrice;
  const no = sidePrice(yes, 'NO');
  const settled = market.status === 'settled';
  return (
    <>
      <View style={styles.headerRow}>
        <ClockPill match={match} />
        <AppText variant="label-sm" upper color={colors.textSecondary} style={{ flex: 1 }} numberOfLines={2}>
          {match.league}
        </AppText>
        <View style={styles.traders}>
          <MaterialCommunityIcons name="access-point" size={14} color={colors.textSecondary} />
          <AppText variant="label-sm" color={colors.textSecondary}>
            {compact(market.traders)}{'\n'}Traders
          </AppText>
        </View>
      </View>

      <View style={styles.teams}>
        <View style={styles.team}>
          <Avatar initials={match.home.code} color={match.home.color} size={36} />
          <View style={{ flexShrink: 1 }}>
            <AppText variant="headline-sm" weight={fonts.display700} upper>
              {match.home.name}
            </AppText>
            {match.home.tag && (
              <AppText variant="label-sm" color={colors.yes}>
                {match.home.tag}
              </AppText>
            )}
          </View>
        </View>
        <View style={styles.score}>
          <AppText variant="headline-md" weight={fonts.mono700}>
            {match.home.score} - {match.away.score}
          </AppText>
        </View>
        <View style={[styles.team, { justifyContent: 'flex-end' }]}>
          <View style={{ flexShrink: 1, alignItems: 'flex-end' }}>
            <AppText variant="headline-sm" weight={fonts.display700} upper align="right">
              {match.away.name}
            </AppText>
            {match.away.tag && (
              <AppText variant="label-sm" color={colors.textSecondary}>
                {match.away.tag}
              </AppText>
            )}
          </View>
          <Avatar initials={match.away.code} color={match.away.color} size={36} />
        </View>
      </View>

      <AppText variant="headline-md" upper>
        {market.question}
      </AppText>

      <View style={{ gap: space.sm }}>
        <View style={styles.between}>
          <View style={styles.inline}>
            <MaterialCommunityIcons name="trending-up" size={14} color={colors.yes} />
            <AppText variant="label-md" color={colors.yes}>
              YES {yes}%
            </AppText>
          </View>
          <View style={styles.inline}>
            <AppText variant="label-md" color={colors.no}>
              NO {no}%
            </AppText>
            <MaterialCommunityIcons name="trending-down" size={14} color={colors.no} />
          </View>
        </View>
        <SplitBar yes={yes} />
      </View>

      <View style={[styles.between, styles.infoStrip]}>
        <View style={styles.inline}>
          <MaterialCommunityIcons name="fire" size={14} color={colors.no} />
          <AppText variant="label-sm" upper color={colors.textSecondary}>
            {market.context ?? 'Live market'}
          </AppText>
        </View>
        <AppText variant="label-sm" color={colors.textSecondary}>
          {money0(market.volume)} Vol
        </AppText>
      </View>

      <View style={styles.buttons}>
        <YesNoButton side="YES" price={yes} layout="stacked" size="lg" subtitle={`+${Math.round(returnPct(yes) * 100)}% Est. Return`} onPress={() => onTrade('YES')} disabled={settled} />
        <YesNoButton side="NO" price={no} layout="stacked" size="lg" subtitle={`+${Math.round(returnPct(no) * 100)}% Est. Return`} onPress={() => onTrade('NO')} disabled={settled} />
      </View>
    </>
  );
}

const QUICK = [10, 25, 50] as const;

function SpreadBody({ market, match, onTrade }: BodyProps) {
  const [stake, setStake] = useState<number | 'max' | null>(null);
  const settled = market.status === 'settled';
  const trade = (side: Side) => onTrade(side, stake === 'max' ? Infinity : (stake ?? undefined));

  return (
    <>
      <View style={styles.headerRow}>
        <ClockPill match={match} />
        <AppText variant="label-sm" upper color={colors.textSecondary} style={{ flex: 1 }} numberOfLines={2}>
          {[leagueShort(match.league), match.venue].filter(Boolean).join(' · ')}
        </AppText>
        <View style={styles.inline}>
          <MaterialCommunityIcons name="chart-bar" size={14} color={colors.yes} />
          <AppText variant="label-sm" color={colors.yes}>
            {market.tag}
          </AppText>
        </View>
      </View>

      <View style={{ gap: space.xs }}>
        {[match.home, match.away].map((t) => (
          <View key={t.code} style={styles.between}>
            <View style={styles.inline}>
              <AppText variant="headline-sm" weight={fonts.display700} style={{ width: 44 }}>
                {t.code}
              </AppText>
              <AppText variant="body-lg">{t.short}</AppText>
            </View>
            <PriceFlash value={t.score} variant="label-lg" />
          </View>
        ))}
      </View>

      <AppText variant="headline-md" upper>
        {market.question}
      </AppText>

      <View style={[styles.between, styles.infoStrip]}>
        <View style={{ gap: 2 }}>
          <AppText variant="label-sm" upper color={colors.textSecondary}>
            Implied Probability
          </AppText>
          <AppText variant="label-lg" color={colors.yes}>
            {market.yesPrice}¢ YES / {100 - market.yesPrice}¢ NO
          </AppText>
        </View>
        <CandleMini data={market.history} />
      </View>

      <View style={styles.inline}>
        <AppText variant="label-sm" upper color={colors.textSecondary} style={{ marginRight: space.xs }}>
          Quick:
        </AppText>
        {[...QUICK, 'max' as const].map((q) => {
          const active = stake === q;
          return (
            <PressableScale key={q} onPress={() => setStake(active ? null : q)} style={[styles.quick, active && styles.quickActive]}>
              <AppText variant="label-md" color={active ? colors.yes : colors.text}>
                {q === 'max' ? 'Max' : `$${q}`}
              </AppText>
            </PressableScale>
          );
        })}
      </View>

      <View style={styles.buttons}>
        <YesNoButton side="YES" price={market.yesPrice} onPress={() => trade('YES')} disabled={settled} />
        <YesNoButton side="NO" price={100 - market.yesPrice} onPress={() => trade('NO')} disabled={settled} />
      </View>
    </>
  );
}

function PropBody({ market, match, onTrade }: BodyProps) {
  const settled = market.status === 'settled';
  const player = market.player;
  return (
    <>
      <View style={styles.propHead}>
        <Avatar initials={player?.initials ?? match.home.code} color={match.home.color} size={52} square />
        <View style={{ flex: 1, gap: 4 }}>
          <Tag label={market.tag} tone="neutral" />
          <AppText variant="headline-sm" weight={fonts.display700} upper>
            {player?.name ?? match.home.name}
          </AppText>
          <AppText variant="label-sm" color={colors.textSecondary}>
            {player?.detail ?? match.league} · {clockShort(match.clock)}
          </AppText>
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          <AppText variant="label-sm" upper color={colors.textSecondary}>
            Liquidity
          </AppText>
          <AppText variant="label-lg">${compact(market.liquidity)}</AppText>
        </View>
      </View>

      <AppText variant="headline-md" upper>
        {market.question}
      </AppText>

      <View style={styles.between}>
        <View style={styles.inline}>
          <LiveDot color={colors.yes} size={7} ping={false} />
          <AppText variant="label-md" color={colors.textSecondary}>
            {market.yesPrice}% Implied YES
          </AppText>
        </View>
        <AppText variant="label-md" color={colors.textSecondary}>
          {(100 / market.yesPrice).toFixed(2)}x Multiple
        </AppText>
      </View>

      <View style={styles.buttons}>
        <YesNoButton side="YES" price={market.yesPrice} onPress={() => onTrade('YES')} disabled={settled} />
        <YesNoButton side="NO" price={100 - market.yesPrice} onPress={() => onTrade('NO')} disabled={settled} />
      </View>
    </>
  );
}

function SettledOverlay({ outcome }: { outcome: Side }) {
  return (
    <View style={styles.settled} pointerEvents="none">
      <Tag label={`Settled · ${outcome}`} tone={outcome === 'YES' ? 'yes' : 'no'} solid />
    </View>
  );
}

const styles = StyleSheet.create({
  card: { gap: space.lg },
  selected: { borderColor: colors.cyan },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: space.md },
  clock: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: space.sm + 2,
    paddingVertical: 6,
    borderRadius: radii.md + 4,
    backgroundColor: colors.ghost,
  },
  traders: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  teams: { flexDirection: 'row', alignItems: 'center', gap: space.sm },
  team: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: space.sm },
  score: {
    paddingHorizontal: space.md,
    paddingVertical: space.sm,
    borderRadius: radii.md,
    backgroundColor: colors.inset,
    borderWidth: 1,
    borderColor: colors.border,
  },
  between: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: space.sm },
  inline: { flexDirection: 'row', alignItems: 'center', gap: space.xs + 2, flexShrink: 1 },
  infoStrip: {
    padding: space.md,
    borderRadius: radii.md,
    backgroundColor: colors.inset,
    borderWidth: 1,
    borderColor: colors.border,
  },
  buttons: { flexDirection: 'row', gap: space.md },
  quick: {
    paddingHorizontal: space.md,
    paddingVertical: 6,
    borderRadius: radii.sm + 2,
    backgroundColor: colors.ghost,
    borderWidth: 1,
    borderColor: colors.border,
  },
  quickActive: { borderColor: colors.yes, backgroundColor: colors.yesTint },
  propHead: { flexDirection: 'row', gap: space.md, alignItems: 'flex-start' },
  settled: { position: 'absolute', top: space.md, right: space.md },
});
