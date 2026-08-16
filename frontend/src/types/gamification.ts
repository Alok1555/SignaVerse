// ============================================================
// SIGNAVERSE — Gamification Types
// ============================================================

export interface Achievement {
  id: string;
  slug: string;
  name: string;
  description: string;
  iconUrl?: string;
  xpReward: number;
  unlockedAt?: string;
  isUnlocked: boolean;
}

export interface Reward {
  id: string;
  slug: string;
  name: string;
  description: string;
  type: 'BADGE' | 'TITLE' | 'AVATAR_ITEM' | 'COIN_PACK';
  imageUrl?: string;
  earnedAt?: string;
}

export interface DailyChallenge {
  id: string;
  date: string;
  sign: {
    id: string;
    word: string;
    description: string;
  };
  xpReward: number;
  coinReward: number;
  isCompleted: boolean;
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  displayName: string;
  avatarUrl?: string;
  xp: number;
  level: number;
  streak: number;
  isCurrentUser: boolean;
}

export interface PracticeResultPayload {
  sessionId: string;
  signId: string;
  confidence: number;
  correct: boolean;
}

export interface PracticeResultResponse {
  xpEarned: number;
  coinsEarned: number;
  totalXP: number;
  level: number;
  levelUp: boolean;
  streak: number;
  newAchievements: Achievement[];
  newRewards: Reward[];
}

export interface XPLevel {
  level: number;
  currentXP: number;
  xpForCurrentLevel: number;
  xpForNextLevel: number;
  progress: number; // 0-1
}
