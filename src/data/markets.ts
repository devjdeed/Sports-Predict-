import type { Market, MarketEvent } from '@/domain/types';

/** Deterministic PRNG so fixtures render identically on every launch. */
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Random walk through each [index, price] anchor, so charts show the story from the mockups. */
function walk(seed: number, length: number, anchors: [number, number][]): number[] {
  const rand = mulberry32(seed);
  const out: number[] = [];
  for (let a = 0; a < anchors.length - 1; a++) {
    const [i0, p0] = anchors[a];
    const [i1, p1] = anchors[a + 1];
    for (let i = i0; i < i1; i++) {
      const t = (i - i0) / (i1 - i0);
      out.push(Math.round(Math.min(98, Math.max(2, p0 + (p1 - p0) * t + (rand() - 0.5) * 4))));
    }
  }
  out.push(anchors[anchors.length - 1][1]);
  return out.slice(-length);
}

type Seed = Omit<Market, 'history' | 'prevYesPrice' | 'status' | 'events'> & {
  anchors: [number, number][];
  events?: MarketEvent[];
};

const seeds: Seed[] = [
  {
    id: 'rma-next-goal',
    matchId: 'rma-bay',
    sport: 'soccer',
    kind: 'match',
    tag: 'Prop Spec 75M',
    question: 'Will Real Madrid score next before 75:00?',
    shortTitle: 'Real Madrid Next Goal before 75\'',
    yesPrice: 64,
    anchors: [[0, 22], [30, 30], [53, 44], [55, 58], [70, 61], [80, 64]],
    events: [{ at: 54, label: "54' Davies sent off", tone: 'no' }],
    volume: 148250,
    traders: 1400,
    liquidity: 184200,
    votes: 2190,
    closesAt: 75 * 60,
    context: 'Attacking momentum 84%',
  },
  {
    id: 'bos-nyk-spread',
    matchId: 'bos-nyk',
    sport: 'nba',
    kind: 'spread',
    tag: 'Spread -2.5',
    question: 'Celtics to win by 3+ points (Spread -2.5)?',
    shortTitle: 'Celtics -2.5 Spread vs Knicks',
    yesPrice: 52,
    anchors: [[0, 61], [40, 55], [60, 47], [80, 52]],
    volume: 96400,
    traders: 860,
    liquidity: 112300,
    votes: 1312,
  },
  {
    id: 'bos-nyk-65',
    matchId: 'bos-nyk',
    sport: 'nba',
    kind: 'spread',
    tag: 'Spread -6.5',
    question: 'Celtics to cover -6.5 vs Knicks?',
    shortTitle: 'Celtics -6.5 Spread vs Knicks',
    yesPrice: 58,
    anchors: [[0, 44], [40, 50], [80, 58]],
    volume: 41200,
    traders: 402,
    liquidity: 52800,
    votes: 618,
    context: 'BOS 108 - 99 NYK (+9 Margin)',
  },
  {
    id: 'haaland-2g',
    matchId: 'mci-wol',
    sport: 'soccer',
    kind: 'prop',
    tag: 'Player Prop',
    question: 'Haaland to score 2+ goals vs Wolves?',
    shortTitle: 'Haaland 2+ Goals vs Wolves',
    yesPrice: 71,
    anchors: [[0, 66], [80, 71]],
    volume: 62100,
    traders: 540,
    liquidity: 84500,
    votes: 980,
    player: { name: 'Erling Haaland', detail: 'Man City vs Wolves', initials: 'EH' },
  },
  {
    id: 'ars-clean-sheet',
    matchId: 'ars-che',
    sport: 'soccer',
    kind: 'match',
    tag: 'Clean Sheet',
    question: 'Arsenal to keep a clean sheet vs Chelsea?',
    shortTitle: 'Arsenal Clean Sheet vs Chelsea',
    yesPrice: 94,
    anchors: [[0, 52], [40, 74], [80, 94]],
    volume: 77300,
    traders: 690,
    liquidity: 61000,
    votes: 1104,
    context: 'Near Settlement',
  },
  {
    id: 'luka-35',
    matchId: 'dal-phx',
    sport: 'nba',
    kind: 'prop',
    tag: 'NBA Player Prop',
    question: 'Luka Dončić to score 35+ points?',
    shortTitle: 'Luka Dončić 35+ Points Scored',
    yesPrice: 38,
    anchors: [[0, 46], [40, 41], [80, 38]],
    volume: 33800,
    traders: 377,
    liquidity: 40100,
    votes: 512,
    context: 'Currently at 14 PTS (16 Min Played)',
    player: { name: 'Luka Dončić', detail: 'Mavericks vs Suns', initials: 'LD' },
  },
  {
    id: 'kc-next-td',
    matchId: 'kc-buf',
    sport: 'nfl',
    kind: 'match',
    tag: 'Next Score',
    question: 'Chiefs to score the next touchdown?',
    shortTitle: 'Chiefs Next Touchdown',
    yesPrice: 48,
    anchors: [[0, 55], [40, 51], [80, 48]],
    volume: 118900,
    traders: 1210,
    liquidity: 140200,
    votes: 1876,
  },
  {
    id: 't1-map2',
    matchId: 't1-gen',
    sport: 'esports',
    kind: 'match',
    tag: 'Map Winner',
    question: 'T1 to win Map 2 vs Gen.G?',
    shortTitle: 'T1 Map 2 Winner',
    yesPrice: 66,
    anchors: [[0, 50], [40, 58], [80, 66]],
    volume: 28400,
    traders: 311,
    liquidity: 30200,
    votes: 455,
  },
  {
    id: 'mci-rma-btts',
    matchId: 'mci-rma',
    sport: 'soccer',
    kind: 'match',
    tag: 'Both Teams Score',
    question: 'Man City vs Real Madrid — both teams to score in 1st half?',
    shortTitle: 'MCI vs RMA BTTS 1st Half',
    yesPrice: 54,
    anchors: [[0, 49], [80, 54]],
    volume: 51200,
    traders: 488,
    liquidity: 66000,
    votes: 702,
  },
  {
    id: 'den-lal-spread',
    matchId: 'den-lal',
    sport: 'nba',
    kind: 'spread',
    tag: 'Spread -4.5',
    question: 'Denver Nuggets -4.5 vs LA Lakers?',
    shortTitle: 'Nuggets -4.5 vs Lakers',
    yesPrice: 61,
    anchors: [[0, 55], [80, 61]],
    volume: 39900,
    traders: 352,
    liquidity: 48800,
    votes: 590,
  },
  {
    id: 'pereira-ko',
    matchId: 'ufc-310',
    sport: 'ufc',
    kind: 'prop',
    tag: 'Method of Victory',
    question: 'Pereira to win by KO/TKO?',
    shortTitle: 'Pereira by KO/TKO',
    yesPrice: 57,
    anchors: [[0, 52], [80, 57]],
    volume: 45700,
    traders: 503,
    liquidity: 58300,
    votes: 810,
    player: { name: 'Alex Pereira', detail: 'UFC 310 Main Event', initials: 'AP' },
  },
];

export function createMarkets(): Market[] {
  return seeds.map(({ anchors, events, ...m }, i) => {
    const history = walk(i + 7, 81, anchors);
    history[history.length - 1] = m.yesPrice;
    return { ...m, history, events: events ?? [], prevYesPrice: m.yesPrice, status: 'open' };
  });
}
