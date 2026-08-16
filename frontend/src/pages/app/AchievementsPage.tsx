// SIGNAVERSE — Achievements Page
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { Lock, Star } from 'lucide-react';
import { gamificationApi } from '../../services/api/gamificationApi';
import { staggerContainer, fadeUp } from '../../utils/motion';

export function AchievementsPage() {
  const { data: achievements, isLoading } = useQuery({ queryKey: ['achievements'], queryFn: gamificationApi.getAchievements });
  return (
    <div className="min-h-screen pb-24 lg:pb-8">
      <div className="px-6 pt-8 pb-6" style={{ background: 'linear-gradient(160deg, #1A0A3E 0%, #0F0A1E 100%)' }}>
        <h1 className="font-display font-900 text-display-md text-text">🏅 Achievements</h1>
        <p className="text-muted text-sm mt-1">Unlock achievements as you progress</p>
      </div>
      <div className="px-6 py-6 max-w-2xl mx-auto">
        {isLoading ? (
          <div className="grid grid-cols-2 gap-4">{[1,2,3,4].map(i=><div key={i} className="skeleton h-36"/>)}</div>
        ) : (
          <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="grid grid-cols-2 gap-4">
            {achievements?.map((ach) => (
              <motion.div key={ach.id} variants={fadeUp}
                className={`card p-5 text-center ${ach.isUnlocked ? '' : 'opacity-50'}`}
                style={ach.isUnlocked ? { borderColor: 'rgba(245,158,11,0.3)', background: 'rgba(245,158,11,0.04)' } : {}}>
                <div className="text-4xl mb-3">{ach.isUnlocked ? '🏆' : '🔒'}</div>
                <p className="font-display font-700 text-sm text-text leading-tight">{ach.name}</p>
                <p className="text-subtle text-xs mt-1 leading-relaxed">{ach.description}</p>
                {ach.isUnlocked ? (
                  <div className="flex items-center justify-center gap-1 mt-2 text-accent text-xs"><Star size={11} fill="currentColor"/>+{ach.xpReward} XP</div>
                ) : (
                  <div className="flex items-center justify-center gap-1 mt-2 text-subtle text-xs"><Lock size={11}/>Locked</div>
                )}
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
