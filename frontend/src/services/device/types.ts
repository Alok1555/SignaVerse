// ============================================================
// SIGNAVERSE — Device Service Types
// Future hardware: ESP32 + flex sensors + MPU6050 + IR
// ============================================================

export type DeviceConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'error';

export interface DeviceInfo {
  id: string;
  name: string;
  type: 'smart_glove' | 'camera';
  batteryLevel: number;    // 0-100
  firmwareVersion: string;
}

export interface SensorReading {
  flexValues: number[];     // [thumb, index, middle, ring, pinky] 0-1023
  imuData: {
    accelX: number; accelY: number; accelZ: number;
    gyroX: number; gyroY: number; gyroZ: number;
  };
  irValues: number[];       // Proximity sensors
  timestamp: number;
}

export interface DeviceService {
  connect(): Promise<DeviceInfo>;
  disconnect(): Promise<void>;
  getStatus(): DeviceConnectionStatus;
  streamSensorData(callback: (data: SensorReading) => void): () => void; // Returns unsubscribe fn
  getBatteryLevel(): Promise<number>;
}
