import { createMarkets } from '@/data/markets';
import { matches } from '@/data/matches';
import type { Market, Match } from '@/domain/types';

/**
 * Data source boundary. Everything here reads local fixtures today; replace these
 * functions with API calls (and the live simulator with a socket feed) to go live.
 */
export function loadSnapshot(): { markets: Market[]; matches: Match[] } {
  return { markets: createMarkets(), matches: structuredClone(matches) };
}
