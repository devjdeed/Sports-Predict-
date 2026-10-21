import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import * as Haptics from 'expo-haptics';
import { StyleSheet, View } from 'react-native';

import { duel, pulseSeed, squad, type Forecaster } from '@/data/social';
import { int, money, money0, signedMoney, signedPct } from '@/domain/format';
import { sidePrice } from '@/domain/pricing';
import { useMarket } from '@/store/marketStore';
import { toast } from '@/store/toastStore';
import { useTradingStore, type Result } from '@/store/tradingStore';
import { colors, fonts, radii, space } from '@/theme';
import { AppText } from '../ui/AppText';
import { Avatar } from '../ui/Avatar';
import { ProgressBar, SplitBar } from '../ui/Bars';
import { GlassCard } from '../ui/GlassCard';
import { PressableScale } from '../ui/PressableScale';
import { PriceFlash } from '../ui/PriceFlash';
import { Tag } from '../ui/Tag';

const COPY_STAKE = 25;
const CONTRIBUTION = 50;

const report = (r: Result) => {
  Haptics.notificationAsync(r.ok ? Haptics.NotificationFeedbackType.Success : Haptics.NotificationFeedbackType.Error).catch(() => {});
  toast(r.message, r.ok ? 'yes' : 'no');
};

export function SquadsHeader() {
  return (
    <View style={styles.between}>
      <View style={{ flex: 1, gap: 4 }}>
        <View style={styles.inline}>
          <View style={styles.pip} />
          <AppText variant="label-sm" upper color={colors.yes}>
            Syndicate Command
          </AppText>
        </View>
        <AppText variant="headline-xl" weight={fonts.display800} upper>
          Squads & Copy-Trading
        </AppText>
      </View>
      <View style={styles.activePill}>
        <MaterialCommunityIcons name="molecule" size={18} color={colors.cyan} />
        <AppText variant="label-md">
          {int(squad.activeSquads)}
          {'\n'}Active
        </AppText>
      </View>
    </View>
  );
}

export function SyndicateCard() {
  const contributed = useTradingStore((s) => s.vaultContribution);
  const contribute = useTradingStore((s) => s.contribute);
  const vault = squad.vault + contributed;
  // Members share the dividend pool by vault weight; ours starts at the mockup's illustrative share.
  const share = 118.33 + (contributed / vault) * squad.dividendPool;

  return (
    <GlassCard hero style={{ gap: space.lg }}>
      <View style={styles.inline}>
        <View>
          <Avatar icon="lightning-bolt" size={56} color={colors.yes} square />
          <View style={styles.rankChip}>
            <AppText variant="label-sm" weight={fonts.mono700} color={colors.onYes} style={{ fontSize: 9 }}>
              #{squad.rank}
            </AppText>
          </View>
        </View>
        <View style={{ flex: 1, gap: 2 }}>
          <AppText variant="headline-lg" upper>
            {squad.name}
          </AppText>
          <View style={styles.inline}>
            <MaterialCommunityIcons name="account-group-outline" size={13} color={colors.textSecondary} />
            <AppText variant="label-sm" color={colors.textSecondary} style={{ flexShrink: 1 }}>
              {squad.members} / {squad.capacity} Members Active
            </AppText>
          </View>
        </View>
        <View style={{ alignItems: 'flex-end', gap: 4 }}>
          <AppText variant="label-sm" upper color={colors.textSecondary}>
            30D ROI
          </AppText>
          <AppText variant="headline-md" color={colors.yes}>
            {signedPct(squad.roi30d)}
          </AppText>
          <Tag label={`Tier ${squad.tier}`} tone="yes" />
        </View>
      </View>

      <View style={styles.tiles}>
        <View style={styles.tile}>
          <AppText variant="label-sm" upper color={colors.textSecondary}>
            Collective Vault
          </AppText>
          <AppText variant="headline-md">
            {money0(vault)} <AppText variant="label-sm" color={colors.yes}>USD</AppText>
          </AppText>
          <ProgressBar value={vault / squad.vaultTarget} height={4} />
        </View>
        <View style={styles.tile}>
          <AppText variant="label-sm" upper color={colors.textSecondary}>
            Payout Dividend · <AppText variant="label-sm" upper color={colors.cyan}>{squad.dividendDay}</AppText>
          </AppText>
          <AppText variant="headline-md">
            {money0(squad.dividendPool)} <AppText variant="label-sm" color={colors.textSecondary}>Pool</AppText>
          </AppText>
          <AppText variant="label-sm" color={colors.textSecondary} numberOfLines={1}>
            Est. share +{money(share)}
          </AppText>
        </View>
      </View>

      <View style={styles.tiles}>
        <PressableScale onPress={() => toast('Squad chat opens with the live backend', 'info')} style={styles.secondary}>
          <MaterialCommunityIcons name="message-text-outline" size={18} color={colors.text} />
          <AppText variant="label-md" upper>
            Chat & Intel
          </AppText>
        </PressableScale>
        <PressableScale haptic="medium" onPress={() => report(contribute(CONTRIBUTION))} style={styles.primary}>
          <MaterialCommunityIcons name="plus-circle-outline" size={18} color={colors.onYes} />
          <AppText variant="headline-sm" weight={fonts.display800} upper color={colors.onYes}>
            Contribute ${CONTRIBUTION}
          </AppText>
        </PressableScale>
      </View>
    </GlassCard>
  );
}

