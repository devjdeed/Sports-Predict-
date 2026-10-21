import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { forecasters } from '@/data/social';
import {
  averageIn,
  contractsFor,
  costBasis,
  costOf,
  hedgeContracts,
  marketValue,
  opposite,
  payoutOf,
  round2,
  sidePrice,
} from '@/domain/pricing';
import { xpForStake } from '@/domain/progression';
import type { Activity, LimitOrder, Market, Position, SettledPosition, Side } from '@/domain/types';
import type { Resolution } from '@/services/liveSimulator';
import { getMarket } from './marketStore';

export interface Result {
  ok: boolean;
  message: string;
}

interface Profile {
  handle: string;
  streak: number;
  xp: number;
  wins: number;
  losses: number;
  rank: number;
  rankOf: number;
}

interface TradingData {
  cash: number;
  positions: Position[];
  settled: SettledPosition[];
  limits: LimitOrder[];
  activity: Activity[];
  profile: Profile;
  /** Net worth at the close of each of the previous six days (today is computed live). */
  netWorthHistory: number[];
  vaultContribution: number;
  duelPick: 'left' | 'right' | null;
  copied: string[];
}

interface TradingActions {
  buy: (marketId: string, side: Side, stake: number) => Result;
  placeLimit: (marketId: string, side: Side, limitPrice: number, stake: number) => Result;
  cancelLimit: (id: string) => Result;
  cashOut: (positionId: string) => Result;
  hedge: (positionId: string) => Result;
  applyResolutions: (resolutions: Resolution[]) => Result[];
  fillLimits: () => Result[];
  contribute: (amount: number) => Result;
  pickDuel: (side: 'left' | 'right') => Result;
  copyForecaster: (forecasterId: string, stake: number) => Result;
  reset: () => void;
}

export type TradingState = TradingData & TradingActions;

let seq = 0;
const uid = (prefix: string) => `${prefix}-${Date.now().toString(36)}-${(seq++).toString(36)}`;
const fail = (message: string): Result => ({ ok: false, message });

const DAY = 86_400_000;
const seedNow = Date.now();

export const initialTradingData = (): TradingData => ({
  cash: 4451.6,
  positions: [
    { id: 'p-rma', marketId: 'rma-next-goal', side: 'YES', contracts: 150, avgPrice: 52, openedAt: seedNow - DAY / 4 },
    { id: 'p-bos', marketId: 'bos-nyk-65', side: 'YES', contracts: 200, avgPrice: 48, openedAt: seedNow - DAY / 3 },
    { id: 'p-ars', marketId: 'ars-clean-sheet', side: 'YES', contracts: 100, avgPrice: 68, openedAt: seedNow - DAY / 2 },
    { id: 'p-luka', marketId: 'luka-35', side: 'YES', contracts: 80, avgPrice: 42, openedAt: seedNow - DAY / 6 },
  ],
  settled: [
    { id: 's-1', marketId: 'hist', title: 'Lakers +4.5 vs Warriors', side: 'YES', contracts: 120, avgPrice: 41, exitPrice: 100, pnl: 70.8, openedAt: seedNow - 3 * DAY, closedAt: seedNow - 2 * DAY, reason: 'resolved' },
    { id: 's-2', marketId: 'hist', title: 'Inter to Concede First', side: 'NO', contracts: 90, avgPrice: 33, exitPrice: 100, pnl: 60.3, openedAt: seedNow - 4 * DAY, closedAt: seedNow - 3 * DAY, reason: 'resolved' },
    { id: 's-3', marketId: 'hist', title: 'Mahomes 3+ Passing TDs', side: 'YES', contracts: 60, avgPrice: 58, exitPrice: 0, pnl: -34.8, openedAt: seedNow - 6 * DAY, closedAt: seedNow - 5 * DAY, reason: 'resolved' },
  ],
  limits: [{ id: 'l-haaland', marketId: 'haaland-2g', side: 'YES', limitPrice: 65, contracts: 50, createdAt: seedNow - DAY / 8 }],
  activity: [],
  profile: { handle: 'You', streak: 7, xp: 14850, wins: 34, losses: 16, rank: 42, rankOf: 18490 },
  netWorthHistory: [4221.0, 4248.4, 4236.9, 4302.75, 4355.1, 4408.2],
  vaultContribution: 0,
  duelPick: null,
  copied: [],
});

/** Mark-to-market net worth: cash + cash locked in limit orders + open positions at current prices. */
export function netWorthOf(s: Pick<TradingData, 'cash' | 'positions' | 'limits'>, markets: Market[]) {
  const byId = new Map(markets.map((m) => [m.id, m]));
  const open = s.positions.reduce((sum, p) => {
    const m = byId.get(p.marketId);
    return sum + (m ? marketValue(p, m.yesPrice) : costBasis(p));
  }, 0);
  return round2(s.cash + lockedInLimits(s.limits) + open);
}

