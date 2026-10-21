export type Side = 'YES' | 'NO';

export type Sport = 'soccer' | 'nba' | 'nfl' | 'ufc' | 'esports';

export type MarketKind = 'match' | 'spread' | 'prop';

/** Game clock. `up` counts elapsed seconds (soccer), `down` counts remaining seconds per period. */
export interface MatchClock {
  mode: 'up' | 'down' | 'static';
  /** Index into `periods` (down clocks) — e.g. Q1..Q4. */
  period: number;
  periods?: string[];
  seconds: number;
  /** Seconds per period for down clocks, or full time for up clocks. */
  length: number;
  /** Shown when the clock is static: "Halftime", "Tomorrow 17:30", "FINAL". */
  label?: string;
}

export type MatchStatus = 'live' | 'upcoming' | 'break' | 'final';

export interface Team {
  code: string;
  name: string;
  short: string;
  score: number;
  color: string;
  tag?: string;
}

export interface MatchStats {
  possession: [number, number];
  shotsOnTarget: [number, number];
  corners: [number, number];
  momentum: number;
  alert?: string;
}

export interface Match {
  id: string;
  sport: Sport;
  league: string;
  stage?: string;
  venue?: string;
  status: MatchStatus;
  home: Team;
  away: Team;
  clock: MatchClock;
  stats?: MatchStats;
}

export interface MarketEvent {
  /** Index into the price history the event happened at. */
  at: number;
  label: string;
  tone: 'yes' | 'no';
}

export interface Market {
  id: string;
  matchId: string;
  sport: Sport;
  kind: MarketKind;
  tag: string;
  question: string;
  shortTitle: string;
  /** YES contract price in whole cents (1-99). NO = 100 - yesPrice. */
  yesPrice: number;
  prevYesPrice: number;
  history: number[];
  events: MarketEvent[];
  volume: number;
  traders: number;
  liquidity: number;
  votes: number;
  /** Market resolves when its match clock reaches this many elapsed seconds (up clocks), or at full time. */
  closesAt?: number;
  status: 'open' | 'settled';
  outcome?: Side;
  context?: string;
  player?: { name: string; detail: string; initials: string };
}

export interface Position {
  id: string;
  marketId: string;
  side: Side;
  contracts: number;
  /** Average entry in cents. */
  avgPrice: number;
  openedAt: number;
}

export interface SettledPosition extends Position {
  title: string;
  exitPrice: number;
  pnl: number;
  closedAt: number;
  reason: 'cashout' | 'resolved';
}

export interface LimitOrder {
  id: string;
  marketId: string;
  side: Side;
  limitPrice: number;
  contracts: number;
  createdAt: number;
}

export interface Activity {
  id: string;
  text: string;
  amount: number;
  at: number;
}
