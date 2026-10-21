import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { colors, fonts, radii, space } from '@/theme';
import { AppText } from './AppText';
import { LiveDot } from './LiveDot';

type Tone = 'neutral' | 'yes' | 'no' | 'cyan' | 'gold';

const tones: Record<Tone, { bg: string; fg: string; border: string }> = {
  neutral: { bg: colors.ghost, fg: colors.textSecondary, border: colors.border },
  yes: { bg: colors.yesTint, fg: colors.yes, border: 'rgba(0, 245, 155, 0.25)' },
  no: { bg: colors.noTint, fg: colors.no, border: 'rgba(255, 51, 102, 0.25)' },
  cyan: { bg: colors.cyanTint, fg: colors.cyan, border: 'rgba(0, 210, 255, 0.25)' },
  gold: { bg: colors.goldTint, fg: colors.gold, border: 'rgba(255, 208, 39, 0.25)' },
};

interface Props {
  label: string;
  tone?: Tone;
  live?: boolean;
  dotColor?: string;
  style?: StyleProp<ViewStyle>;
  solid?: boolean;
}

/** Contract badges & telemetry ticks: `rounded-md`, mono label. */
export function Tag({ label, tone = 'neutral', live, dotColor, style, solid }: Props) {
  const t = tones[tone];
  return (
    <View style={[styles.tag, { backgroundColor: solid ? t.fg : t.bg, borderColor: t.border }, style]}>
      {(live || dotColor) && <LiveDot color={dotColor ?? colors.no} size={6} ping={!!live} />}
      <AppText variant="label-sm" upper color={solid ? colors.onYes : t.fg} weight={solid ? fonts.mono700 : undefined}>
        {label}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.xs + 2,
    alignSelf: 'flex-start',
    paddingHorizontal: space.sm,
    paddingVertical: 3,
    borderRadius: radii.sm + 2,
    borderWidth: 1,
  },
});
