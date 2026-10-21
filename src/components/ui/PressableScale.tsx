import * as Haptics from 'expo-haptics';
import { Pressable, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface Props extends Omit<PressableProps, 'style'> {
  style?: StyleProp<ViewStyle>;
  haptic?: 'light' | 'medium' | 'heavy' | 'none';
}

/** Haptic press state from DESIGN.md: depress to scale(0.98). */
export function PressableScale({ style, haptic = 'light', onPressIn, onPressOut, onPress, disabled, ...rest }: Props) {
  const scale = useSharedValue(1);
  const animated = useAnimatedStyle(() => ({ transform: [{ scale: scale.get() }] }));

  return (
    <AnimatedPressable
      {...rest}
      disabled={disabled}
      accessibilityRole={rest.accessibilityRole ?? 'button'}
      onPressIn={(e) => {
        scale.set(withTiming(0.98, { duration: 80 }));
        onPressIn?.(e);
      }}
      onPressOut={(e) => {
        scale.set(withTiming(1, { duration: 120 }));
        onPressOut?.(e);
      }}
      onPress={(e) => {
        if (haptic !== 'none') {
          const style = { light: Haptics.ImpactFeedbackStyle.Light, medium: Haptics.ImpactFeedbackStyle.Medium, heavy: Haptics.ImpactFeedbackStyle.Heavy }[haptic];
          Haptics.impactAsync(style).catch(() => {});
        }
        onPress?.(e);
      }}
      style={[style, animated, disabled && { opacity: 0.45 }]}
    />
  );
}
