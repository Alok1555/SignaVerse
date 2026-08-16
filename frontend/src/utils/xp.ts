// ============================================================
// SIGNAVERSE — XP / Level Utilities
// ============================================================

/**
 * XP thresholds: Level = floor(sqrt(xp / 100)) + 1
 * Level 1: 0 XP, Level 2: 100 XP, Level 3: 400 XP, Level 4: 900 XP...
 */
export function getLevel(xp: number): number {
  return Math.floor(Math.sqrt(xp / 100)) + 1;
}

export function getXPForLevel(level: number): number {
  return Math.pow(level - 1, 2) * 100;
}

export function getXPForNextLevel(level: number): number {
  return Math.pow(level, 2) * 100;
}

export function getXPProgress(xp: number): {
  level: number;
  currentXP: number;
  xpForCurrentLevel: number;
  xpForNextLevel: number;
  progress: number;
} {
  const level = getLevel(xp);
  const xpForCurrentLevel = getXPForLevel(level);
  const xpForNextLevel = getXPForNextLevel(level);
  const range = xpForNextLevel - xpForCurrentLevel;
  const earned = xp - xpForCurrentLevel;
  const progress = range > 0 ? Math.min(earned / range, 1) : 1;

  return { level, currentXP: xp, xpForCurrentLevel, xpForNextLevel, progress };
}

export function formatXP(xp: number): string {
  if (xp >= 1000) return `${(xp / 1000).toFixed(1)}k`;
  return xp.toString();
}
