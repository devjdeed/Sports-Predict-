import { StyleSheet, View } from 'react-native';

import { colors, fonts, radii, space } from '@/theme';
import { AppText } from './AppText';
import { PressableScale } from './PressableScale';

interface Props<K extends string> {
  options: { key: K; label: string }[];
  value: K;
  onChange: (key: K) => void;
}

export function SegmentedTabs<K extends string>({ options, value, onChange }: Props<K>) {
  return (
    <View style={styles.wrap}>
      {options.map((o) => {
        const active = o.key === value;
        return (
          <PressableScale
            key={o.key}
            onPress={() => onChange(o.key)}
            accessibilityRole="tab"
            accessibilityState={{ selected: active }}
            style={[styles.tab, active && styles.active]}>
            <AppText variant="label-md" upper align="center" color={active ? colors.yes : colors.textSecondary} weight={active ? fonts.mono700 : undefined}>
              {o.label}
            </AppText>
          </PressableScale>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    padding: space.xs,
    gap: space.xs,
    backgroundColor: colors.inset,
    borderRadius: radii.md + 2,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tab: { flex: 1, minHeight: 40, alignItems: 'center', justifyContent: 'center', borderRadius: radii.md, paddingHorizontal: space.sm },
  active: { backgroundColor: colors.elevated, borderWidth: 1, borderColor: colors.borderStrong },
});
