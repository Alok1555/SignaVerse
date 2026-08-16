import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/database';
import { HttpError } from '../middleware/errorHandler';
import { getLevel } from '../utils/xp';

export async function getAchievements(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return next(new HttpError('Unauthorized', 401));
    }

    const achievements = await prisma.achievement.findMany();
    const userAchievements = await prisma.userAchievement.findMany({
      where: { userId },
    });
    const unlockedIds = new Set(userAchievements.map((ua) => ua.achievementId));

    const result = achievements.map((ach) => ({
      id: ach.id,
      slug: ach.slug,
      name: ach.name,
      description: ach.description,
      iconUrl: ach.iconUrl,
      xpReward: ach.xpReward,
      isUnlocked: unlockedIds.has(ach.id),
      unlockedAt: userAchievements.find((ua) => ua.achievementId === ach.id)?.unlockedAt || null,
    }));

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    return next(error);
  }
}

export async function getRewards(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return next(new HttpError('Unauthorized', 401));
    }

    const userRewards = await prisma.userReward.findMany({
      where: { userId },
      include: { reward: true },
    });

    const result = userRewards.map((ur) => ({
      id: ur.reward.id,
      slug: ur.reward.slug,
      name: ur.reward.name,
      description: ur.reward.description,
      type: ur.reward.type,
      imageUrl: ur.reward.imageUrl,
      earnedAt: ur.earnedAt,
    }));

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    return next(error);
  }
}

export async function getLeaderboard(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return next(new HttpError('Unauthorized', 401));
    }

    // Top 10 profiles ordered by XP
    const topProfiles = await prisma.profile.findMany({
      take: 10,
      orderBy: { xp: 'desc' },
      include: {
        user: {
          select: { role: true },
        },
      },
    });

    const result = topProfiles.map((p, index) => ({
      userId: p.userId,
      displayName: p.displayName,
      xp: p.xp,
      level: p.level,
      streak: p.streak,
      rank: index + 1,
      isCurrentUser: p.userId === userId,
    }));

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    return next(error);
  }
}

export async function getTodayChallenge(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return next(new HttpError('Unauthorized', 401));
    }

    const todayStr = new Date().toISOString().split('T')[0];

    const challenge = await prisma.dailyChallenge.findUnique({
      where: { date: todayStr },
    });

    if (!challenge) {
      return res.status(200).json({
        success: true,
        data: null,
      });
    }

    const sign = await prisma.sign.findUnique({
      where: { id: challenge.signId },
    });

    if (!sign) {
      return res.status(200).json({
        success: true,
        data: null,
      });
    }

    const completion = await prisma.dailyChallengeCompletion.findUnique({
      where: {
        userId_challengeId: {
          userId,
          challengeId: challenge.id,
        },
      },
    });

    return res.status(200).json({
      success: true,
      data: {
        id: challenge.id,
        date: challenge.date,
        xpReward: challenge.xpReward,
        coinReward: challenge.coinReward,
        isCompleted: !!completion,
        sign: {
          id: sign.id,
          word: sign.word,
          description: sign.description,
          videoUrl: sign.videoUrl,
          imageUrl: sign.imageUrl,
        },
      },
    });
  } catch (error) {
    return next(error);
  }
}

export async function completeChallenge(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return next(new HttpError('Unauthorized', 401));
    }

    const todayStr = new Date().toISOString().split('T')[0];

    const challenge = await prisma.dailyChallenge.findUnique({
      where: { date: todayStr },
    });

    if (!challenge) {
      return next(new HttpError('No challenge active for today', 404));
    }

    // Check if already completed
    const existingCompletion = await prisma.dailyChallengeCompletion.findUnique({
      where: {
        userId_challengeId: {
          userId,
          challengeId: challenge.id,
        },
      },
    });

    if (existingCompletion) {
      return next(new HttpError('Challenge already completed today', 400));
    }

    // Save completion
    await prisma.dailyChallengeCompletion.create({
      data: {
        userId,
        challengeId: challenge.id,
      },
    });

    // Award rewards
    const profile = await prisma.profile.findUnique({
      where: { userId },
    });

    if (!profile) {
      return next(new HttpError('Profile not found', 404));
    }

    const newXP = profile.xp + challenge.xpReward;
    const newCoins = profile.coins + challenge.coinReward;
    const newLevel = getLevel(newXP);

    await prisma.profile.update({
      where: { userId },
      data: {
        xp: newXP,
        level: newLevel,
        coins: newCoins,
      },
    });

    return res.status(200).json({
      success: true,
      data: {
        message: 'Challenge completed successfully',
        xpEarned: challenge.xpReward,
        coinsEarned: challenge.coinReward,
        totalXP: newXP,
        level: newLevel,
      },
    });
  } catch (error) {
    return next(error);
  }
}

export async function getProgress(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return next(new HttpError('Unauthorized', 401));
    }

    const progressList = await prisma.progress.findMany({
      where: { userId },
    });

    const result: Record<string, { completed: boolean; accuracy?: number }> = {};
    progressList.forEach((p) => {
      result[p.lessonId] = {
        completed: p.completed,
        accuracy: p.accuracy ?? undefined,
      };
    });

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    return next(error);
  }
}

