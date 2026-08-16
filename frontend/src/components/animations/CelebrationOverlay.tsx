// ============================================================
// SIGNAVERSE — Celebration Overlay (XP + Level Up)
// ============================================================

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Zap, TrendingUp } from 'lucide-react';
import { useUIStore } from '../../store/uiStore';

export function CelebrationOverlay() {
  const { celebrationData, hideCelebration } = useUIStore();

  useEffect(() => {
    if (celebrationData) {
      const timer = setTimeout(hideCelebration, 4000);
      return () => clearTimeout(timer);
    }
  }, [celebrationData, hideCelebration]);

  return (
    <AnimatePresence>
      {celebrationData && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9998] flex items-center justify-center"
          onClick={hideCelebration}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

          {/* Particles */}
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full"
              style={{
                background: ['#A78BFA', '#F59E0B', '#06B6D4', '#10B981', '#F87171'][i % 5],
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0, 1.5, 0],
                y: [0, -80 - Math.random() * 80],
                x: [(Math.random() - 0.5) * 120],
              }}
              transition={{
                duration: 1.5 + Math.random(),
                delay: Math.random() * 0.5,
                ease: 'easeOut',
              }}
            />
          ))}

          {/* Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5, rotate: -5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="relative z-10 card-elevated p-8 text-center max-w-sm mx-4"
            style={{ border: '2px solid rgba(245,158,11,0.5)' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Level Up banner */}
            {celebrationData.levelUp && (
              <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mb-4"
              >
                <div className="badge badge-accent text-base px-4 py-2 mb-2">
                  <TrendingUp size={16} />
                  LEVEL UP!
                </div>
                <p className="font-display font-900 text-4xl text-gradient-accent">
                  Level {celebrationData.newLevel}
                </p>
              </motion.div>
            )}

            {/* XP earned */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: 0.2, stiffness: 300 }}
              className="flex items-center justify-center gap-2 mb-4"
            >
              <div className="w-16 h-16 rounded-full bg-primary-light/20 flex items-center justify-center">
                <Zap size={32} className="text-secondary" />
              </div>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="font-display font-900 text-5xl text-gradient-primary mb-2"
            >
              +{celebrationData.xpEarned} XP
            </motion.p>

            {/* New achievements */}
            {celebrationData.newAchievements.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-4"
              >
                {celebrationData.newAchievements.map((name) => (
                  <div key={name} className="flex items-center justify-center gap-2 mt-2">
                    <Star size={14} className="text-accent" />
                    <span className="text-sm text-muted">Achievement: <span className="text-text font-display font-700">{name}</span></span>
                  </div>
                ))}
              </motion.div>
            )}

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="text-subtle text-xs mt-4"
            >
              Tap anywhere to continue
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
