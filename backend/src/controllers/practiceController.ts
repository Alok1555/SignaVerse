import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/database';
import { HttpError } from '../middleware/errorHandler';
import { getLevel } from '../utils/xp';

export async function startSession(req: Request, res: Response, next: NextFunction) {
  try {
    const { lessonId } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return next(new HttpError('Unauthorized', 401));
    }

    let targetLessonId = lessonId;

    if (!targetLessonId || targetLessonId === 'practice-free') {
      const firstLesson = await prisma.lesson.findFirst();
      if (!firstLesson) {
        return next(new HttpError('No lessons available in the database', 404));
      }
      targetLessonId = firstLesson.id;
    } else {
      const lessonExists = await prisma.lesson.findUnique({
        where: { id: targetLessonId },
      });
      if (!lessonExists) {
        return next(new HttpError('Lesson not found', 404));
      }
    }

    const session = await prisma.practiceSession.create({
      data: {
        userId,
        lessonId: targetLessonId,
      },
    });

    return res.status(201).json({
      success: true,
      data: {
        sessionId: session.id,
        lessonId: session.lessonId,
        startedAt: session.startedAt,
      },
    });
  } catch (error) {
    return next(error);
  }
}

export async function submitResult(req: Request, res: Response, next: NextFunction) {
  try {
    const { sessionId, signId, confidence, correct } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return next(new HttpError('Unauthorized', 401));
    }

    // Get session and profile
    const session = await prisma.practiceSession.findUnique({
      where: { id: sessionId },
      include: { lesson: true },
    });

    if (!session || session.userId !== userId) {
      return next(new HttpError('Invalid practice session', 404));
    }

    const profile = await prisma.profile.findUnique({
      where: { userId },
    });

    if (!profile) {
      return next(new HttpError('Profile not found', 404));
    }

    // Calculate base XP for sign practice
    let xpEarned = 0;
    let coinsEarned = 0;

    if (correct) {
      xpEarned += 15; // 15 XP for a correct sign
      coinsEarned += 2; // 2 coins
    }

    // Save result
    await prisma.practiceResult.create({
      data: {
        sessionId,
        signId,
        confidence,
        correct,
        xpEarned,
      },
    });

    // Check if lesson is completed (if correct and lesson session)
    let lessonCompleted = false;
    let lessonXPReward = 0;
    let lessonCoinReward = 0;

    if (correct && session.lessonId) {
      // Mark lesson progress
      const existingProgress = await prisma.progress.findUnique({
        where: {
          userId_lessonId: {
            userId,
            lessonId: session.lessonId,
          },
        },
      });

      if (!existingProgress || !existingProgress.completed) {
        lessonCompleted = true;
        lessonXPReward = session.lesson.xpReward;
        lessonCoinReward = session.lesson.coinReward;

        await prisma.progress.upsert({
          where: {
            userId_lessonId: {
              userId,
              lessonId: session.lessonId,
            },
          },
          update: {
            completed: true,
            accuracy: confidence * 100,
            completedAt: new Date(),
          },
          create: {
            userId,
            lessonId: session.lessonId,
            completed: true,
            accuracy: confidence * 100,
            completedAt: new Date(),
          },
        });
      }
    }

    // Add lesson completions to overall gains
    xpEarned += lessonXPReward;
    coinsEarned += lessonCoinReward;

    // Check achievements
    const newAchievements: { id: string; name: string }[] = [];

    // Query existing unlocked achievements
    const unlockedAchievements = await prisma.userAchievement.findMany({
      where: { userId },
      select: { achievementId: true },
    });
    const unlockedIds = new Set(unlockedAchievements.map((ua) => ua.achievementId));

    // Get all achievements
    const allAchievements = await prisma.achievement.findMany();

    for (const ach of allAchievements) {
      if (unlockedIds.has(ach.id)) continue;

      let meetsCondition = false;
      const cond = JSON.parse(ach.condition);

      if (cond.type === 'lesson_completed') {
        const completedCount = await prisma.progress.count({
          where: { userId, completed: true },
        });
        if (completedCount >= cond.count) meetsCondition = true;
      } else if (cond.type === 'streak') {
        if (profile.streak >= cond.count) meetsCondition = true;
      } else if (cond.type === 'confidence') {
        if (confidence >= cond.value) meetsCondition = true;
      }

      if (meetsCondition) {
        await prisma.userAchievement.create({
          data: {
            userId,
            achievementId: ach.id,
          },
        });
        xpEarned += ach.xpReward;
        newAchievements.push({ id: ach.id, name: ach.name });
      }
    }

    // Update user profile
    const oldXP = profile.xp;
    const newXP = oldXP + xpEarned;
    const oldLevel = profile.level;
    const newLevel = getLevel(newXP);
    const levelUp = newLevel > oldLevel;

    await prisma.profile.update({
      where: { userId },
      data: {
        xp: newXP,
        level: newLevel,
        coins: profile.coins + coinsEarned,
      },
    });

    return res.status(200).json({
      success: true,
      data: {
        xpEarned,
        totalXP: newXP,
        level: newLevel,
        levelUp,
        streak: profile.streak,
        newAchievements,
      },
    });
  } catch (error) {
    return next(error);
  }
}