export function ForecasterCard({ f }: { f: Forecaster }) {
  const market = useMarket(f.marketId);
  const copied = useTradingStore((s) => s.copied.includes(f.id));
  const copy = useTradingStore((s) => s.copyForecaster);
  if (!market) return null;
  const price = sidePrice(market.yesPrice, f.side);
  const settled = market.status === 'settled';

  return (
    <GlassCard style={{ gap: space.md }}>
      <View style={styles.inline}>
        <Avatar initials={f.kind === 'human' ? f.initials : undefined} icon={f.kind === 'quant' ? 'robot-outline' : undefined} size={48} color={f.kind === 'quant' ? colors.cyan : colors.yes} online={f.kind === 'human'} square={f.kind === 'quant'} />
        <View style={{ flex: 1, gap: 4 }}>
          <View style={styles.inline}>
            <AppText variant="headline-sm" weight={fonts.display700} upper style={{ flexShrink: 1 }}>
              {f.name}
            </AppText>
            {f.kind === 'quant' ? <Tag label="Quant" tone="cyan" /> : <MaterialCommunityIcons name="check-decagram-outline" size={16} color={colors.textSecondary} />}
          </View>
          <View style={styles.inline}>
            <Tag label={f.winRate} tone="yes" />
            <AppText variant="label-sm" color={colors.textSecondary}>
              · {f.stat}
            </AppText>
          </View>
        </View>
        <Tag label={f.kind === 'quant' ? 'Active Model' : '↗ 30D'} tone={f.kind === 'quant' ? 'yes' : 'neutral'} />
      </View>

      <View style={styles.pick}>
        <View style={styles.between}>
          <AppText variant="label-sm" upper color={colors.text} weight={fonts.mono700}>
            {f.label}
          </AppText>
          <AppText variant="label-sm" color={colors.textSecondary}>
            {f.league}
          </AppText>
        </View>
        <AppText variant="headline-sm" weight={fonts.display700} upper>
          {market.question}
        </AppText>
        <View style={styles.inline}>
          <View style={styles.pickPrice}>
            <AppText variant="headline-sm" weight={fonts.display800} color={colors.yes}>
              {f.side} @{' '}
            </AppText>
            <PriceFlash value={price} suffix="¢" variant="headline-sm" weight={fonts.display800} color={colors.yes} />
          </View>
          <AppText variant="label-sm" color={colors.textSecondary}>
            Implied Prob: {price}%
          </AppText>
        </View>
      </View>

      <View style={styles.intel}>
        <MaterialCommunityIcons name="lightbulb-on-outline" size={16} color={colors.cyan} />
        <AppText variant="body-sm" color={colors.textSecondary} style={{ flex: 1 }}>
          <AppText variant="body-sm" color={colors.text} weight={fonts.body700}>
            {f.kind === 'quant' ? 'Model Intel: ' : 'Sharp Intel: '}
          </AppText>
          {f.intel}
        </AppText>
      </View>

      <View style={styles.between}>
        <View style={styles.inline}>
          <MaterialCommunityIcons name="content-copy" size={14} color={colors.textSecondary} />
          <AppText variant="label-sm" color={colors.textSecondary}>
            {int(f.copiers + (copied ? 1 : 0))} {f.copyLabel}
          </AppText>
        </View>
        <PressableScale haptic="medium" disabled={settled} onPress={() => report(copy(f.id, COPY_STAKE))} style={styles.copy}>
          <MaterialCommunityIcons name={copied ? 'check' : 'lightning-bolt'} size={16} color={colors.onYes} />
          <AppText variant="headline-sm" weight={fonts.display800} upper color={colors.onYes}>
            {copied ? 'Copy Again' : 'Copy'} (${COPY_STAKE})
          </AppText>
        </PressableScale>
      </View>
    </GlassCard>
  );
}

