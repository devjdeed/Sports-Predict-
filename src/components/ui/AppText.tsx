import { StyleSheet, Text, type TextProps } from 'react-native';

import { colors, typography, type TypographyVariant } from '@/theme';

export interface AppTextProps extends TextProps {
  variant?: TypographyVariant;
  color?: string;
  upper?: boolean;
  weight?: string;
  align?: 'left' | 'center' | 'right';
}

export function AppText({ variant = 'body-md', color = colors.text, upper, weight, align, style, ...rest }: AppTextProps) {
  return (
    <Text
      allowFontScaling={false}
      {...rest}
      style={[
        typography[variant],
        { color },
        upper && styles.upper,
        weight ? { fontFamily: weight } : null,
        align ? { textAlign: align } : null,
        variant.startsWith('label') && styles.tabular,
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  upper: { textTransform: 'uppercase' },
  tabular: { fontVariant: ['tabular-nums'] },
});
