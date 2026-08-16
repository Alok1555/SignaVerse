// ============================================================
// SIGNAVERSE — Zustand Device Store
// ============================================================

import { create } from 'zustand';

export type DeviceStatus = 'disconnected' | 'connecting' | 'connected' | 'error';

interface DeviceStore {
  status: DeviceStatus;
  deviceId: string | null;
  batteryLevel: number | null;
  lastSignalStrength: number | null;
  setStatus: (status: DeviceStatus) => void;
  setDeviceInfo: (id: string, battery: number) => void;
  updateSignal: (strength: number) => void;
  reset: () => void;
}

export const useDeviceStore = create<DeviceStore>((set) => ({
  status: 'disconnected',
  deviceId: null,
  batteryLevel: null,
  lastSignalStrength: null,

  setStatus: (status) => set({ status }),
  setDeviceInfo: (deviceId, batteryLevel) => set({ deviceId, batteryLevel }),
  updateSignal: (lastSignalStrength) => set({ lastSignalStrength }),
  reset: () =>
    set({
      status: 'disconnected',
      deviceId: null,
      batteryLevel: null,
      lastSignalStrength: null,
    }),
}));
