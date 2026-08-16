// ============================================================
// SIGNAVERSE — World & Lesson Types
// ============================================================

export interface World {
  id: string;
  slug: string;
  name: string;
  description: string;
  emoji: string;
  order: number;
  colorTheme: string;
  unlocksAtXP: number;
  lessons: Lesson[];
  userProgress?: WorldProgress;
}

export interface WorldProgress {
  totalLessons: number;
  completedLessons: number;
  isUnlocked: boolean;
  percentComplete: number;
}

export interface Lesson {
  id: string;
  worldId: string;
  title: string;
  description: string;
  order: number;
  xpReward: number;
  coinReward: number;
  signs: Sign[];
  userProgress?: LessonProgress;
}

export interface LessonProgress {
  completed: boolean;
  accuracy?: number;
  completedAt?: string;
}

export interface Sign {
  id: string;
  lessonId: string;
  word: string;
  description: string;
  videoUrl?: string;
  imageUrl?: string;
  order: number;
}
