import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

import { money, mmss, signedPct } from '@/domain/format';
import { clampPrice, quote, sidePrice } from '@/domain/pricing';
import type { Side } from '@/domain/types';
import { useMarket, useMatch } from '@/store/marketStore';
import { toast } from '@/store/toastStore';
import { useTradingStore } from '@/store/tradingStore';
import { colors, fonts, radii, space } from '@/theme';
import { AppText } from '../ui/AppText';
import { GlassCard } from '../ui/GlassCard';
import { PressableScale } from '../ui/PressableScale';
import { PriceFlash } from '../ui/PriceFlash';
import { SegmentedTabs } from '../ui/SegmentedTabs';
import { Tag } from '../ui/Tag';

const QUICK = [10, 25, 50, 100] as const;

interface Props {
  marketId: string;
  side: Side;
  onSideChange?: (side: Side) => void;
  /** Initial stake; `Infinity` means MAX. */
  initialStake?: number;
  onDone?: () => void;
  bare?: boolean;
}

/** Quick Trade Execution: side toggle, stake, market/limit, payout breakdown and submit. */
export function TradeSlip({ marketId, side: sideProp, onSideChange, initialStake, onDone, bare }: Props) {
  const market = useMarket(marketId);
  const match = useMatch(market?.matchId);
  const cash = useTradingStore((s) => s.cash);
  const buy = useTradingStore((s) => s.buy);
  const placeLimit = useTradingStore((s) => s.placeLimit);

  // Controlled when the parent tracks the side (Trade tab), local otherwise (bottom sheet).
  const [localSide, setLocalSide] = useState<Side>(sideProp);
  const side = onSideChange ? sideProp : localSide;
  const [stake, setStake] = useState(() => (initialStake === Infinity ? Math.floor(cash) : (initialStake ?? 50)));
  const [mode, setMode] = useState<'market' | 'limit'>('market');
  // A custom limit only applies to the market/side it was set on.
  const [customLimit, setCustomLimit] = useState<{ key: string; price: number } | null>(null);
  const [lastQuick, setLastQuick] = useState<number | 'max' | null>(null);


  if (!market) return null;
  const marketPrice = sidePrice(market.yesPrice, side);
  const limitKey = `${marketId}:${side}`;
  const limitPrice = customLimit?.key === limitKey ? customLimit.price : clampPrice(marketPrice - 2);
  const price = mode === 'limit' ? limitPrice : marketPrice;
  const setLimitPrice = (p: number) => setCustomLimit({ key: limitKey, price: p });
  const q = quote(Math.min(stake, cash), price);
  const settled = market.status === 'settled';
  const yesSide = side === 'YES';
  const accent = yesSide ? colors.yes : colors.no;

  const setSide = (s: Side) => (onSideChange ? onSideChange(s) : setLocalSide(s));
  const setStakeSafe = (v: number) => setStake(Math.max(0, Math.min(Math.round(v * 100) / 100, Math.floor(cash))));

  const submit = () => {
    const result = mode === 'market' ? buy(market.id, side, stake) : placeLimit(market.id, side, price, stake);
    Haptics.notificationAsync(result.ok ? Haptics.NotificationFeedbackType.Success : Haptics.NotificationFeedbackType.Error).catch(() => {});
    toast(result.message, result.ok ? (yesSide ? 'yes' : 'no') : 'no');
    if (result.ok) onDone?.();
  };

  const closeNote =
    market.closesAt !== undefined && match?.clock.mode === 'up'
      ? `Cash out permitted until ${mmss(market.closesAt - 1)}.`
      : 'Cash out permitted any time before settlement.';

  const content = (
    <View style={{ gap: space.lg }}>
      <View style={styles.between}>
        <AppText variant="headline-md" upper>
          Quick Trade Execution
        </AppText>
        <Tag label="0% Taker Fee" tone="neutral" />
      </View>

      <View style={styles.sides}>
        {(['YES', 'NO'] as const).map((s) => {
          const active = s === side;
          const c = s === 'YES' ? colors.yes : colors.no;
          return (
            <PressableScale
              key={s}
              onPress={() => setSide(s)}
              accessibilityState={{ selected: active }}
              style={[styles.side, active && { backgroundColor: c, borderColor: c }]}>
              <View style={styles.inline}>
                <MaterialCommunityIcons name={s === 'YES' ? 'check-circle-outline' : 'close-circle-outline'} size={18} color={active ? (s === 'YES' ? colors.onYes : colors.text) : colors.textSecondary} />
                <AppText variant="headline-sm" weight={fonts.display800} color={active ? (s === 'YES' ? colors.onYes : colors.text) : colors.textSecondary}>
                  {s}
                </AppText>
              </View>
              <PriceFlash value={sidePrice(market.yesPrice, s)} suffix="¢" variant="label-lg" color={active ? (s === 'YES' ? colors.onYes : colors.text) : colors.textSecondary} flash={!active} />
            </PressableScale>
          );
        })}
      </View>

      <SegmentedTabs
        options={[
          { key: 'market', label: 'Market' },
          { key: 'limit', label: 'Limit' },
        ]}
        value={mode}
        onChange={setMode}
      />

      {mode === 'limit' && (
        <View style={styles.between}>
          <AppText variant="label-sm" upper color={colors.textSecondary}>
            Limit Price (market {marketPrice}¢)
          </AppText>
          <View style={styles.inline}>
            <StepButton icon="minus" onPress={() => setLimitPrice(clampPrice(price - 1))} />
            <AppText variant="label-lg" style={{ minWidth: 44 }} align="center">
              {price}¢
            </AppText>
            <StepButton icon="plus" onPress={() => setLimitPrice(clampPrice(price + 1))} />
          </View>
        </View>
      )}

      <View style={{ gap: space.sm }}>
        <View style={styles.between}>
          <AppText variant="label-sm" upper color={colors.textSecondary}>
            Stake Capital
          </AppText>
          <AppText variant="label-sm" upper color={colors.textSecondary}>
            Available: <AppText variant="label-sm" color={colors.text}>{money(cash)}</AppText>
          </AppText>
        </View>
        <View style={styles.stakeRow}>
          <StepButton icon="minus" big onPress={() => setStakeSafe(stake - 5)} />
          <View style={styles.stakeCenter}>
            <View style={styles.inline}>
              <AppText variant="headline-sm" color={colors.yes}>
                $
              </AppText>
              <TextInput
                value={String(stake)}
                onChangeText={(t) => setStakeSafe(Number(t.replace(/[^0-9]/g, '')) || 0)}
                keyboardType="number-pad"
                selectionColor={colors.yes}
                style={styles.stakeInput}
                accessibilityLabel="Stake amount in dollars"
              />
            </View>
            <AppText variant="label-sm" upper color={colors.textMuted}>
              {q.contracts} contracts
            </AppText>
          </View>
          <StepButton icon="plus" big onPress={() => setStakeSafe(stake + 5)} />
        </View>
        <View style={styles.quickRow}>
          {QUICK.map((v) => (
            <PressableScale
              key={v}
              onPress={() => {
                setLastQuick(v);
                setStakeSafe(stake + v);
              }}
              style={[styles.quick, lastQuick === v && styles.quickActive]}>
              <AppText variant="label-md" color={lastQuick === v ? colors.text : colors.textSecondary}>
                +${v}
              </AppText>
            </PressableScale>
          ))}
          <PressableScale
            onPress={() => {
              setLastQuick('max');
              setStakeSafe(cash);
            }}
            style={[styles.quick, lastQuick === 'max' && styles.quickActive]}>
            <AppText variant="label-md" weight={fonts.mono700} color={colors.text}>
              MAX
            </AppText>
          </PressableScale>
        </View>
      </View>

      <View style={styles.summary}>
        <Row label={`Execution Price (${side})`} value={`${price}¢ / Share`} />
        <Row label="Actual Total Investment" value={money(q.cost)} />
        <View style={styles.between}>
          <AppText variant="label-md" color={colors.textSecondary}>
            Platform Taker Fee
          </AppText>
          <View style={styles.inline}>
            <AppText variant="label-md" color={colors.textMuted} style={{ textDecorationLine: 'line-through' }}>
              {money(q.listFee)}
            </AppText>
            <AppText variant="label-md" color={colors.yes}>
              {money(q.fee)} (PROMO)
            </AppText>
          </View>
        </View>
        <View style={styles.divider} />
        <View style={styles.between}>
          <AppText variant="label-md" upper>
            Estimated Return
          </AppText>
          <View style={{ alignItems: 'flex-end' }}>
            <AppText variant="headline-sm" weight={fonts.mono700} color={colors.yes}>
              {money(q.payout)}
            </AppText>
            <AppText variant="label-sm" color={colors.yes}>
              +{money(q.profit)} Net ({signedPct(q.profitPct)})
            </AppText>
          </View>
        </View>
      </View>

      <PressableScale onPress={submit} disabled={settled || q.contracts < 1} haptic="heavy" style={[styles.submitWrap, { shadowColor: accent }]}>
        <LinearGradient colors={yesSide ? [colors.yes, colors.yesDeep] : [colors.no, colors.noDeep]} style={styles.submit}>
          <MaterialCommunityIcons name="lightning-bolt" size={22} color={yesSide ? colors.onYes : colors.text} />
          <AppText variant="headline-md" weight={fonts.display800} upper align="center" color={yesSide ? colors.onYes : colors.text} style={{ flex: 1 }}>
            {settled ? 'Market Settled' : mode === 'limit' ? `Place ${side} Limit @ ${price}¢` : `Submit ${side} Prediction`}
            {!settled && `\n(${money(q.cost)})`}
          </AppText>
        </LinearGradient>
      </PressableScale>

      <View style={styles.inline}>
        <MaterialCommunityIcons name="lock-outline" size={14} color={colors.textMuted} />
        <AppText variant="label-sm" color={colors.textMuted} style={{ flex: 1 }}>
          Funds placed into instant escrow. {closeNote}
        </AppText>
      </View>
    </View>
  );

  return bare ? content : <GlassCard>{content}</GlassCard>;
}

