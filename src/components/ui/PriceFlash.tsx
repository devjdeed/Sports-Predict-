import { useEffect, useRef } from 'react';
import Animated, { interpolateColor, useAnimatedStyle, useSharedValue, withSequence, withTiming } from 'react-native-reanimated';

import { colors, typography, type TypographyVariant } from '@/theme';

interface Props {
  value: number;
  prefix?: string;
  suffix?: string;
  variant?: TypographyVariant;
  color?: string;
  /** Flash green on an up-tick and red on a down-tick (DESIGN.md "odds transition"). */
  flash?: boolean;
  format?: (v: number) => string;
  weight?: string;
}

export function PriceFlash({ value, prefix = '', suffix = '', variant = 'label-lg', color = colors.text, flash = true, format, weight }: Props) {
  const prev = useRef(value);
  const pulse = useSharedValue(0);
  const dir = useSharedValue(0);

  useEffect(() => {
    if (flash && value !== prev.current) {
      dir.set(value > prev.current ? 1 : -1);
      pulse.set(withSequence(withTiming(1, { duration: 90 }), withTiming(0, { duration: 600 })));
    }
    prev.current = value;
  }, [value, flash, pulse, dir]);

  const animated = useAnimatedStyle(() => ({
    color: interpolateColor(pulse.get(), [0, 1], [color, dir.get() > 0 ? colors.yes : colors.no]),
  }));

  return (
    <Animated.Text allowFontScaling={false} style={[typography[variant], { fontVariant: ['tabular-nums'] }, weight ? { fontFamily: weight } : null, animated]}>
      {prefix}
      {format ? format(value) : Math.round(value)}
      {suffix}
    </Animated.Text>
  );
}