export function DuelCard() {
  const pick = useTradingStore((s) => s.duelPick);
  const pickDuel = useTradingStore((s) => s.pickDuel);
  const left = duel.left.votes + (pick === 'left' ? 1 : 0);
  const right = duel.right.votes + (pick === 'right' ? 1 : 0);
  const share = left / (left + right);

  return (
    <GlassCard style={{ gap: space.md }} aura="bear">
      <View style={styles.between}>
        <View style={styles.inline}>
          <MaterialCommunityIcons name="sword-cross" size={18} color={colors.no} />
          <AppText variant="headline-md" upper>
            Duel of the Day
          </AppText>
        </View>
        <Tag label="Live Battle" tone="no" />
      </View>
      <AppText variant="headline-md" upper>
        {duel.title}
      </AppText>
      <AppText variant="body-sm" color={colors.textSecondary}>
        Market: {duel.market}
      </AppText>
      <View style={styles.between}>
        <AppText variant="label-md" color={colors.yes}>
          {duel.left.handle} <AppText variant="label-md" color={colors.textSecondary}>({duel.left.pick})</AppText>
        </AppText>
        <AppText variant="label-md" color={colors.no}>
          <AppText variant="label-md" color={colors.textSecondary}>({duel.right.pick})</AppText> {duel.right.handle}
        </AppText>
      </View>
      <SplitBar yes={share * 100} height={8} />
      <View style={styles.between}>
        <AppText variant="label-sm" color={colors.yes}>
          {Math.round(share * 100)}% Votes ({int(left)})
        </AppText>
        <AppText variant="label-sm" color={colors.no}>
          {Math.round((1 - share) * 100)}% Votes ({int(right)})
        </AppText>
      </View>
      <View style={styles.between}>
        <View style={styles.inline}>
          <MaterialCommunityIcons name="star-circle-outline" size={16} color={colors.yes} />
          <AppText variant="label-sm" color={colors.yes}>
            +{duel.bounty} XP Bounty
          </AppText>
        </View>
        {pick ? (
          <Tag label={`Picked ${pick === 'left' ? duel.left.pick : duel.right.pick}`} tone="yes" />
        ) : (
          <View style={styles.inline}>
            <PressableScale onPress={() => report(pickDuel('left'))} style={[styles.duelBtn, { borderColor: colors.yes }]}>
              <AppText variant="label-md" upper color={colors.yes}>
                {duel.left.pick}
              </AppText>
            </PressableScale>
            <PressableScale onPress={() => report(pickDuel('right'))} style={[styles.duelBtn, { borderColor: colors.no }]}>
              <AppText variant="label-md" upper color={colors.no}>
                {duel.right.pick}
              </AppText>
            </PressableScale>
          </View>
        )}
      </View>
    </GlassCard>
  );
}

