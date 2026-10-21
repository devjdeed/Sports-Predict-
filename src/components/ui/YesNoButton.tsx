import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import type { Side } from '@/domain/types';
import { colors, fonts, radii, space } from '@/theme';
import { AppText } from './AppText';
import { PriceFlash } from './PriceFlash';
import { PressableScale } from './PressableScale';

interface Props {
  side: Side;
  price: number;
  /** `stacked`: label + price centred with a subtitle; `row`: label left, price right. */
  layout?: 'stacked' | 'row';
  subtitle?: string;
  size?: 'md' | 'lg';
  onPress?: () => void;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function YesNoButton({ side, price, layout = 'row', subtitle, size = 'md', onPress, disabled, style }: Props) {
  const yes = side === 'YES';
  const fg = yes ? colors.onYes : colors.text;
  const height = size === 'lg' ? 64 : 52;

  return (
    <PressableScale
      onPress={onPress}
      disabled={disabled}
      haptic="medium"
      accessibilityLabel={`Buy ${side} at ${price} cents`}
      style={[styles.wrap, { height, shadowColor: yes ? colors.yes : colors.no }, style]}>
      <LinearGradient
        colors={yes ? [colors.yes, colors.yesDeep] : [colors.no, colors.noDeep]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.fill, layout === 'row' ? styles.row : styles.stacked]}>
        {layout === 'row' ? (
          <>
            <AppText variant="headline-md" weight={fonts.display800} color={fg}>
              {side}
            </AppText>
            <PriceFlash value={price} suffix="¢" variant="label-lg" color={fg} flash={false} />
          </>
        ) : (
          <>
            <View style={styles.inline}>
              <AppText variant="headline-md" weight={fonts.display800} color={fg}>
                {side}{' '}
              </AppText>
              <PriceFlash value={price} suffix="¢" variant="label-lg" color={fg} flash={false} />
            </View>
            {subtitle ? (
              <AppText variant="label-sm" color={fg} style={{ opacity: 0.75 }}>
                {subtitle}
              </AppText>
            ) : null}
          </>
        )}
      </LinearGradient>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    borderRadius: radii.md,
    shadowOpacity: 0.25,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  fill: { flex: 1, borderRadius: radii.md, paddingHorizontal: space.lg },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  stacked: { alignItems: 'center', justifyContent: 'center' },
  inline: { flexDirection: 'row', alignItems: 'baseline' },
});
