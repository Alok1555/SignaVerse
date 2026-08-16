// ============================================================
// SIGNAVERSE — Zustand UI Store
// ============================================================

import { create } from 'zustand';

interface Toast {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message?: string;
}

interface UIStore {
  toasts: Toast[];
  isSideNavOpen: boolean;
  celebrationData: {
    xpEarned: number;
    levelUp: boolean;
    newLevel: number;
    newAchievements: string[];
  } | null;

  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
  toggleSideNav: () => void;
  showCelebration: (data: UIStore['celebrationData']) => void;
  hideCelebration: () => void;
}

export const useUIStore = create<UIStore>((set) => ({
  toasts: [],
  isSideNavOpen: false,
  celebrationData: null,

  addToast: (toast) =>
    set((state) => ({
      toasts: [
        ...state.toasts,
        { ...toast, id: Math.random().toString(36).slice(2) },
      ],
    })),

  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),

  toggleSideNav: () =>
    set((state) => ({ isSideNavOpen: !state.isSideNavOpen })),

  showCelebration: (data) => set({ celebrationData: data }),
  hideCelebration: () => set({ celebrationData: null }),
}));
