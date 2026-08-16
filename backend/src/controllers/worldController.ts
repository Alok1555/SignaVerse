import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/database';
import { HttpError } from '../middleware/errorHandler';

export async function getWorlds(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return next(new HttpError('Unauthorized', 401));
    }

    // Get current user XP
    const profile = await prisma.profile.findUnique({
      where: { userId },
    });
    const userXP = profile?.xp ?? 0;

    // Get all worlds
    const worlds = await prisma.world.findMany({
      orderBy: { order: 'asc' },
      include: {
        lessons: {
          select: {
            id: true,
          },
        },
      },
    });

    // Get all completed progress for user
    const completedProgress = await prisma.progress.findMany({
      where: {
        userId,
        completed: true,
      },
      select: {
        lessonId: true,
      },
    });
    const completedLessonIds = new Set(completedProgress.map((p) => p.lessonId));

    // Construct response with progress calculations
    const worldsWithProgress = worlds.map((world) => {
      const totalLessons = world.lessons.length;
      const completedLessons = world.lessons.filter((l) => completedLessonIds.has(l.id)).length;
      const percentComplete = totalLessons > 0 ? completedLessons / totalLessons : 0;
      const isUnlocked = userXP >= world.unlocksAtXP;

      return {
        id: world.id,
        slug: world.slug,
        name: world.name,
        description: world.description,
        emoji: world.emoji,
        order: world.order,
        colorTheme: world.colorTheme,
        unlocksAtXP: world.unlocksAtXP,
        userProgress: {
          isUnlocked,
          completedLessons,
          totalLessons,
          percentComplete,
        },
      };
    });

    return res.status(200).json({
      success: true,
      data: worldsWithProgress,
    });
  } catch (error) {
    return next(error);
  }
}

export async function getWorld(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return next(new HttpError('Unauthorized', 401));
    }

    const world = await prisma.world.findUnique({
      where: { id },
      include: {
        lessons: {
          orderBy: { order: 'asc' },
          include: {
            signs: {
              orderBy: { order: 'asc' },
            },
            progress: {
              where: { userId },
            },
          },
        },
      },
    });

    if (!world) {
      return next(new HttpError('World not found', 404));
    }

    // Get user XP
    const profile = await prisma.profile.findUnique({
      where: { userId },
    });
    const userXP = profile?.xp ?? 0;

    const totalLessons = world.lessons.length;
    const completedLessons = world.lessons.filter(
      (l) => l.progress.length > 0 && l.progress[0].completed
    ).length;
    const percentComplete = totalLessons > 0 ? completedLessons / totalLessons : 0;
    const isUnlocked = userXP >= world.unlocksAtXP;

    const lessonsWithProgress = world.lessons.map((lesson) => {
      const userProg = lesson.progress[0];
      return {
        id: lesson.id,
        title: lesson.title,
        description: lesson.description,
        order: lesson.order,
        xpReward: lesson.xpReward,
        coinReward: lesson.coinReward,
        signs: lesson.signs,
        userProgress: userProg
          ? {
              completed: userProg.completed,
              accuracy: userProg.accuracy,
              completedAt: userProg.completedAt,
            }
          : null,
      };
    });

    return res.status(200).json({
      success: true,
      data: {
        id: world.id,
        slug: world.slug,
        name: world.name,
        description: world.description,
        emoji: world.emoji,
        order: world.order,
        colorTheme: world.colorTheme,
        unlocksAtXP: world.unlocksAtXP,
        lessons: lessonsWithProgress,
        userProgress: {
          isUnlocked,
          completedLessons,
          totalLessons,
          percentComplete,
        },
      },
    });
  } catch (error) {
    return next(error);
  }
}

export async function getLesson(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return next(new HttpError('Unauthorized', 401));
    }

    const lesson = await prisma.lesson.findUnique({
      where: { id },
      include: {
        signs: {
          orderBy: { order: 'asc' },
        },
        progress: {
          where: { userId },
        },
      },
    });

    if (!lesson) {
      return next(new HttpError('Lesson not found', 404));
    }

    const userProg = lesson.progress[0];

    return res.status(200).json({
      success: true,
      data: {
        id: lesson.id,
        worldId: lesson.worldId,
        title: lesson.title,
        description: lesson.description,
        order: lesson.order,
        xpReward: lesson.xpReward,
        coinReward: lesson.coinReward,
        signs: lesson.signs,
        userProgress: userProg
          ? {
              completed: userProg.completed,
              accuracy: userProg.accuracy,
              completedAt: userProg.completedAt,
            }
          : null,
      },
    });
  } catch (error) {
    return next(error);
  }
}
