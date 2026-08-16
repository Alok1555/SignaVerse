// ============================================================
// SIGNAVERSE — Gamification API Service
// ============================================================

import apiClient from './client';
import type {
  Achievement,
  Reward,
  DailyChallenge,
  LeaderboardEntry,
} from '../../types/gamification';
import type { ApiResponse } from '../../types/api';

export const gamificationApi = {
  getAchievements: async (): Promise<Achievement[]> => {
    const { data } = await apiClient.get<ApiResponse<Achievement[]>>('/achievements');
    return data.data;
  },

  getRewards: async (): Promise<Reward[]> => {
    const { data } = await apiClient.get<ApiResponse<Reward[]>>('/rewards');
    return data.data;
  },

  getTodayChallenge: async (): Promise<DailyChallenge> => {
    const { data } = await apiClient.get<ApiResponse<DailyChallenge>>('/challenges/today');
    return data.data;
  },

  completeChallenge: async (): Promise<{ xpEarned: number; coinsEarned: number }> => {
    const { data } = await apiClient.post<ApiResponse<{ xpEarned: number; coinsEarned: number }>>(
      '/challenges/today/complete'
    );
    return data.data;
  },

  getLeaderboard: async (): Promise<LeaderboardEntry[]> => {
    const { data } = await apiClient.get<ApiResponse<LeaderboardEntry[]>>('/leaderboard');
    return data.data;
  },

  getProgress: async (): Promise<Record<string, { completed: boolean; accuracy?: number }>> => {
    const { data } = await apiClient.get<ApiResponse<Record<string, unknown>>>('/progress');
    return data.data as Record<string, { completed: boolean; accuracy?: number }>;
  },
};
