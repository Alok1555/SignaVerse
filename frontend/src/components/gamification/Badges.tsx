// ============================================================
// SIGNAVERSE — Gamification Badges
// ============================================================

import { Flame, Coins, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { formatNumber } from '../../utils/format';

interface StreakBadgeProps {
  streak: number;
  animated?: boolean;
}

export function StreakBadge({ streak, animated = false }: StreakBadgeProps) {
  return (
    <motion.div
      className="streak-badge gap-1.5"
      animate={animated ? { scale: [1, 1.15, 1] } : {}}
      transition={{ duration: 0.4 }}
    >
      <Flame size={14} />
      <span>{streak} day{streak !== 1 ? 's' : ''}</span>
    </motion.div>
  );
}

interface CoinBadgeProps {
  coins: number;
  animated?: boolean;
}

export function CoinBadge({ coins, animated = false }: CoinBadgeProps) {
  return (
    <motion.div
      className="coin-badge gap-1.5"
      animate={animated ? { scale: [1, 1.2, 1] } : {}}
      transition={{ duration: 0.4 }}
    >
      <Coins size={14} />
      <span>{formatNumber(coins)}</span>
    </motion.div>
  );
}

interface LevelBadgeProps {
  level: number;
}

export function LevelBadge({ level }: LevelBadgeProps) {
  return (
    <div className="flex items-center gap-1.5 badge badge-primary">
      <Zap size={13} />
      <span>Lvl {level}</span>
    </div>
  );
}
