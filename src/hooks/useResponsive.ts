import { useWindowDimensions } from 'react-native';

import { layout } from '@/theme';

export function useResponsive() {
  const { width, height } = useWindowDimensions();
  const isTablet = width >= layout.tabletBreakpoint;
  const grid = isTablet ? layout.tablet : layout.phone;
  return { width, height, isTablet, ...grid };
}
