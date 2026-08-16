// ============================================================
// SIGNAVERSE — Custom Hook: useGamification
// ============================================================

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { gamificationApi } from '../services/api/gamificationApi';
import { practiceApi } from '../services/api/practiceApi';
import { useUIStore } from '../store/uiStore';
import { useAuthStore } from '../store/authStore';
import type { PracticeResultPayload } from '../types/gamification';

export function useGamification() {
  const queryClient = useQueryClient();
  const { showCelebration } = useUIStore();
  const { user, updateUser } = useAuthStore();

  const { data: achievements } = useQuery({
    queryKey: ['achievements'],
    queryFn: gamificationApi.getAchievements,
    staleTime: 5 * 60 * 1000,
  });

  const { data: rewards } = useQuery({
    queryKey: ['rewards'],
    queryFn: gamificationApi.getRewards,
    staleTime: 5 * 60 * 1000,
  });

  const { data: leaderboard } = useQuery({
    queryKey: ['leaderboard'],
    queryFn: gamificationApi.getLeaderboard,
    staleTime: 60 * 1000,
  });

  const { data: todayChallenge } = useQuery({
    queryKey: ['challenge-today'],
    queryFn: gamificationApi.getTodayChallenge,
    staleTime: 60 * 1000,
  });

  const submitResultMutation = useMutation({
    mutationFn: practiceApi.submitResult,
    onSuccess: (result) => {
      // Update user profile in store
      if (user) {
        updateUser({
          profile: {
            ...user.profile,
            xp: result.totalXP,
            level: result.level,
            streak: result.streak,
          },
        });
      }

      // Trigger celebration
      if (result.xpEarned > 0) {
        showCelebration({
          xpEarned: result.xpEarned,
          levelUp: result.levelUp,
          newLevel: result.level,
          newAchievements: result.newAchievements.map((a) => a.name),
        });
      }

      queryClient.invalidateQueries({ queryKey: ['me'] });
      queryClient.invalidateQueries({ queryKey: ['achievements'] });
      queryClient.invalidateQueries({ queryKey: ['leaderboard'] });
    },
  });

  return {
    achievements,
    rewards,
    leaderboard,
    todayChallenge,
    submitResult: (payload: PracticeResultPayload) =>
      submitResultMutation.mutateAsync(payload),
    isSubmitting: submitResultMutation.isPending,
  };
}
