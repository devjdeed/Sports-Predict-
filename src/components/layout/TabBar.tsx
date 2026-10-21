import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import type { BottomTabBarProps } from 'expo-router/js-tabs';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTradingStore } from '@/store/tradingStore';
import { colors, fonts, layout } from '@/theme';
import { AppText } from '../ui/AppText';

type IconName = keyof typeof MaterialCommunityIcons.glyphMap;

const TABS: Record<string, { label: string; icon: IconName }> = {
  index: { label: 'Markets', icon: 'fire' },
  trade: { label: 'Trade', icon: 'tune-vertical-variant' },
  portfolio: { label: 'Portfolio', icon: 'wallet-outline' },
  ranks: { label: 'Ranks', icon: 'trophy-outline' },
  squads: { label: 'Squads', icon: 'account-group' },
};

/** Fixed 72px bottom bar with a glowing indicator over the active tab. */
export function TabBar({ state, emitter, navigateToTab }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const openPositions = useTradingStore((s) => s.positions.length);

  return (
    <View style={[styles.bar, { paddingBottom: insets.bottom, height: layout.tabBarHeight + insets.bottom }]}>
      {state.routes.map((route, index) => {
        const tab = TABS[route.name];
        if (!tab) return null;
        const focused = state.index === index;
        const color = focused ? colors.yes : colors.textSecondary;
        const badge = route.name === 'portfolio' && openPositions > 0 ? openPositions : 0;

        return (
          <Pressable
            key={route.key}
            accessibilityRole="tab"
            accessibilityState={{ selected: focused }}
            accessibilityLabel={tab.label}
            style={styles.item}
            onPress={() => {
              const event = emitter.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
              if (!focused && !event.defaultPrevented) navigateToTab(route.key);
            }}>
            {focused && <View style={styles.indicator} />}
            <View>
              <MaterialCommunityIcons name={tab.icon} size={22} color={color} />
              {badge > 0 && (
                <View style={styles.badge}>
                  <AppText variant="label-sm" weight={fonts.mono700} style={styles.badgeText}>
                    {badge}
                  </AppText>
                </View>
              )}
            </View>
            <AppText variant="label-sm" upper color={color} weight={focused ? fonts.mono700 : undefined}>
              {tab.label}
            </AppText>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    backgroundColor: 'rgba(10, 13, 20, 0.97)',
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  item: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 4 },
  indicator: {
    position: 'absolute',
    top: 0,
    left: '50%',
    marginLeft: -18,
    width: 36,
    height: 3,
    borderBottomLeftRadius: 3,
    borderBottomRightRadius: 3,
    backgroundColor: colors.yes,
    shadowColor: colors.yes,
    shadowOpacity: 0.9,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  badge: {
    position: 'absolute',
    top: -6,
    right: -10,
    minWidth: 17,
    height: 17,
    paddingHorizontal: 4,
    borderRadius: 9,
    backgroundColor: colors.no,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.bg,
  },
  badgeText: { fontSize: 9, lineHeight: 11, letterSpacing: 0 },
});
