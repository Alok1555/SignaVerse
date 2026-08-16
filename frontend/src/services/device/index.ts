// ============================================================
// SIGNAVERSE — Device Service Public Interface
// Swap implementation here without touching any UI code
// ============================================================

import { mockDeviceService } from './mockDeviceService';
// Future: import { bluetoothDeviceService } from './bluetoothDeviceService';

export const deviceService = mockDeviceService;
export type { DeviceService, DeviceInfo, SensorReading, DeviceConnectionStatus } from './types';
