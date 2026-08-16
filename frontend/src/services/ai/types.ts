// ============================================================
// SIGNAVERSE — AI Service Types
// ============================================================

export interface SensorData {
  flexValues?: number[];      // Flex sensor readings [0-1023] per finger
  imuData?: {                 // MPU6050
    accelX: number;
    accelY: number;
    accelZ: number;
    gyroX: number;
    gyroY: number;
    gyroZ: number;
  };
  irValues?: number[];        // IR sensor proximity readings
  timestamp: number;
}

export interface GestureResult {
  signId: string;
  word: string;
  confidence: number;         // 0-1
  alternatives: Array<{
    signId: string;
    word: string;
    confidence: number;
  }>;
  processingTimeMs: number;
}

export interface SignAnimationData {
  signId: string;
  word: string;
  description: string;
  handPositions: HandKeyframe[];  // Future: 3D hand positions
  duration: number;               // ms
}

export interface HandKeyframe {
  time: number;               // 0-1 normalized
  fingers: number[];          // Bend angles per finger [0-90]
  wristRotation: number[];    // [x, y, z] degrees
}

export interface AIService {
  recognizeGesture(sensorData: SensorData): Promise<GestureResult>;
  getSignAnimation(signId: string): Promise<SignAnimationData>;
  isAvailable(): boolean;
}
