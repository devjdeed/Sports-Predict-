import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, View } from 'react-native';

import { colors, fonts } from '@/theme';
import { AppText } from './AppText';

interface Props {
  initials?: string;
  icon?: keyof typeof MaterialCommunityIcons.glyphMap;
  size?: number;
  color?: string;
  online?: boolean;
  ring?: string;
  square?: boolean;
}

/** Placeholder avatar/crest: initials or an icon on a tinted gradient. */
export function Avatar({ initials, icon, size = 40, color = colors.cyan, online, ring, square }: Props) {
  const radius = square ? size * 0.28 : size / 2;
  return (
    <View style={{ width: size, height: size }}>
      <LinearGradient
        colors={[`${color}55`, `${color}14`]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.fill, { borderRadius: radius, borderColor: ring ?? `${color}66`, borderWidth: ring ? 2 : 1 }]}>
        {icon ? (
          <MaterialCommunityIcons name={icon} size={size * 0.5} color={color} />
        ) : (
          <AppText weight={fonts.display700} style={{ fontSize: size * 0.4, lineHeight: size * 0.48 }} color={colors.text}>
            {initials}
          </AppText>
        )}
      </LinearGradient>
      {online && <View style={[styles.online, { width: size * 0.28, height: size * 0.28, borderRadius: size }]} />}
    </View>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  online: { position: 'absolute', top: -1, right: -1, backgroundColor: colors.yes, borderWidth: 2, borderColor: colors.bg },
});
