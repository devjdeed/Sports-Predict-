import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { StyleSheet } from 'react-native';

import { colors, fonts, radii, space } from '@/theme';
import { AppText } from './AppText';
import { PressableScale } from './PressableScale';

interface Props {
  label: string;
  icon?: keyof typeof MaterialCommunityIcons.glyphMap;
  selected?: boolean;
  /** Filled volt variant used for the "HOT LIVE" chip. */
  accent?: boolean;
  onPress?: () => void;
  compact?: boolean;
}

export function Chip({ label, icon, selected, accent, onPress, compact }: Props) {
  const filled = selected && accent;
  const fg = filled ? colors.onYes : selected ? colors.text : colors.textSecondary;
  return (
    <PressableScale
      onPress={onPress}
      accessibilityState={{ selected }}
      style={[
        styles.chip,
        compact && styles.compact,
        selected && !accent && styles.selected,
        filled && styles.filled,
      ]}>
      {icon && <MaterialCommunityIcons name={icon} size={compact ? 13 : 15} color={fg} />}
      <AppText variant={compact ? 'label-sm' : 'label-md'} upper color={fg} weight={selected ? fonts.mono700 : undefined}>
        {label}
      </AppText>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  chip: {
    height: 36,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
    paddingHorizontal: space.lg,
    borderRadius: radii.full,
    backgroundColor: colors.ghostSubtle,
    borderWidth: 1,
    borderColor: colors.border,
  },
  compact: { height: 30, paddingHorizontal: space.md, borderRadius: radii.md },
  selected: { borderColor: colors.cyan, backgroundColor: colors.cyanTint },
  filled: {
    backgroundColor: colors.yes,
    borderColor: colors.yes,
    shadowColor: colors.yes,
    shadowOpacity: 0.35,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 0 },
  },
});
