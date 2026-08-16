// ============================================================
// SIGNAVERSE — World Map Page
// ============================================================

import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Lock, ChevronRight, Star } from 'lucide-react';
import { worldApi } from '../../services/api/worldApi';
import { useAuthStore } from '../../store/authStore';
import { fadeUp, staggerContainer } from '../../utils/motion';
import type { World } from '../../types/world';

const WORLD_COLORS: Record<number, { from: string; to: string; glow: string }> = {
  0: { from: '#065F46', to: '#10B981', glow: 'rgba(16,185,129,0.4)' },
  1: { from: '#1E3A5F', to: '#3B82F6', glow: 'rgba(59,130,246,0.4)' },
  2: { from: '#713F12', to: '#F59E0B', glow: 'rgba(245,158,11,0.4)' },
  3: { from: '#4C1D95', to: '#8B5CF6', glow: 'rgba(139,92,246,0.4)' },
  4: { from: '#7F1D1D', to: '#EF4444', glow: 'rgba(239,68,68,0.4)' },
  5: { from: '#164E63', to: '#06B6D4', glow: 'rgba(6,182,212,0.4)' },
};

function WorldCard({ world, index }: { world: World; index: number }) {
  const navigate = useNavigate();
  const colors = WORLD_COLORS[index % 6];
  const isUnlocked = world.userProgress?.isUnlocked ?? (index === 0);
  const progress = world.userProgress?.percentComplete ?? 0;
  const completedLessons = world.userProgress?.completedLessons ?? 0;
  const totalLessons = world.userProgress?.totalLessons ?? world.lessons?.length ?? 0;

  return (
    <motion.div
      variants={fadeUp}
      className="relative"
    >
      {/* Path connector (not for first) */}
      {index > 0 && (
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-0.5 h-6"
          style={{ background: isUnlocked ? `linear-gradient(180deg, ${colors.from}, transparent)` : 'rgba(167,139,250,0.1)' }}
        />
      )}

      <motion.button
        onClick={() => isUnlocked && navigate(`/app/worlds/${world.id}`)}
        className={`w-full card p-6 text-left transition-all duration-300 ${isUnlocked ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'}`}
        style={isUnlocked ? {
          background: `linear-gradient(135deg, ${colors.from}22 0%, ${colors.to}11 100%)`,
          borderColor: `${colors.to}30`,
        } : {}}
        whileHover={isUnlocked ? { scale: 1.02, y: -2 } : {}}
        whileTap={isUnlocked ? { scale: 0.98 } : {}}
        aria-label={`${world.name} - ${isUnlocked ? 'Play' : 'Locked'}`}
      >
        <div className="flex items-center gap-5">
          {/* World icon */}
          <motion.div
            className="relative w-16 h-16 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0"
            style={{
              background: isUnlocked
                ? `linear-gradient(135deg, ${colors.from}, ${colors.to})`
                : 'rgba(255,255,255,0.05)',
              boxShadow: isUnlocked ? `0 4px 20px ${colors.glow}` : 'none',
            }}
            animate={isUnlocked ? { boxShadow: [`0 4px 20px ${colors.glow}`, `0 8px 30px ${colors.glow}`, `0 4px 20px ${colors.glow}`] } : {}}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          >
            {isUnlocked ? world.emoji : <Lock size={20} className="text-subtle" />}
          </motion.div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h2 className="font-display font-800 text-lg text-text truncate">{world.name}</h2>
              {progress === 1 && <Star size={14} className="text-accent flex-shrink-0" fill="currentColor" />}
            </div>
            <p className="text-muted text-sm leading-relaxed mb-3 line-clamp-2">{world.description}</p>

            {isUnlocked ? (
              <div className="flex items-center gap-3">
                <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.1)' }}>
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: `linear-gradient(90deg, ${colors.from}, ${colors.to})` }}
                    initial={{ width: 0 }}
                    animate={{ width: `${progress * 100}%` }}
                    transition={{ duration: 1, delay: index * 0.1 + 0.3 }}
                  />
                </div>
                <span className="text-xs text-subtle font-display font-700 flex-shrink-0">
                  {completedLessons}/{totalLessons}
                </span>
              </div>
            ) : (
              <p className="text-subtle text-xs">🔒 Unlock at {world.unlocksAtXP} XP</p>
            )}
          </div>

          {isUnlocked && <ChevronRight size={20} className="text-subtle flex-shrink-0" />}
        </div>

        {/* Lessons preview */}
        {isUnlocked && totalLessons > 0 && (
          <div className="flex gap-1.5 mt-4">
            {Array.from({ length: totalLessons }).map((_, i) => (
              <motion.div
                key={i}
                className="h-1.5 flex-1 rounded-full"
                style={{
                  background: i < completedLessons
                    ? `linear-gradient(90deg, ${colors.from}, ${colors.to})`
                    : 'rgba(255,255,255,0.1)',
                }}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: index * 0.1 + i * 0.05 + 0.5 }}
              />
            ))}
          </div>
        )}
      </motion.button>
    </motion.div>
  );
}

export function WorldsPage() {
  const { data: worlds, isLoading } = useQuery({
    queryKey: ['worlds'],
    queryFn: worldApi.getWorlds,
  });

  const user = useAuthStore((s) => s.user);
  const totalXP = user?.profile.xp ?? 0;

  if (isLoading) {
    return (
      <div className="min-h-screen px-6 pt-8 pb-24 lg:pb-8 max-w-2xl mx-auto">
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="skeleton h-36 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24 lg:pb-8">
      {/* Header */}
      <div
        className="px-6 pt-8 pb-8 relative overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #1A0A3E 0%, #0F0A1E 100%)' }}
      >
        <div className="absolute top-0 right-0 w-48 h-48 rounded-full opacity-20 blur-3xl bg-aqua pointer-events-none" />
        <div className="relative max-w-2xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-muted text-sm font-display font-700 mb-1">Your Learning Journey</p>
            <h1 className="font-display font-900 text-display-md text-text">
              🗺️ World Map
            </h1>
            <p className="text-muted text-sm mt-2">
              You have <span className="text-accent font-700">{totalXP.toLocaleString()} XP</span> · Explore unlocked worlds
            </p>
          </motion.div>
        </div>
      </div>

      {/* World list */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="px-6 py-6 max-w-2xl mx-auto space-y-8"
      >
        {worlds?.map((world, index) => (
          <WorldCard key={world.id} world={world} index={index} />
        ))}

        {/* Coming soon */}
        <motion.div variants={fadeUp} className="card p-6 text-center opacity-40">
          <div className="text-4xl mb-2">🔮</div>
          <p className="font-display font-700 text-muted text-sm">More worlds coming soon...</p>
        </motion.div>
      </motion.div>
    </div>
  );
}
