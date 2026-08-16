// SIGNAVERSE — Rewards Page
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { Trophy } from 'lucide-react';
import { gamificationApi } from '../../services/api/gamificationApi';
import { staggerContainer, fadeUp, scaleIn } from '../../utils/motion';

const REWARD_ICONS: Record<string, string> = { BADGE: '🏅', TITLE: '👑', AVATAR_ITEM: '🎭', COIN_PACK: '💰' };

export function RewardsPage() {
  const { data: rewards, isLoading } = useQuery({ queryKey: ['rewards'], queryFn: gamificationApi.getRewards });
  return (
    <div className="min-h-screen pb-24 lg:pb-8">
      <div className="px-6 pt-8 pb-6" style={{ background: 'linear-gradient(160deg, #1A0A3E 0%, #0F0A1E 100%)' }}>
        <h1 className="font-display font-900 text-display-md text-text">🎁 Rewards</h1>
        <p className="text-muted text-sm mt-1">Your earned rewards and collectibles</p>
      </div>
      <div className="px-6 py-6 max-w-2xl mx-auto">
        {isLoading ? (
          <div className="grid grid-cols-2 gap-4">{[1,2,3,4].map(i=><div key={i} className="skeleton h-36"/>)}</div>
        ) : rewards && rewards.length > 0 ? (
          <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="grid grid-cols-2 gap-4">
            {rewards.map((r) => (
              <motion.div key={r.id} variants={scaleIn} className="card p-5 text-center" style={{ borderColor: 'rgba(245,158,11,0.25)', background: 'rgba(245,158,11,0.04)' }}>
                <motion.div className="text-5xl mb-3" animate={{ rotate: [0, 5, -5, 0] }} transition={{ duration: 3, repeat: Infinity }}>{REWARD_ICONS[r.type] ?? '🎁'}</motion.div>
                <p className="font-display font-700 text-sm text-text">{r.name}</p>
                <p className="text-subtle text-xs mt-1 leading-relaxed">{r.description}</p>
                <div className="badge badge-accent text-xs mt-3">{r.type.replace('_', ' ')}</div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div variants={fadeUp} initial="hidden" animate="visible" className="card p-10 text-center">
            <Trophy size={48} className="text-subtle mx-auto mb-4" strokeWidth={1.5} />
            <p className="font-display font-700 text-text mb-1">No rewards yet</p>
            <p className="text-muted text-sm">Complete lessons and challenges to earn rewards</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
