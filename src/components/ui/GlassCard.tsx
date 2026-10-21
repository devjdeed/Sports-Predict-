import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, View, type ViewProps } from 'react-native';

import { colors, radii, space } from '@/theme';

interface Props extends ViewProps {
  /** Level 2 ambient aura (DESIGN.md): bull = green, bear = crimson. */
  aura?: 'bull' | 'bear';
  /** Accent stripe on the left edge (leaderboard rows). */
  accent?: string;
  padded?: boolean;
  inset?: boolean;
  hero?: boolean;
}

export function GlassCard({ aura, accent, padded = true, inset, hero, style, children, ...rest }: Props) {
  return (
    <View
      {...rest}
      style={[
        styles.card,
        inset && styles.inset,
        aura && {
          shadowColor: aura === 'bull' ? colors.yes : colors.no,
          shadowOpacity: 0.18,
          shadowRadius: 20,
          shadowOffset: { width: 0, height: 4 },
          elevation: 6,
        },
        padded && styles.padded,
        style,
      ]}>
      {hero && (
        <LinearGradient
          colors={['rgba(0, 245, 155, 0.10)', 'rgba(0, 210, 255, 0.03)', 'transparent']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[StyleSheet.absoluteFill, { borderRadius: radii.lg }]}
          pointerEvents="none"
        />
      )}
      {accent && <View style={[styles.accent, { backgroundColor: accent }]} />}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  inset: {
    backgroundColor: colors.inset,
    borderRadius: radii.md + 2,
  },
  padded: { padding: space.lg },
  accent: {
    position: 'absolute',
    left: -1,
    top: -1,
    bottom: -1,
    width: 4,
    borderTopLeftRadius: radii.lg,
    borderBottomLeftRadius: radii.lg,
  },
});
