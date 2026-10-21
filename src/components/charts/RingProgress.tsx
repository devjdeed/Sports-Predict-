import { View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

import { colors } from '@/theme';
import { AppText } from '../ui/AppText';

export function RingProgress({ value, size = 64, stroke = 6, label }: { value: number; size?: number; stroke?: number; label?: string }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size} style={{ position: 'absolute', transform: [{ rotate: '-90deg' }] }}>
        <Circle cx={size / 2} cy={size / 2} r={r} stroke="rgba(255,255,255,0.08)" strokeWidth={stroke} fill="none" />
        <Circle cx={size / 2} cy={size / 2} r={r} stroke={colors.yes} strokeWidth={stroke} fill="none" strokeLinecap="round" strokeDasharray={`${c * value} ${c}`} />
      </Svg>
      {label && <AppText variant="label-md">{label}</AppText>}
    </View>
  );
}