export const lockedInLimits = (limits: LimitOrder[]) => round2(limits.reduce((sum, l) => sum + costOf(l.contracts, l.limitPrice), 0));

export const lockedInPositions = (positions: Position[]) => round2(positions.reduce((sum, p) => sum + costBasis(p), 0));

function tradable(marketId: string): Market | Result {
  const market = getMarket(marketId);
  if (!market) return fail('Market not found');
  if (market.status !== 'open') return fail('Market has settled');
  return market;
}

export const useTradingStore = create<TradingState>()(
  persist(
    (set, get) => {
      const log = (text: string, amount: number): Activity[] =>
        [{ id: uid('a'), text, amount, at: Date.now() }, ...get().activity].slice(0, 30);

      /** Record a closed trade: win/loss and streak follow the realised P&L. */
      const scored = (profile: Profile, pnl: number): Profile =>
        pnl > 0
          ? { ...profile, wins: profile.wins + 1, streak: profile.streak + 1 }
          : { ...profile, losses: profile.losses + 1, streak: 0 };

      const fill = (s: TradingData, marketId: string, side: Side, contracts: number, price: number) => {
        const existing = s.positions.find((p) => p.marketId === marketId && p.side === side);
        if (!existing) {
          return [...s.positions, { id: uid('p'), marketId, side, contracts, avgPrice: price, openedAt: Date.now() }];
        }
        return s.positions.map((p) => (p === existing ? { ...p, ...averageIn(p, contracts, price) } : p));
      };

      return {
        ...initialTradingData(),

        buy: (marketId, side, stake) => {
          const market = tradable(marketId);
          if ('ok' in market) return market;
          const price = sidePrice(market.yesPrice, side);
          const contracts = contractsFor(Math.min(stake, get().cash), price);
          if (contracts < 1) return fail('Insufficient balance');
          const cost = costOf(contracts, price);
          set((s) => ({
            cash: round2(s.cash - cost),
            positions: fill(s, marketId, side, contracts, price),
            profile: { ...s.profile, xp: s.profile.xp + xpForStake(cost, s.profile.streak) },
            activity: log(`Bought ${contracts} ${side} · ${market.shortTitle}`, -cost),
          }));
          return { ok: true, message: `${contracts} ${side} @ ${price}¢ filled` };
        },

        placeLimit: (marketId, side, limitPrice, stake) => {
          const market = tradable(marketId);
          if ('ok' in market) return market;
          const contracts = contractsFor(Math.min(stake, get().cash), limitPrice);
          if (contracts < 1) return fail('Insufficient balance');
          const cost = costOf(contracts, limitPrice);
          set((s) => ({
            cash: round2(s.cash - cost),
            limits: [...s.limits, { id: uid('l'), marketId, side, limitPrice, contracts, createdAt: Date.now() }],
          }));
          return { ok: true, message: `Limit ${side} @ ${limitPrice}¢ placed` };
        },

        cancelLimit: (id) => {
          const order = get().limits.find((l) => l.id === id);
          if (!order) return fail('Order not found');
          set((s) => ({ cash: round2(s.cash + costOf(order.contracts, order.limitPrice)), limits: s.limits.filter((l) => l.id !== id) }));
          return { ok: true, message: 'Limit order cancelled' };
        },

        cashOut: (positionId) => {
          const position = get().positions.find((p) => p.id === positionId);
          if (!position) return fail('Position not found');
          const market = tradable(position.marketId);
          if ('ok' in market) return market;
          const exitPrice = sidePrice(market.yesPrice, position.side);
          const proceeds = costOf(position.contracts, exitPrice);
          const pnl = round2(proceeds - costBasis(position));
          set((s) => ({
            cash: round2(s.cash + proceeds),
            positions: s.positions.filter((p) => p.id !== positionId),
            settled: [{ ...position, title: market.shortTitle, exitPrice, pnl, closedAt: Date.now(), reason: 'cashout' as const }, ...s.settled],
            profile: scored(s.profile, pnl),
            activity: log(`Cashed out ${market.shortTitle}`, proceeds),
          }));
          return { ok: true, message: `Cashed out ${pnl >= 0 ? '+' : '-'}$${Math.abs(pnl).toFixed(2)}` };
        },

        hedge: (positionId) => {
          const position = get().positions.find((p) => p.id === positionId);
          if (!position) return fail('Position not found');
          const market = tradable(position.marketId);
          if ('ok' in market) return market;
          const side = opposite(position.side);
          const price = sidePrice(market.yesPrice, side);
          const hedgedAlready = get().positions.find((p) => p.marketId === position.marketId && p.side === side)?.contracts ?? 0;
          const contracts = hedgeContracts({ contracts: position.contracts - hedgedAlready }, get().cash, price);
          if (contracts < 1) return fail(hedgedAlready ? 'Position already hedged' : 'Insufficient balance');
          const cost = costOf(contracts, price);
          set((s) => ({
            cash: round2(s.cash - cost),
            positions: fill(s, position.marketId, side, contracts, price),
            activity: log(`Hedged ${contracts} ${side} · ${market.shortTitle}`, -cost),
          }));
          return { ok: true, message: `Hedged with ${contracts} ${side} @ ${price}¢` };
        },

        applyResolutions: (resolutions) => {
          const results: Result[] = [];
          for (const { marketId, outcome } of resolutions) {
            const held = get().positions.filter((p) => p.marketId === marketId);
            const orders = get().limits.filter((l) => l.marketId === marketId);
            if (!held.length && !orders.length) continue;

            const refunds = lockedInLimits(orders);
            const payout = round2(held.reduce((sum, p) => sum + (p.side === outcome ? payoutOf(p.contracts) : 0), 0));
            // A hedged pair counts as one result, scored on the combined P&L.
            const pnl = round2(payout - held.reduce((sum, p) => sum + costBasis(p), 0));
            const title = getMarket(marketId)?.shortTitle ?? 'Market';
            const closedAt = Date.now();

            set((s) => ({
              cash: round2(s.cash + payout + refunds),
              positions: s.positions.filter((p) => p.marketId !== marketId),
              limits: s.limits.filter((l) => l.marketId !== marketId),
              settled: [
                ...held.map((p) => {
                  const exitPrice = p.side === outcome ? 100 : 0;
                  return { ...p, title, exitPrice, pnl: round2(costOf(p.contracts, exitPrice) - costBasis(p)), closedAt, reason: 'resolved' as const };
                }),
                ...s.settled,
              ],
              profile: held.length ? scored(s.profile, pnl) : s.profile,
              activity: log(`${title} settled ${outcome}`, payout),
            }));
            if (held.length) results.push({ ok: pnl > 0, message: `${title} settled ${outcome} · ${pnl >= 0 ? '+' : '-'}$${Math.abs(pnl).toFixed(2)}` });
          }
          return results;
        },

        fillLimits: () => {
          const results: Result[] = [];
          for (const order of get().limits) {
            const market = getMarket(order.marketId);
            if (!market || market.status !== 'open') continue;
            const price = sidePrice(market.yesPrice, order.side);
            if (price > order.limitPrice) continue;
            // Cash was reserved at the limit price; fills at a better price refund the difference.
            const refund = round2(costOf(order.contracts, order.limitPrice) - costOf(order.contracts, price));
            set((s) => ({
              cash: round2(s.cash + refund),
              limits: s.limits.filter((l) => l.id !== order.id),
              positions: fill(s, order.marketId, order.side, order.contracts, price),
              activity: log(`Limit filled ${order.contracts} ${order.side} · ${market.shortTitle}`, -costOf(order.contracts, price)),
            }));
            results.push({ ok: true, message: `Limit filled: ${order.contracts} ${order.side} @ ${price}¢` });
          }
          return results;
        },

        contribute: (amount) => {
          if (amount > get().cash) return fail('Insufficient balance');
          set((s) => ({
            cash: round2(s.cash - amount),
            vaultContribution: round2(s.vaultContribution + amount),
            activity: log('Contributed to Neon Syndicate vault', -amount),
          }));
          return { ok: true, message: `$${amount} added to the vault` };
        },

        pickDuel: (side) => {
          if (get().duelPick) return fail('Duel pick already locked');
          set((s) => ({ duelPick: side, profile: { ...s.profile, xp: s.profile.xp + 100 } }));
          return { ok: true, message: 'Duel pick locked · +100 XP' };
        },

        copyForecaster: (forecasterId, stake) => {
          const f = forecasters.find((x) => x.id === forecasterId);
          if (!f) return fail('Forecaster not found');
          const result = get().buy(f.marketId, f.side, stake);
          if (result.ok) set((s) => ({ copied: [...new Set([...s.copied, forecasterId])] }));
          return result;
        },

        reset: () => set(initialTradingData()),
      };
    },
    {
      name: 'apex-trading-v1',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: ({ cash, positions, settled, limits, activity, profile, netWorthHistory, vaultContribution, duelPick, copied }) => ({
        cash,
        positions,
        settled,
        limits,
        activity,
        profile,
        netWorthHistory,
        vaultContribution,
        duelPick,
        copied,
      }),
    },
  ),
);
