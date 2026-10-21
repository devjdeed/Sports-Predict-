import { useState } from 'react';
import { View } from 'react-native';

import { Screen } from '@/components/layout/Screen';
import { Split } from '@/components/layout/Split';
import { BadgeGrid, LeaderRow, MyRankBar, SeasonHero, StreakCard } from '@/components/ranks/RankModules';
import { SegmentedTabs } from '@/components/ui/SegmentedTabs';
import { leaderboards } from '@/data/social';
import { int } from '@/domain/format';
import { useResponsive } from '@/hooks/useResponsive';
import { toast } from '@/store/toastStore';
import { useTradingStore } from '@/store/tradingStore';
import { space } from '@/theme';

type Board = keyof typeof leaderboards;

export default function RanksScreen() {
  const { isTablet } = useResponsive();
  const [board, setBoard] = useState<Board>('global');
  const profile = useTradingStore((s) => s.profile);

  // Mock gap to the next rank: each rank above is ~95 XP away.
  const jump = () => toast(`You're #${profile.rank} of ${int(profile.rankOf)} · ${int(95 * 2)} XP to #${profile.rank - 2}`, 'info');

  const progression = (
    <>
      <SeasonHero />
      <StreakCard />
      <BadgeGrid columns={isTablet ? 6 : 4} />
    </>
  );

  const standings = (
    <>
      <SegmentedTabs
        options={[
          { key: 'global', label: 'Global League' },
          { key: 'friends', label: 'Friends & Squads' },
          { key: 'weekly', label: 'Weekly Heats' },
        ]}
        value={board}
        onChange={setBoard}
      />
      <View style={{ gap: space.sm }}>
        {leaderboards[board].slice(0, 5).map((e) => (
          <LeaderRow key={e.handle} entry={e} />
        ))}
      </View>
      <MyRankBar onJump={jump} />
    </>
  );

  if (isTablet) {
    return (
      <Screen fixed>
        <Split left={progression} right={standings} />
      </Screen>
    );
  }

  return (
    <Screen>
      {progression}
      {standings}
    </Screen>
  );
}
