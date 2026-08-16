import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { HttpError } from './errorHandler';

interface JwtPayload {
  userId: string;
  email: string;
  role: string;
}

export function authenticate(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new HttpError('Authentication token missing or invalid', 401));
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload;
    req.user = {
      id: decoded.userId,
      email: decoded.email,
      role: decoded.role,
    };
    return next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return next(new HttpError('Authentication token expired', 401));
    }
    return next(new HttpError('Invalid authentication token', 401));
  }
}

export function authorize(roles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new HttpError('Authentication required', 401));
    }

    if (!roles.includes(req.user.role)) {
      return next(new HttpError('Forbidden: Access denied', 403));
    }

    return next();
  };
}
