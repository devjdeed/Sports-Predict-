/** Win-streak multiplier ladder (Ranks → Streak Ladder). */
export const STREAK_TIERS: { minStreak: number; multiplier: number }[] = [
  { minStreak: 8, multiplier: 3.0 },
  { minStreak: 7, multiplier: 2.5 },
  { minStreak: 5, multiplier: 2.0 },
  { minStreak: 3, multiplier: 1.5 },
  { minStreak: 1, multiplier: 1.1 },
];

export const STREAK_GOAL = 10;

export const multiplierFor = (streak: number) => STREAK_TIERS.find((t) => streak >= t.minStreak)?.multiplier ?? 1;

export const nextTier = (streak: number) =>
  [...STREAK_TIERS].reverse().find((t) => t.minStreak > streak) ?? null;

/** XP for a trade: one point per dollar staked, boosted by the streak multiplier. */
export const xpForStake = (stake: number, streak: number) => Math.round(stake * multiplierFor(streak));
