// ============================================================
// SIGNAVERSE — [MOCK] Device Service
// ⚠️  THIS IS A MOCK — NOT REAL HARDWARE
// Replace with Web Bluetooth API + ESP32 BLE implementation
// ============================================================

import type { DeviceService, DeviceConnectionStatus, DeviceInfo, SensorReading } from './types';
import { useDeviceStore } from '../../store/deviceStore';

let _status: DeviceConnectionStatus = 'disconnected';
let _streamInterval: ReturnType<typeof setInterval> | null = null;

function generateMockReading(): SensorReading {
  const t = Date.now();
  const wave = Math.sin(t / 500);
  return {
    flexValues: [
      400 + Math.round(wave * 200),
      500 + Math.round(Math.sin(t / 400) * 150),
      480 + Math.round(Math.sin(t / 350) * 170),
      460 + Math.round(Math.sin(t / 300) * 160),
      440 + Math.round(Math.sin(t / 250) * 130),
    ],
    imuData: {
      accelX: wave * 0.5,
      accelY: Math.cos(t / 700) * 0.3,
      accelZ: 9.8 + wave * 0.1,
      gyroX: Math.sin(t / 600) * 10,
      gyroY: Math.cos(t / 550) * 8,
      gyroZ: Math.sin(t / 450) * 5,
    },
    irValues: [
      200 + Math.round(Math.random() * 100),
      190 + Math.round(Math.random() * 100),
    ],
    timestamp: t,
  };
}

export const mockDeviceService: DeviceService = {
  getStatus: () => _status,

  connect: async (): Promise<DeviceInfo> => {
    _status = 'connecting';
    useDeviceStore.getState().setStatus('connecting');
    // Simulate BLE discovery time
    await new Promise((r) => setTimeout(r, 1800));
    _status = 'connected';
    const info: DeviceInfo = {
      id: 'SGLOV-MOCK-001',
      name: 'SignaVerse Glove v1',
      type: 'smart_glove',
      batteryLevel: 87,
      firmwareVersion: '0.1.0-mock',
    };
    useDeviceStore.getState().setStatus('connected');
    useDeviceStore.getState().setDeviceInfo(info.id, info.batteryLevel);
    return info;
  },

  disconnect: async (): Promise<void> => {
    if (_streamInterval) {
      clearInterval(_streamInterval);
      _streamInterval = null;
    }
    _status = 'disconnected';
    useDeviceStore.getState().reset();
  },

  streamSensorData: (callback): () => void => {
    _streamInterval = setInterval(() => {
      const reading = generateMockReading();
      useDeviceStore.getState().updateSignal(85 + Math.round(Math.random() * 15));
      callback(reading);
    }, 100); // 10 Hz mock stream

    return () => {
      if (_streamInterval) clearInterval(_streamInterval);
    };
  },

  getBatteryLevel: async (): Promise<number> => {
    return 87; // Mock fixed value
  },
};
