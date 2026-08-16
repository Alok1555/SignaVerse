// ============================================================
// SIGNAVERSE — AI Service Public Interface
// Swap implementation here without touching any UI code
// ============================================================

import { mockAIService } from './mockAIService';
// Future: import { realAIService } from './realAIService';

export const aiService = mockAIService;
export type { AIService, SensorData, GestureResult, SignAnimationData } from './types';
