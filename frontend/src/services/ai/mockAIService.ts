// ============================================================
// SIGNAVERSE — [MOCK] AI Service
// ⚠️  THIS IS A DETERMINISTIC MOCK — NOT REAL AI
// Replace this file's implementation when integrating real model
// ============================================================

import type { AIService, GestureResult, SensorData, SignAnimationData } from './types';

// Mock sign database for deterministic responses
const MOCK_SIGNS: Record<string, string> = {
  'sign-namaste': 'Namaste',
  'sign-thankyou': 'Thank You',
  'sign-water': 'Water',
  'sign-help': 'Help',
  'sign-good': 'Good',
  'sign-bad': 'Bad',
  'sign-yes': 'Yes',
  'sign-no': 'No',
  'sign-please': 'Please',
  'sign-sorry': 'Sorry',
};

const MOCK_DELAY_MS = 800; // Simulate processing time

function generateMockConfidence(_targetSignId: string, sensorData: SensorData): number {
  // Deterministic: use flex sensor sum + timestamp to produce ~80-97% confidence
  const flexSum = (sensorData.flexValues ?? [500, 480, 470, 460, 450]).reduce((a, b) => a + b, 0);
  const base = 0.80 + (flexSum % 100) / 600;
  return Math.min(Math.max(base + Math.sin(sensorData.timestamp / 1000) * 0.05, 0.75), 0.98);
}

export const mockAIService: AIService = {
  isAvailable: () => true, // Mock is always available

  recognizeGesture: async (sensorData: SensorData): Promise<GestureResult> => {
    await new Promise((r) => setTimeout(r, MOCK_DELAY_MS));

    const signIds = Object.keys(MOCK_SIGNS);
    // Deterministic selection based on sensor data hash
    const idx = Math.floor((sensorData.timestamp / 1000)) % signIds.length;
    const topSignId = signIds[idx];
    const confidence = generateMockConfidence(topSignId, sensorData);

    const alternatives = signIds
      .filter((id) => id !== topSignId)
      .slice(0, 2)
      .map((id, i) => ({
        signId: id,
        word: MOCK_SIGNS[id],
        confidence: Math.max(confidence - 0.15 - i * 0.08, 0.1),
      }));

    return {
      signId: topSignId,
      word: MOCK_SIGNS[topSignId],
      confidence,
      alternatives,
      processingTimeMs: MOCK_DELAY_MS,
    };
  },

  getSignAnimation: async (signId: string): Promise<SignAnimationData> => {
    await new Promise((r) => setTimeout(r, 200));
    return {
      signId,
      word: MOCK_SIGNS[signId] ?? 'Unknown',
      description: `Demonstration of the sign for "${MOCK_SIGNS[signId] ?? signId}"`,
      handPositions: [
        { time: 0, fingers: [0, 0, 0, 0, 0], wristRotation: [0, 0, 0] },
        { time: 0.3, fingers: [45, 80, 80, 80, 80], wristRotation: [15, 0, 0] },
        { time: 0.6, fingers: [90, 90, 45, 45, 45], wristRotation: [30, 15, 0] },
        { time: 1, fingers: [0, 0, 0, 0, 0], wristRotation: [0, 0, 0] },
      ],
      duration: 1500,
    };
  },
};
