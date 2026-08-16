import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/database';
import { env } from '../config/env';
import { HttpError } from '../middleware/errorHandler';

// Helper to sign access and refresh tokens
function generateTokens(user: { id: string; email: string; role: string }) {
  const accessToken = jwt.sign(
    { userId: user.id, email: user.email, role: user.role },
    env.JWT_SECRET,
    { expiresIn: env.JWT_EXPIRES_IN as any }
  );

  const refreshToken = jwt.sign(
    { userId: user.id, email: user.email, role: user.role },
    env.JWT_REFRESH_SECRET,
    { expiresIn: env.JWT_REFRESH_EXPIRES_IN as any }
  );

  return { accessToken, refreshToken };
}


// Helper to set httpOnly cookie for refresh token
function setRefreshCookie(res: Response, token: string) {
  res.cookie('refreshToken', token, {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: env.NODE_ENV === 'production' ? 'none' : 'lax', // For cross-origin cookie sharing in dev
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
}

// Helper to parse cookies manually from raw header
function getCookieByName(cookieHeader: string | undefined, name: string): string | null {
  if (!cookieHeader) return null;
  const match = cookieHeader.match(new RegExp('(^| )' + name + '=([^;]+)'));
  if (match) return match[2];
  return null;
}

export async function register(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password, displayName, role } = req.body;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return next(new HttpError('Email already registered', 400));
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        role: role || 'STUDENT',
        profile: {
          create: {
            displayName,
            xp: 0,
            level: 1,
            coins: 0,
            streak: 1,
            lastActiveAt: new Date(),
          },
        },
      },
      include: {
        profile: true,
      },
    });

    const { accessToken, refreshToken } = generateTokens(user);
    setRefreshCookie(res, refreshToken);

    return res.status(201).json({
      success: true,
      data: {
        accessToken,
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          profile: user.profile,
        },
      },
    });
  } catch (error) {
    return next(error);
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
      include: { profile: true },
    });

    if (!user) {
      return next(new HttpError('Invalid email or password', 401));
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return next(new HttpError('Invalid email or password', 401));
    }

    const { accessToken, refreshToken } = generateTokens(user);
    setRefreshCookie(res, refreshToken);

    // Update streak or lastActiveAt if applicable
    if (user.profile) {
      const today = new Date().toDateString();
      const lastActive = new Date(user.profile.lastActiveAt).toDateString();

      let newStreak = user.profile.streak;
      if (today !== lastActive) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        if (lastActive === yesterday.toDateString()) {
          newStreak += 1;
        } else {
          newStreak = 1; // Reset streak if they missed a day
        }
      }

      await prisma.profile.update({
        where: { userId: user.id },
        data: {
          lastActiveAt: new Date(),
          streak: newStreak,
        },
      });

      // Fetch updated profile
      user.profile.streak = newStreak;
    }

    return res.status(200).json({
      success: true,
      data: {
        accessToken,
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          profile: user.profile,
        },
      },
    });
  } catch (error) {
    return next(error);
  }
}

export async function refresh(req: Request, res: Response, next: NextFunction) {
  try {
    const rawCookie = req.headers.cookie;
    const token = getCookieByName(rawCookie, 'refreshToken');

    if (!token) {
      return next(new HttpError('Refresh token missing', 401));
    }

    let decoded: any;
    try {
      decoded = jwt.verify(token, env.JWT_REFRESH_SECRET);
    } catch (_) {
      return next(new HttpError('Invalid or expired refresh token', 401));
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: { profile: true },
    });

    if (!user) {
      return next(new HttpError('User not found', 401));
    }

    const { accessToken, refreshToken } = generateTokens(user);
    setRefreshCookie(res, refreshToken);

    return res.status(200).json({
      success: true,
      data: {
        accessToken,
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          profile: user.profile,
        },
      },
    });
  } catch (error) {
    return next(error);
  }
}

export async function logout(req: Request, res: Response, next: NextFunction) {
  try {
    res.clearCookie('refreshToken');
    return res.status(200).json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error) {
    return next(error);
  }
}

export async function getMe(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      return next(new HttpError('Unauthorized', 401));
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: { profile: true },
    });

    if (!user) {
      return next(new HttpError('User not found', 404));
    }

    return res.status(200).json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        role: user.role,
        profile: user.profile,
      },
    });
  } catch (error) {
    return next(error);
  }
}
