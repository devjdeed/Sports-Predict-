import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import type { Market } from '@/domain/types';
import { colors, fonts, radii, space } from '@/theme';
import { AreaChart } from '../charts/AreaChart';
import { AppText } from '../ui/AppText';
import { GlassCard } from '../ui/GlassCard';
import { PressableScale } from '../ui/PressableScale';
import { PriceFlash } from '../ui/PriceFlash';

type Frame = '1M' | '5M' | 'MATCH' | 'ALL';
/** Ticks to show per timeframe (one tick ≈ one simulated update). */
const FRAME_POINTS: Record<Frame, number> = { '1M': 12, '5M': 40, MATCH: 81, ALL: 120 };

export function ProbabilityPanel({ market }: { market: Market }) {
  const [frame, setFrame] = useState<Frame>('MATCH');
  const data = market.history.slice(-FRAME_POINTS[frame]);
  const offset = market.history.length - data.length;
  const lookback = market.history[Math.max(0, market.history.length - 11)] ?? market.yesPrice;
  const change = market.yesPrice - lookback;
  const event = market.events.find((e) => e.at >= offset);
  const eventIndex = event ? event.at - offset : -1;

  return (
    <GlassCard style={{ gap: space.md }}>
      <AppText variant="label-sm" upper color={colors.textSecondary}>
        Implied Probability
      </AppText>
      <View style={styles.head}>
        <View style={styles.price}>
          <PriceFlash value={market.yesPrice} suffix="¢" variant="headline-xl" weight={fonts.display800} color={colors.yes} />
          <AppText variant="label-md" color={change >= 0 ? colors.yes : colors.no}>
            {change >= 0 ? '▲ +' : '▼ '}
            {change}¢ (10t)
          </AppText>
        </View>
        <View style={styles.frames}>
          {(Object.keys(FRAME_POINTS) as Frame[]).map((f) => (
            <PressableScale key={f} onPress={() => setFrame(f)} style={[styles.frame, frame === f && styles.frameActive]}>
              <AppText variant="label-sm" weight={frame === f ? fonts.mono700 : undefined} color={frame === f ? colors.text : colors.textSecondary}>
                {f}
              </AppText>
            </PressableScale>
          ))}
        </View>
      </View>

      <View style={styles.chart}>
        {event && (
          <View style={styles.event}>
            <AppText variant="label-sm" upper weight={fonts.mono700}>
              🟥 {event.label}
            </AppText>
          </View>
        )}
        <AreaChart
          data={data}
          height={170}
          domain={[0, 100]}
          gridLines={[20, 50, 80]}
          formatGrid={(v) => `${v}¢`}
          markers={event ? [{ index: eventIndex, color: colors.no }] : undefined}
        />
      </View>
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  head: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: space.sm },
  price: { flexDirection: 'row', alignItems: 'baseline', gap: space.sm },
  frames: { flexDirection: 'row', padding: 3, borderRadius: radii.md, backgroundColor: colors.inset, borderWidth: 1, borderColor: colors.border },
  frame: { paddingHorizontal: space.sm + 2, paddingVertical: 6, borderRadius: radii.sm + 2 },
  frameActive: { backgroundColor: colors.elevated },
  chart: { borderRadius: radii.md, backgroundColor: colors.inset, borderWidth: 1, borderColor: colors.border, padding: space.sm, overflow: 'hidden' },
  event: {
    position: 'absolute',
    top: space.sm,
    alignSelf: 'center',
    zIndex: 2,
    paddingHorizontal: space.sm,
    paddingVertical: 4,
    borderRadius: radii.sm + 2,
    backgroundColor: colors.noDeep,
  },
});
