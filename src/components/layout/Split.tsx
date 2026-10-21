import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { useResponsive } from '@/hooks/useResponsive';
import { Pane } from './Screen';

/** Tablet split view (DESIGN.md): independent scrolling columns separated by the grid gutter. */
export function Split({ left, right, rightWidth }: { left: ReactNode; right: ReactNode; rightWidth?: number }) {
  const { gutter } = useResponsive();
  return (
    <View style={[styles.row, { gap: gutter }]}>
      <Pane style={styles.left}>{left}</Pane>
      <Pane style={rightWidth ? { width: rightWidth } : styles.left}>{right}</Pane>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flex: 1, flexDirection: 'row' },
  left: { flex: 1 },
});
