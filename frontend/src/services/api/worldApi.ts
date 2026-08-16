// ============================================================
// SIGNAVERSE — World API Service
// ============================================================

import apiClient from './client';
import type { World, Lesson } from '../../types/world';
import type { ApiResponse } from '../../types/api';

export const worldApi = {
  getWorlds: async (): Promise<World[]> => {
    const { data } = await apiClient.get<ApiResponse<World[]>>('/worlds');
    return data.data;
  },

  getWorld: async (id: string): Promise<World> => {
    const { data } = await apiClient.get<ApiResponse<World>>(`/worlds/${id}`);
    return data.data;
  },

  getLesson: async (id: string): Promise<Lesson> => {
    const { data } = await apiClient.get<ApiResponse<Lesson>>(`/worlds/lessons/${id}`);
    return data.data;
  },

  getLessons: async (): Promise<Lesson[]> => {
    const { data } = await apiClient.get<ApiResponse<Lesson[]>>('/lessons');
    return data.data;
  },
};
