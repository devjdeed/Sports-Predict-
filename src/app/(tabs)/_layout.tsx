import { Tabs } from 'expo-router/js-tabs';

import { TabBar } from '@/components/layout/TabBar';
import { colors } from '@/theme';

export default function TabLayout() {
  return (
    <Tabs tabBar={(props) => <TabBar {...props} />} screenOptions={{ headerShown: false, sceneStyle: { backgroundColor: colors.bg } }}>
      <Tabs.Screen name="index" />
      <Tabs.Screen name="trade" />
      <Tabs.Screen name="portfolio" />
      <Tabs.Screen name="ranks" />
      <Tabs.Screen name="squads" />
    </Tabs>
  );
}
