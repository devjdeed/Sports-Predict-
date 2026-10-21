import type { Position, Side } from './types';

/** Every contract settles at $1.00 (100¢) if correct, $0 otherwise. */
export const PAYOUT_CENTS = 100;
export const TAKER_FEE_RATE = 0.025;
export const PROMO_FEE_RATE = 0;

export const clampPrice = (cents: number) => Math.min(99, Math.max(1, Math.round(cents)));

export const sidePrice = (yesPrice: number, side: Side) => (side === 'YES' ? yesPrice : PAYOUT_CENTS - yesPrice);

export const opposite = (side: Side): Side => (side === 'YES' ? 'NO' : 'YES');

/** Whole contracts a dollar stake buys at a price in cents. */
export const contractsFor = (stakeDollars: number, priceCents: number) =>
  priceCents <= 0 ? 0 : Math.floor((stakeDollars * 100) / priceCents + 1e-9);

/** Dollar cost of contracts at a price in cents. */
export const costOf = (contracts: number, priceCents: number) => round2((contracts * priceCents) / 100);

export const payoutOf = (contracts: number) => round2((contracts * PAYOUT_CENTS) / 100);

/** Return multiple on a winning contract bought at `priceCents`, e.g. 64¢ → 0.5625 (+56%). */
export const returnPct = (priceCents: number) => (PAYOUT_CENTS - priceCents) / priceCents;

export const marketValue = (p: Pick<Position, 'contracts' | 'side'>, yesPrice: number) =>
  costOf(p.contracts, sidePrice(yesPrice, p.side));

export const costBasis = (p: Pick<Position, 'contracts' | 'avgPrice'>) => costOf(p.contracts, p.avgPrice);

export const unrealizedPnl = (p: Position, yesPrice: number) => round2(marketValue(p, yesPrice) - costBasis(p));

export const pnlPct = (p: Position, yesPrice: number) => {
  const basis = costBasis(p);
  return basis === 0 ? 0 : unrealizedPnl(p, yesPrice) / basis;
};

/** Merge a fill into an existing same-side position, volume-weighting the entry. */
export const averageIn = (existing: Pick<Position, 'contracts' | 'avgPrice'>, contracts: number, priceCents: number) => {
  const total = existing.contracts + contracts;
  return {
    contracts: total,
    avgPrice: total === 0 ? 0 : (existing.contracts * existing.avgPrice + contracts * priceCents) / total,
  };
};

/**
 * Contracts of the opposite side needed to fully hedge: matching the contract count
 * guarantees a $1 payout per pair whichever way the market resolves.
 */
export const hedgeContracts = (p: Pick<Position, 'contracts'>, cashDollars: number, oppositePriceCents: number) =>
  Math.min(p.contracts, contractsFor(cashDollars, oppositePriceCents));

/** Locked-in P&L after a full hedge: guaranteed payout minus both legs' cost. */
export const hedgedPnl = (p: Pick<Position, 'contracts' | 'avgPrice'>, oppositePriceCents: number) =>
  round2(payoutOf(p.contracts) - costOf(p.contracts, p.avgPrice) - costOf(p.contracts, oppositePriceCents));

export interface TradeQuote {
  price: number;
  contracts: number;
  cost: number;
  fee: number;
  listFee: number;
  payout: number;
  profit: number;
  profitPct: number;
}

export const quote = (stakeDollars: number, priceCents: number): TradeQuote => {
  const contracts = contractsFor(stakeDollars, priceCents);
  const cost = costOf(contracts, priceCents);
  const payout = payoutOf(contracts);
  const fee = round2(cost * PROMO_FEE_RATE);
  const profit = round2(payout - cost - fee);
  return {
    price: priceCents,
    contracts,
    cost,
    fee,
    listFee: round2(cost * TAKER_FEE_RATE),
    payout,
    profit,
    profitPct: cost === 0 ? 0 : profit / cost,
  };
};

export function round2(n: number) {
  return Math.round(n * 100) / 100;
}
