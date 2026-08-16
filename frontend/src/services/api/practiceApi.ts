// ============================================================
// SIGNAVERSE — Practice API Service
// ============================================================

import apiClient from './client';
import type { PracticeResultPayload, PracticeResultResponse } from '../../types/gamification';
import type { ApiResponse } from '../../types/api';

interface StartSessionResponse {
  sessionId: string;
  lessonId: string;
  startedAt: string;
}

export const practiceApi = {
  startSession: async (lessonId: string): Promise<StartSessionResponse> => {
    const { data } = await apiClient.post<ApiResponse<StartSessionResponse>>(
      '/practice/start',
      { lessonId }
    );
    return data.data;
  },

  submitResult: async (
    payload: PracticeResultPayload
  ): Promise<PracticeResultResponse> => {
    const { data } = await apiClient.post<ApiResponse<PracticeResultResponse>>(
      '/practice/result',
      payload
    );
    return data.data;
  },
};
