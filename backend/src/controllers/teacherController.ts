import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/database';
import { HttpError } from '../middleware/errorHandler';

/**
 * Get all students in the system with their profile and summarized progress
 */
export async function getStudents(req: Request, res: Response, next: NextFunction) {
  try {
    // Fetch all users with role 'STUDENT'
    const students = await prisma.user.findMany({
      where: {
        role: 'STUDENT',
      },
      select: {
        id: true,
        email: true,
        createdAt: true,
        profile: {
          select: {
            displayName: true,
            avatarUrl: true,
            xp: true,
            level: true,
            coins: true,
            streak: true,
            lastActiveAt: true,
          },
        },
        progress: {
          where: {
            completed: true,
          },
          select: {
            lessonId: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const formattedStudents = students.map((student) => {
      return {
        id: student.id,
        email: student.email,
        createdAt: student.createdAt,
        displayName: student.profile?.displayName || 'Unknown Student',
        avatarUrl: student.profile?.avatarUrl,
        xp: student.profile?.xp || 0,
        level: student.profile?.level || 1,
        coins: student.profile?.coins || 0,
        streak: student.profile?.streak || 0,
        lastActiveAt: student.profile?.lastActiveAt || student.createdAt,
        completedLessonsCount: student.progress.length,
      };
    });

    return res.status(200).json({
      success: true,
      data: formattedStudents,
    });
  } catch (error) {
    return next(error);
  }
}

/**
 * Get detailed progress of a specific student across all worlds and lessons
 */
export async function getStudentProgress(req: Request, res: Response, next: NextFunction) {
  try {
    const { id: studentId } = req.params;

    // Verify student exists
    const student = await prisma.user.findFirst({
      where: {
        id: studentId,
        role: 'STUDENT',
      },
      include: {
        profile: true,
      },
    });

    if (!student) {
      return next(new HttpError('Student not found or user is not a student', 404));
    }

    // Get all worlds with their lessons
    const worlds = await prisma.world.findMany({
      orderBy: { order: 'asc' },
      include: {
        lessons: {
          orderBy: { order: 'asc' },
          include: {
            progress: {
              where: { userId: studentId },
            },
          },
        },
      },
    });

    // Format worlds with this student's progress
    const worldsWithProgress = worlds.map((world) => {
      const totalLessons = world.lessons.length;
      const completedLessons = world.lessons.filter(
        (l) => l.progress.length > 0 && l.progress[0].completed
      ).length;
      const percentComplete = totalLessons > 0 ? completedLessons / totalLessons : 0;

      const lessonsWithProgress = world.lessons.map((lesson) => {
        const prog = lesson.progress[0];
        return {
          id: lesson.id,
          title: lesson.title,
          description: lesson.description,
          order: lesson.order,
          xpReward: lesson.xpReward,
          coinReward: lesson.coinReward,
          completed: prog?.completed || false,
          accuracy: prog?.accuracy || null,
          completedAt: prog?.completedAt || null,
        };
      });

      return {
        id: world.id,
        name: world.name,
        description: world.description,
        emoji: world.emoji,
        order: world.order,
        colorTheme: world.colorTheme,
        unlocksAtXP: world.unlocksAtXP,
        lessons: lessonsWithProgress,
        progress: {
          completedLessons,
          totalLessons,
          percentComplete,
        },
      };
    });

    return res.status(200).json({
      success: true,
      data: {
        student: {
          id: student.id,
          email: student.email,
          displayName: student.profile?.displayName || 'Unknown Student',
          xp: student.profile?.xp || 0,
          level: student.profile?.level || 1,
          streak: student.profile?.streak || 0,
        },
        worlds: worldsWithProgress,
      },
    });
  } catch (error) {
    return next(error);
  }
}
