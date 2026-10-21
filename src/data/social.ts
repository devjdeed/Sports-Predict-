/** Static social fixtures for Ranks and Squads. */

export interface LeaderEntry {
  rank: number;
  handle: string;
  verified?: boolean;
  hitRate: number;
  predictions: number;
  pnl: number;
}

export const leaderboards: Record<'global' | 'friends' | 'weekly', LeaderEntry[]> = {
  global: [
    { rank: 1, handle: 'KevBets99', verified: true, hitRate: 0.942, predictions: 418, pnl: 48920 },
    { rank: 2, handle: 'ViperPicks', hitRate: 0.891, predictions: 320, pnl: 39140 },
    { rank: 3, handle: 'TacticalTrader', hitRate: 0.865, predictions: 289, pnl: 34200 },
    { rank: 4, handle: 'GridironAlpha', hitRate: 0.824, predictions: 194, pnl: 28450 },
    { rank: 5, handle: 'BuzzerBeaterX', hitRate: 0.809, predictions: 241, pnl: 24110 },
    { rank: 6, handle: 'xG_Whisperer', hitRate: 0.797, predictions: 176, pnl: 21980 },
    { rank: 7, handle: 'ParlayPhantom', hitRate: 0.781, predictions: 302, pnl: 19420 },
  ],
  friends: [
    { rank: 1, handle: 'Marcus_Oracle', verified: true, hitRate: 0.82, predictions: 211, pnl: 18450 },
    { rank: 2, handle: 'Sarah.eth', hitRate: 0.77, predictions: 140, pnl: 9120 },
    { rank: 3, handle: 'Alex_M', hitRate: 0.74, predictions: 98, pnl: 6310 },
    { rank: 4, handle: 'Dmitri_K', hitRate: 0.71, predictions: 77, pnl: 3880 },
  ],
  weekly: [
    { rank: 1, handle: 'ViperPicks', hitRate: 0.93, predictions: 41, pnl: 6240 },
    { rank: 2, handle: 'HoopsMatrix', verified: true, hitRate: 0.9, predictions: 38, pnl: 5110 },
    { rank: 3, handle: 'KevBets99', hitRate: 0.88, predictions: 52, pnl: 4870 },
    { rank: 4, handle: 'NightOwlNBA', hitRate: 0.84, predictions: 29, pnl: 3320 },
    { rank: 5, handle: 'CornerKingFC', hitRate: 0.8, predictions: 33, pnl: 2905 },
  ],
};

export interface Badge {
  id: string;
  name: string;
  tier: string;
  icon: string;
  color: string;
  unlocked: boolean;
}

export const badges: Badge[] = [
  { id: 'underdog', name: 'Underdog Prophet', tier: 'Tier III', icon: 'crystal-ball', color: '#00F59B', unlocked: true },
  { id: 'first-blood', name: 'First Blood', tier: 'Master', icon: 'sword', color: '#FF3366', unlocked: true },
  { id: 'centurion', name: 'Centurion Club', tier: '100+ Won', icon: 'medal-outline', color: '#00D2FF', unlocked: true },
  { id: 'iron', name: 'Iron Defense', tier: 'Tier I', icon: 'shield-outline', color: '#8E9CAE', unlocked: true },
  { id: 'clutch', name: 'Clutch Sniper', tier: 'Tier II', icon: 'target', color: '#FFD027', unlocked: true },
  { id: 'whale', name: 'Whale Watcher', tier: 'Locked', icon: 'fish', color: '#505D70', unlocked: false },
];

export const BADGES_TOTAL = 24;
export const BADGES_UNLOCKED = 18;

export const streakLadder = [
  { day: 1, label: 'D1', reward: '1.1x', multiplier: 1.1 },
  { day: 3, label: 'D3', reward: '1.5x', multiplier: 1.5 },
  { day: 5, label: 'D5', reward: '2.0x', multiplier: 2.0 },
  { day: 7, label: 'D7', reward: '2.5x', multiplier: 2.5 },
  { day: 10, label: 'D10', reward: '$100', multiplier: 3.0 },
];

export interface Forecaster {
  id: string;
  name: string;
  initials: string;
  kind: 'human' | 'quant';
  winRate: string;
  stat: string;
  marketId: string;
  side: 'YES' | 'NO';
  label: string;
  league: string;
  intel: string;
  copiers: number;
  copyLabel: string;
}

export const forecasters: Forecaster[] = [
  {
    id: 'oracle',
    name: 'Marcus "The Oracle" Vance',
    initials: 'MV',
    kind: 'human',
    winRate: '82% Win Rate',
    stat: '+$184.5K Net',
    marketId: 'mci-rma-btts',
    side: 'YES',
    label: 'Live Pick #4820',
    league: 'UEFA Champions League',
    intel: 'Madrid missing regular CB pair; City averaging 2.1 xG in first 30 mins away across high-stakes knockouts.',
    copiers: 1280,
    copyLabel: 'traders replicating',
  },
  {
    id: 'hoops',
    name: 'HoopsMatrix AI',
    initials: 'HM',
    kind: 'quant',
    winRate: '78.4% NBA Spread',
    stat: '942 Runs',
    marketId: 'den-lal-spread',
    side: 'YES',
    label: 'Spread Lock',
    league: 'NBA Western Conf',
    intel: 'Model confidence 91.2% — Lakers on 2nd night of back-to-back, Jokić usage up 6% at altitude.',
    copiers: 894,
    copyLabel: 'automated orders',
  },
];

export const duel = {
  title: 'Apex Duel: @GhostPicks vs @StatKing',
  market: 'UEFA Champions League Final Victorious Club',
  left: { handle: '@GhostPicks', pick: 'City', votes: 3420 },
  right: { handle: '@StatKing', pick: 'Madrid', votes: 2475 },
  bounty: 100,
};

export const pulseSeed = [
  { id: 'p1', who: 'Alex_M', initials: 'AM', text: 'cashed out profit on Bayern', value: '+$140.00', tone: 'yes' as const },
  { id: 'p2', who: 'Sarah.eth', initials: 'SE', text: 'locked 200 YES contracts', value: 'Arsenal Win', tone: 'yes' as const },
  { id: 'p3', who: 'Dmitri_K', initials: 'DK', text: 'joined Neon Syndicate vault', value: '+$500 POOL', tone: 'yes' as const },
];

export const squad = {
  name: 'Neon Syndicate',
  rank: 8,
  tier: 1,
  members: 12,
  capacity: 15,
  roi30d: 0.442,
  vault: 64200,
  vaultTarget: 80000,
  dividendPool: 1420,
  dividendDay: 'Sunday',
  activeSquads: 1842,
};