export function PulseFeed() {
  const activity = useTradingStore((s) => s.activity);
  const mine = activity.slice(0, 3).map((a) => ({ id: a.id, who: 'You', initials: 'YO', text: a.text, value: signedMoney(a.amount), tone: a.amount >= 0 ? ('yes' as const) : ('no' as const) }));
  const items = [...mine, ...pulseSeed];

  return (
    <View style={{ gap: space.md }}>
      <View style={styles.between}>
        <View style={styles.inline}>
          <MaterialCommunityIcons name="pulse" size={18} color={colors.yes} />
          <AppText variant="headline-md" upper>
            Syndicate Pulse
          </AppText>
        </View>
        <AppText variant="label-sm" color={colors.textSecondary}>
          REAL-TIME
        </AppText>
      </View>
      {items.map((p) => (
        <GlassCard key={p.id} style={[styles.inline, { padding: space.md }]}>
          <Avatar initials={p.initials} size={32} color={p.who === 'You' ? colors.cyan : colors.textSecondary} />
          <AppText variant="body-sm" color={colors.textSecondary} style={{ flex: 1 }} numberOfLines={1}>
            <AppText variant="body-sm" weight={fonts.body700}>
              {p.who}
            </AppText>{' '}
            {p.text}
          </AppText>
          <AppText variant="label-sm" color={p.tone === 'yes' ? colors.yes : colors.no}>
            {p.value}
          </AppText>
        </GlassCard>
      ))}
    </View>
  );
}

export function SectionTitle({ icon, title, right }: { icon: keyof typeof MaterialCommunityIcons.glyphMap; title: string; right?: string }) {
  return (
    <View style={styles.between}>
      <View style={styles.inline}>
        <MaterialCommunityIcons name={icon} size={18} color={colors.yes} />
        <AppText variant="headline-md" upper>
          {title}
        </AppText>
      </View>
      {right && (
        <AppText variant="label-sm" upper color={colors.textSecondary}>
          {right}
        </AppText>
      )}
    </View>
  );
}


const styles = StyleSheet.create({
  between: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: space.sm },
  inline: { flexDirection: 'row', alignItems: 'center', gap: space.sm },
  pip: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.yes },
  activePill: { flexDirection: 'row', alignItems: 'center', gap: space.sm, paddingHorizontal: space.md, paddingVertical: space.sm, borderRadius: radii.full, backgroundColor: colors.ghost, borderWidth: 1, borderColor: colors.border },
  rankChip: { position: 'absolute', bottom: -4, right: -4, paddingHorizontal: 4, borderRadius: 6, backgroundColor: colors.yes },
  tiles: { flexDirection: 'row', gap: space.md },
  tile: { flex: 1, gap: space.xs + 2, padding: space.md, borderRadius: radii.md, backgroundColor: colors.inset, borderWidth: 1, borderColor: colors.border },
  secondary: { flex: 1, minHeight: 48, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: space.sm, borderRadius: radii.md, backgroundColor: colors.ghost, borderWidth: 1, borderColor: colors.borderStrong },
  primary: { flex: 1, minHeight: 48, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: space.sm, borderRadius: radii.md, backgroundColor: colors.yes, shadowColor: colors.yes, shadowOpacity: 0.35, shadowRadius: 12, shadowOffset: { width: 0, height: 2 } },
  pick: { gap: space.sm, padding: space.md, borderRadius: radii.md, backgroundColor: colors.inset, borderWidth: 1, borderColor: colors.border },
  pickPrice: { flexDirection: 'row', alignItems: 'baseline', paddingHorizontal: space.sm, paddingVertical: 2, borderRadius: radii.sm + 2, backgroundColor: colors.yesTint },
  intel: { flexDirection: 'row', gap: space.sm, padding: space.md, borderRadius: radii.md, backgroundColor: colors.ghostSubtle },
  copy: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: space.lg, minHeight: 44, borderRadius: radii.full, backgroundColor: colors.yes, shadowColor: colors.yes, shadowOpacity: 0.4, shadowRadius: 12, shadowOffset: { width: 0, height: 2 } },
  duelBtn: { paddingHorizontal: space.md, paddingVertical: space.sm, borderRadius: radii.md, borderWidth: 1, backgroundColor: colors.ghost },
});
