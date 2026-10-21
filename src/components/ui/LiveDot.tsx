import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';

import { colors } from '@/theme';

/** 8px status dot with a ping ring (DESIGN.md "Live Ticker"). */
export function LiveDot({ color = colors.no, size = 8, ping = true }: { color?: string; size?: number; ping?: boolean }) {
  const t = useSharedValue(0);

  useEffect(() => {
    if (ping) t.set(withRepeat(withTiming(1, { duration: 1400, easing: Easing.out(Easing.quad) }), -1, false));
  }, [ping, t]);

  const ring = useAnimatedStyle(() => ({ opacity: 0.7 * (1 - t.get()), transform: [{ scale: 1 + t.get() * 1.6 }] }));

  return (
    <View style={{ width: size, height: size }}>
      {ping && <Animated.View style={[StyleSheet.absoluteFill, { borderRadius: size, backgroundColor: color }, ring]} />}
      <View style={[StyleSheet.absoluteFill, { borderRadius: size, backgroundColor: color }]} />
    </View>
  );
}
