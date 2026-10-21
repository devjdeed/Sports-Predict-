import type { ReactNode } from 'react';
import { ScrollView, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { useResponsive } from '@/hooks/useResponsive';
import { colors, layout, space } from '@/theme';
import { AppHeader } from './AppHeader';

interface Props {
  children: ReactNode;
  /** Render children without the outer ScrollView (split layouts manage their own scrolling). */
  fixed?: boolean;
  contentStyle?: StyleProp<ViewStyle>;
}

/** Tab screen shell: app header, responsive gutters, centred max-width content. */
export function Screen({ children, fixed, contentStyle }: Props) {
  const { margin } = useResponsive();
  return (
    <View style={styles.root}>
      <AppHeader />
      {fixed ? (
        <View style={[styles.fixed, { paddingHorizontal: margin }, contentStyle]}>{children}</View>
      ) : (
        <ScrollView
          style={styles.root}
          contentContainerStyle={[styles.content, { paddingHorizontal: margin }, contentStyle]}
          showsVerticalScrollIndicator={false}>
          {children}
        </ScrollView>
      )}
    </View>
  );
}

/** Vertical scroller for one pane of a split layout. */
export function Pane({ children, style }: { children: ReactNode; style?: StyleProp<ViewStyle> }) {
  return (
    <ScrollView style={style} contentContainerStyle={styles.pane} showsVerticalScrollIndicator={false}>
      {children}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  content: { gap: space.lg, paddingBottom: space.xl * 2, width: '100%', maxWidth: layout.maxContentWidth, alignSelf: 'center' },
  fixed: { flex: 1, width: '100%', maxWidth: layout.maxContentWidth, alignSelf: 'center' },
  pane: { gap: space.lg, paddingBottom: space.xl * 2 },
});
