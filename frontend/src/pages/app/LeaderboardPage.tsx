// SIGNAVERSE — Leaderboard Page
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { Crown, Zap, Flame } from 'lucide-react';
import { gamificationApi } from '../../services/api/gamificationApi';
import { staggerContainer, fadeUp } from '../../utils/motion';

const RANK_COLORS = ['text-amber-400', 'text-slate-300', 'text-amber-600'];
const RANK_BG = ['bg-amber-500/15', 'bg-slate-400/15', 'bg-amber-700/15'];

export function LeaderboardPage() {
  const { data: entries, isLoading } = useQuery({ queryKey: ['leaderboard'], queryFn: gamificationApi.getLeaderboard });
  return (
    <div className="min-h-screen pb-24 lg:pb-8">
      <div className="px-6 pt-8 pb-6" style={{ background: 'linear-gradient(160deg, #1A0A3E 0%, #0F0A1E 100%)' }}>
        <h1 className="font-display font-900 text-display-md text-text">🏆 Leaderboard</h1>
        <p className="text-muted text-sm mt-1">Top signers this week</p>
      </div>
      <div className="px-6 py-6 max-w-2xl mx-auto">
        {isLoading ? (
          <div className="space-y-3">{[1,2,3,4,5].map(i=><div key={i} className="skeleton h-16"/>)}</div>
        ) : (
          <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-3">
            {entries?.map((entry, i) => (
              <motion.div key={entry.userId} variants={fadeUp}
                className={`flex items-center gap-4 p-4 rounded-2xl ${entry.isCurrentUser ? 'border-2 border-secondary/50' : 'card'}`}
                style={entry.isCurrentUser ? { background: 'rgba(124,58,237,0.1)' } : {}}>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-display font-900 text-lg flex-shrink-0 ${i < 3 ? RANK_BG[i] : 'bg-white/5'}`}>
                  {i < 3 ? <Crown size={20} className={RANK_COLORS[i]} /> : <span className="text-subtle text-sm">{entry.rank}</span>}
                </div>
                <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center text-white font-display font-900 flex-shrink-0">
                  {entry.displayName.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`font-display font-700 text-sm truncate ${entry.isCurrentUser ? 'text-secondary' : 'text-text'}`}>
                    {entry.displayName} {entry.isCurrentUser ? '(You)' : ''}
                  </p>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className="flex items-center gap-1 text-xs text-secondary"><Zap size={10}/>Lv {entry.level}</span>
                    <span className="flex items-center gap-1 text-xs text-orange-400"><Flame size={10}/>{entry.streak}d</span>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="font-display font-900 text-base text-gradient-primary">{entry.xp.toLocaleString()}</p>
                  <p className="text-subtle text-xs">XP</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
