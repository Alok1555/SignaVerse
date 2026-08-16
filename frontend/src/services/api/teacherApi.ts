// ============================================================
// SIGNAVERSE — Teacher API Service
// ============================================================

import apiClient from './client';
import type { ApiResponse } from '../../types/api';

export interface StudentSummary {
  id: string;
  email: string;
  createdAt: string;
  displayName: string;
  avatarUrl: string | null;
  xp: number;
  level: number;
  coins: number;
  streak: number;
  lastActiveAt: string;
  completedLessonsCount: number;
}

export interface StudentProgressDetail {
  student: {
    id: string;
    email: string;
    displayName: string;
    xp: number;
    level: number;
    streak: number;
  };
  worlds: Array<{
    id: string;
    name: string;
    description: string;
    emoji: string;
    order: number;
    colorTheme: string;
    unlocksAtXP: number;
    lessons: Array<{
      id: string;
      title: string;
      description: string;
      order: number;
      xpReward: number;
      coinReward: number;
      completed: boolean;
      accuracy: number | null;
      completedAt: string | null;
    }>;
    progress: {
      completedLessons: number;
      totalLessons: number;
      percentComplete: number;
    };
  }>;
}

export const teacherApi = {
  getStudents: async (): Promise<StudentSummary[]> => {
    const { data } = await apiClient.get<ApiResponse<StudentSummary[]>>('/teacher/students');
    return data.data;
  },

  getStudentProgress: async (studentId: string): Promise<StudentProgressDetail> => {
    const { data } = await apiClient.get<ApiResponse<StudentProgressDetail>>(
      `/teacher/students/${studentId}/progress`
    );
    return data.data;
  },
};
