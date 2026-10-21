import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { ScrollView } from 'react-native';

import { useResponsive } from '@/hooks/useResponsive';
import { useMarketStore, type SportFilter } from '@/store/marketStore';
import { space } from '@/theme';
import { Chip } from '../ui/Chip';

const FILTERS: { key: SportFilter; label: string; icon: keyof typeof MaterialCommunityIcons.glyphMap }[] = [
  { key: 'hot', label: 'Hot Live', icon: 'fire' },
  { key: 'soccer', label: 'Soccer', icon: 'soccer' },
  { key: 'nba', label: 'NBA', icon: 'basketball' },
  { key: 'nfl', label: 'NFL', icon: 'football' },
  { key: 'ufc', label: 'UFC', icon: 'boxing-glove' },
  { key: 'esports', label: 'Esports', icon: 'controller-classic-outline' },
];

export function SportFilterChips() {
  const filter = useMarketStore((s) => s.filter);
  const setFilter = useMarketStore((s) => s.setFilter);
  const { margin } = useResponsive();

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -margin }} contentContainerStyle={{ gap: space.sm, paddingHorizontal: margin }}>
      {FILTERS.map((f) => (
        <Chip key={f.key} label={f.label} icon={f.icon} selected={filter === f.key} accent={f.key === 'hot'} onPress={() => setFilter(f.key)} />
      ))}
    </ScrollView>
  );
}
