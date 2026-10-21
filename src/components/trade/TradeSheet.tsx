import { BlurView } from 'expo-blur';
import { KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useMarketStore } from '@/store/marketStore';
import { colors, fonts, radii, space } from '@/theme';
import { AppText } from '../ui/AppText';
import { TradeSlip } from './TradeSlip';

/** Level 3 bottom sheet hosting the trade slip, opened from YES/NO on any market card. */
export function TradeSheet() {
  const sheet = useMarketStore((s) => s.sheet);
  const close = useMarketStore((s) => s.closeSheet);
  const market = useMarketStore((s) => s.markets.find((m) => m.id === sheet?.marketId));
  const insets = useSafeAreaInsets();

  return (
    <Modal visible={!!sheet} transparent animationType="slide" onRequestClose={close} statusBarTranslucent>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.root}>
        <Pressable style={styles.scrim} onPress={close} accessibilityLabel="Close trade slip" />
        <View style={[styles.sheet, { paddingBottom: insets.bottom + space.lg }]}>
          <BlurView intensity={40} tint="dark" style={StyleSheet.absoluteFill} />
          <View style={styles.handle} />
          <ScrollView contentContainerStyle={{ gap: space.md, paddingHorizontal: space.lg }} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
            {market && (
              <AppText variant="headline-sm" weight={fonts.display700} upper color={colors.textSecondary}>
                {market.question}
              </AppText>
            )}
            {sheet && <TradeSlip key={sheet.marketId} marketId={sheet.marketId} side={sheet.side} initialStake={sheet.stake} onDone={close} bare />}
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, justifyContent: 'flex-end' },
  scrim: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: colors.scrim },
  sheet: {
    maxHeight: '90%',
    paddingTop: space.sm,
    borderTopLeftRadius: radii.xl,
    borderTopRightRadius: radii.xl,
    backgroundColor: 'rgba(26, 34, 50, 0.95)',
    borderTopWidth: 1,
    borderColor: 'rgba(0, 210, 255, 0.4)',
    overflow: 'hidden',
    width: '100%',
    maxWidth: 560,
    alignSelf: 'center',
  },
  handle: { alignSelf: 'center', width: 44, height: 4, borderRadius: 2, backgroundColor: colors.borderPress, marginBottom: space.md },
});