function StepButton({ icon, onPress, big }: { icon: 'minus' | 'plus'; onPress: () => void; big?: boolean }) {
  return (
    <PressableScale onPress={onPress} style={[styles.step, big && styles.stepBig]} accessibilityLabel={icon === 'plus' ? 'Increase' : 'Decrease'}>
      <MaterialCommunityIcons name={icon} size={big ? 22 : 16} color={colors.text} />
    </PressableScale>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.between}>
      <AppText variant="label-md" color={colors.textSecondary}>
        {label}
      </AppText>
      <AppText variant="label-md">{value}</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  between: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: space.sm },
  inline: { flexDirection: 'row', alignItems: 'center', gap: space.sm },
  sides: { flexDirection: 'row', gap: space.sm, padding: space.xs, borderRadius: radii.md + 4, backgroundColor: colors.inset },
  side: {
    flex: 1,
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: space.lg,
    borderRadius: radii.md,
    backgroundColor: colors.elevated,
    borderWidth: 1,
    borderColor: colors.border,
  },
  stakeRow: { flexDirection: 'row', alignItems: 'center', gap: space.md, padding: space.sm, borderRadius: radii.md + 4, backgroundColor: colors.inset },
  stakeCenter: { flex: 1, alignItems: 'center' },
  stakeInput: { color: colors.text, fontFamily: fonts.display800, fontSize: 36, lineHeight: 42, minWidth: 60, textAlign: 'center', padding: 0 },
  step: {
    width: 36,
    height: 36,
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.elevated,
    borderWidth: 1,
    borderColor: colors.borderStrong,
  },
  stepBig: { width: 52, height: 52 },
  quickRow: { flexDirection: 'row', gap: space.sm },
  quick: {
    flex: 1,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radii.md,
    backgroundColor: colors.ghost,
    borderWidth: 1,
    borderColor: colors.border,
  },
  quickActive: { backgroundColor: colors.elevated, borderColor: colors.borderPress },
  summary: { gap: space.sm, padding: space.md, borderRadius: radii.md + 2, backgroundColor: colors.inset, borderWidth: 1, borderColor: colors.border },
  divider: { height: 1, backgroundColor: colors.border, marginVertical: space.xs },
  submitWrap: { borderRadius: radii.md + 4, shadowOpacity: 0.4, shadowRadius: 18, shadowOffset: { width: 0, height: 4 }, elevation: 8 },
  submit: { flexDirection: 'row', alignItems: 'center', gap: space.sm, paddingVertical: space.md, paddingHorizontal: space.xl, borderRadius: radii.md + 4, minHeight: 72 },
});
