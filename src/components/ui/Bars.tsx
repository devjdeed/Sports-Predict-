import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { colors, radii } from '@/theme';

/** Single-value progress rail with a volt→cyan gradient fill. */
export function ProgressBar({ value, height = 6, color, style }: { value: number; height?: number; color?: string; style?: StyleProp<ViewStyle> }) {
  const pct = `${Math.max(0, Math.min(1, value)) * 100}%` as const;
  return (
    <View style={[styles.track, { height, borderRadius: height }, style]}>
      {color ? (
        <View style={{ width: pct, height, borderRadius: height, backgroundColor: color }} />
      ) : (
        <LinearGradient colors={[colors.yes, '#5CF0C8']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={{ width: pct, height, borderRadius: height }} />
      )}
    </View>
  );
}

/** YES vs NO split bar. */
export function SplitBar({ yes, height = 8, style }: { yes: number; height?: number; style?: StyleProp<ViewStyle> }) {
  const left = Math.max(0, Math.min(100, yes));
  return (
    <View style={[styles.split, { height, borderRadius: height }, style]}>
      <View style={{ flex: left, backgroundColor: colors.yes }} />
      <View style={{ width: 2 }} />
      <View style={{ flex: 100 - left, backgroundColor: colors.no }} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: { backgroundColor: 'rgba(255,255,255,0.08)', overflow: 'hidden' },
  split: { flexDirection: 'row', overflow: 'hidden', borderRadius: radii.full },
});
