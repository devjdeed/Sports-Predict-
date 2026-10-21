import { create } from 'zustand';

import type { Market, Match, Side, Sport } from '@/domain/types';
import { step, type Resolution } from '@/services/liveSimulator';
import { loadSnapshot } from '@/services/marketService';

export type SportFilter = 'hot' | Sport;

interface Slip {
  marketId: string;
  side: Side;
  /** Preset stake; `Infinity` = MAX. */
  stake?: number;
}

interface MarketState {
  markets: Market[];
  matches: Match[];
  filter: SportFilter;
  /** Market shown on the Trade tab and the tablet detail pane. */
  focusMarketId: string;
  focusSide: Side;
  /** Phone trading sheet; null when closed. */
  sheet: Slip | null;
  setFilter: (f: SportFilter) => void;
  focus: (marketId: string, side?: Side) => void;
  openSheet: (marketId: string, side: Side, stake?: number) => void;
  closeSheet: () => void;
  tick: () => Resolution[];
}

const snapshot = loadSnapshot();

export const useMarketStore = create<MarketState>((set, get) => ({
  ...snapshot,
  filter: 'hot',
  focusMarketId: snapshot.markets[0].id,
  focusSide: 'YES',
  sheet: null,
  setFilter: (filter) => set({ filter }),
  focus: (focusMarketId, side) => set((s) => ({ focusMarketId, focusSide: side ?? s.focusSide })),
  openSheet: (marketId, side, stake) => set({ sheet: { marketId, side, stake } }),
  closeSheet: () => set({ sheet: null }),
  tick: () => {
    const { markets, matches, resolutions } = step(get());
    set({ markets, matches });
    return resolutions;
  },
}));

export const useMarket = (id: string) => useMarketStore((s) => s.markets.find((m) => m.id === id));
export const useMatch = (id: string | undefined) => useMarketStore((s) => s.matches.find((m) => m.id === id));

export const getMarket = (id: string) => useMarketStore.getState().markets.find((m) => m.id === id);
export const getMatch = (id: string) => useMarketStore.getState().matches.find((m) => m.id === id);
