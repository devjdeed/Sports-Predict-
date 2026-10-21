import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeInUp, FadeOutUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useToastStore } from '@/store/toastStore';
import { colors, radii, space } from '@/theme';
import { AppText } from './AppText';

const toneColor = { yes: colors.yes, no: colors.no, info: colors.cyan };
const toneIcon = { yes: 'check-circle', no: 'alert-circle', info: 'lightning-bolt' } as const;

export function Toasts() {
  const toasts = useToastStore((s) => s.toasts);
  const insets = useSafeAreaInsets();
  return (
    <View pointerEvents="none" style={[styles.host, { top: insets.top + 64 }]}>
      {toasts.map((t) => (
        <Animated.View key={t.id} entering={FadeInUp.duration(180)} exiting={FadeOutUp.duration(180)} style={[styles.toast, { borderColor: `${toneColor[t.tone]}66` }]}>
          <MaterialCommunityIcons name={toneIcon[t.tone]} size={16} color={toneColor[t.tone]} />
          <AppText variant="label-md" style={{ flexShrink: 1 }}>
            {t.message}
          </AppText>
        </Animated.View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  host: { position: 'absolute', left: 0, right: 0, alignItems: 'center', gap: space.sm, zIndex: 100 },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
    maxWidth: 420,
    marginHorizontal: space.lg,
    paddingHorizontal: space.lg,
    paddingVertical: space.md,
    borderRadius: radii.md + 4,
    backgroundColor: colors.overlay,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOpacity: 0.4,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 10,
  },
});
