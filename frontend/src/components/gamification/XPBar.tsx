// ============================================================
// SIGNAVERSE — XP Bar Component
// ============================================================

import { motion } from 'framer-motion';
import { getXPProgress } from '../../utils/xp';

interface XPBarProps {
  xp: number;
  size?: 'sm' | 'md' | 'lg';
  showLabels?: boolean;
}

export function XPBar({ xp, size = 'md', showLabels = true }: XPBarProps) {
  const { level, xpForCurrentLevel, xpForNextLevel, progress } = getXPProgress(xp);
  const heights = { sm: 'h-1.5', md: 'h-2', lg: 'h-3' };

  return (
    <div className="w-full">
      {showLabels && (
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs text-muted font-display font-700">
            Level {level}
          </span>
          <span className="text-xs text-subtle">
            {xp - xpForCurrentLevel} / {xpForNextLevel - xpForCurrentLevel} XP
          </span>
        </div>
      )}
      <div className={`xp-bar-track ${heights[size]}`}>
        <motion.div
          className="xp-bar-fill h-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress * 100}%` }}
          transition={{ duration: 1, ease: [0.34, 1.56, 0.64, 1], delay: 0.2 }}
        />
      </div>
    </div>
  );
}
