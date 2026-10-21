import { router } from 'expo-router';
import { useMemo } from 'react';
import { View } from 'react-native';

import { Screen } from '@/components/layout/Screen';
import { Split } from '@/components/layout/Split';
import { LiveScoreTicker } from '@/components/markets/LiveScoreTicker';
import { MarketCard } from '@/components/markets/MarketCard';
import { SportFilterChips } from '@/components/markets/SportFilterChips';
import { StreakBanner } from '@/components/markets/StreakBanner';
import { MarketDetail } from '@/components/trade/MarketDetail';
import { AppText } from '@/components/ui/AppText';
import type { Side } from '@/domain/types';
import { useResponsive } from '@/hooks/useResponsive';
import { useMarketStore } from '@/store/marketStore';
import { colors, space } from '@/theme';

const STATUS_RANK = { live: 0, break: 1, upcoming: 2, final: 3 } as const;

export default function MarketsScreen() {
  const { isTablet, gutter } = useResponsive();
  const markets = useMarketStore((s) => s.markets);
  const matches = useMarketStore((s) => s.matches);
  const filter = useMarketStore((s) => s.filter);
  const focusId = useMarketStore((s) => s.focusMarketId);
  const focusSide = useMarketStore((s) => s.focusSide);
  const focus = useMarketStore((s) => s.focus);
  const openSheet = useMarketStore((s) => s.openSheet);

  const feed = useMemo(() => {
    const status = new Map(matches.map((m) => [m.id, m.status]));
    // Stable sort keeps fixture order within a status, so cards don't reshuffle on every tick.
    return [...markets]
      .filter((m) => (filter === 'hot' ? m.status === 'open' : m.sport === filter))
      .sort(
        (a, b) =>
          (a.status === 'settled' ? 1 : 0) - (b.status === 'settled' ? 1 : 0) ||
          STATUS_RANK[status.get(a.matchId) ?? 'upcoming'] - STATUS_RANK[status.get(b.matchId) ?? 'upcoming'],
      );
  }, [markets, matches, filter]);

  const open = (id: string) => {
    focus(id);
    if (!isTablet) router.navigate('/trade');
  };
  const trade = (id: string, side: Side, stake?: number) => {
    if (isTablet) focus(id, side);
    else openSheet(id, side, stake);
  };
  const jumpToMatch = (matchId: string) => {
    const lead = markets.find((m) => m.matchId === matchId);
    if (lead) open(lead.id);
  };

  const list = (
    <>
      <LiveScoreTicker onSelectMatch={jumpToMatch} />
      <StreakBanner />
      <SportFilterChips />
      {feed.length === 0 ? (
        <AppText variant="body-md" color={colors.textSecondary} align="center" style={{ paddingVertical: space.xl }}>
          No markets in this category right now.
        </AppText>
      ) : (
        <View style={{ gap: gutter }}>
          {feed.map((m) => (
            <MarketCard key={m.id} market={m} selected={isTablet && m.id === focusId} onOpen={() => open(m.id)} onTrade={(side, stake) => trade(m.id, side, stake)} />
          ))}
        </View>
      )}
    </>
  );

  if (isTablet) {
    return (
      <Screen fixed>
        <Split left={list} right={<MarketDetail marketId={focusId} side={focusSide} onSideChange={(s) => focus(focusId, s)} />} />
      </Screen>
    );
  }

  return <Screen>{list}</Screen>;
}
