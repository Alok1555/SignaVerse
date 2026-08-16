// ============================================================
// SIGNAVERSE — Frontend Type Definitions
// ============================================================

export type Role = 'STUDENT' | 'TEACHER' | 'ADMIN';

export interface User {
  id: string;
  email: string;
  role: Role;
  profile: Profile;
}

export interface Profile {
  id: string;
  userId: string;
  displayName: string;
  avatarUrl?: string;
  xp: number;
  level: number;
  coins: number;
  streak: number;
  lastActiveAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  displayName: string;
  role?: Role;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
}
