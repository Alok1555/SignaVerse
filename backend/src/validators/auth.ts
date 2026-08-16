import { z } from 'zod';

export const registerSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters long'),
    displayName: z.string().min(2, 'Display name must be at least 2 characters long'),
    role: z.enum(['STUDENT', 'TEACHER', 'ADMIN']).optional(),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
  }),
});

export const updateProfileSchema = z.object({
  body: z.object({
    displayName: z.string().min(2).optional(),
    avatarUrl: z.string().url().optional().nullable(),
  }),
});
