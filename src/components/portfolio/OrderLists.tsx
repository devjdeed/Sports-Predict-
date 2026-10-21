import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { StyleSheet, View } from 'react-native';

import { money, signedMoney } from '@/domain/format';
import { costOf, sidePrice } from '@/domain/pricing';
import type { LimitOrder, SettledPosition } from '@/domain/types';
import { useMarket } from '@/store/marketStore';
import { toast } from '@/store/toastStore';
import { useTradingStore } from '@/store/tradingStore';
import { colors, fonts, space } from '@/theme';
import { AppText } from '../ui/AppText';
import { GlassCard } from '../ui/GlassCard';
import { PressableScale } from '../ui/PressableScale';
import { Tag } from '../ui/Tag';

export function SettledRow({ item }: { item: SettledPosition }) {
  const won = item.pnl > 0;
  return (
    <GlassCard style={styles.row} accent={won ? colors.yes : colors.no}>
      <View style={{ flex: 1, gap: 4 }}>
        <AppText variant="headline-sm" weight={fonts.display700} numberOfLines={1}>
          {item.title}
        </AppText>
        <AppText variant="label-sm" color={colors.textSecondary}>
          {item.contracts} {item.side} @ {Math.round(item.avgPrice)}¢ → {item.exitPrice}¢ · {item.reason === 'cashout' ? 'Cashed out' : 'Resolved'}
        </AppText>
      </View>
      <AppText variant="label-lg" weight={fonts.mono700} color={won ? colors.yes : colors.no}>
        {signedMoney(item.pnl)}
      </AppText>
    </GlassCard>
  );
}

export function LimitRow({ order }: { order: LimitOrder }) {
  const market = useMarket(order.marketId);
  const cancel = useTradingStore((s) => s.cancelLimit);
  const current = market ? sidePrice(market.yesPrice, order.side) : null;
  return (
    <GlassCard style={styles.row}>
      <View style={{ flex: 1, gap: 6 }}>
        <View style={styles.inline}>
          <Tag label={`Limit ${order.side}`} tone={order.side === 'YES' ? 'yes' : 'no'} />
          {current !== null && (
            <AppText variant="label-sm" color={colors.textSecondary}>
              Mkt {current}¢
            </AppText>
          )}
        </View>
        <AppText variant="headline-sm" weight={fonts.display700} numberOfLines={1}>
          {market?.shortTitle ?? 'Market'}
        </AppText>
        <AppText variant="label-sm" color={colors.textSecondary}>
          {order.contracts} @ ≤{order.limitPrice}¢ · Reserved {money(costOf(order.contracts, order.limitPrice))}
        </AppText>
      </View>
      <PressableScale
        onPress={() => {
          const r = cancel(order.id);
          toast(r.message, r.ok ? 'info' : 'no');
        }}
        style={styles.cancel}
        accessibilityLabel="Cancel limit order">
        <MaterialCommunityIcons name="close" size={18} color={colors.no} />
      </PressableScale>
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: space.md, padding: space.md, paddingLeft: space.lg },
  inline: { flexDirection: 'row', alignItems: 'center', gap: space.sm },
  cancel: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.noTint },
});
