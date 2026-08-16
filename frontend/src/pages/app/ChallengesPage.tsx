// SIGNAVERSE — Daily Challenges Page
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CheckCircle, Clock, Zap, Loader2 } from 'lucide-react';
import { gamificationApi } from '../../services/api/gamificationApi';
import { useUIStore } from '../../store/uiStore';
import { fadeUp } from '../../utils/motion';

export function ChallengesPage() {
  const qc = useQueryClient();
  const { addToast } = useUIStore();
  const { data: challenge, isLoading } = useQuery({ queryKey: ['challenge-today'], queryFn: gamificationApi.getTodayChallenge });
  const completeMutation = useMutation({
    mutationFn: gamificationApi.completeChallenge,
    onSuccess: (r) => {
      addToast({ type: 'success', title: `Challenge Complete! +${r.xpEarned} XP · +${r.coinsEarned} Coins` });
      qc.invalidateQueries({ queryKey: ['challenge-today'] });
    },
    onError: () => addToast({ type: 'error', title: 'Failed to complete challenge' }),
  });

  return (
    <div className="min-h-screen pb-24 lg:pb-8">
      <div className="px-6 pt-8 pb-6" style={{ background: 'linear-gradient(160deg, #1A0A3E 0%, #0F0A1E 100%)' }}>
        <h1 className="font-display font-900 text-display-md text-text">⚔️ Daily Challenge</h1>
        <p className="text-muted text-sm mt-1">A new challenge every day · Don't break your streak!</p>
      </div>

      <div className="px-6 py-6 max-w-lg mx-auto space-y-5">
        {isLoading ? (
          <div className="skeleton h-64 w-full rounded-3xl" />
        ) : challenge ? (
          <>
            <motion.div variants={fadeUp} initial="hidden" animate="visible"
              className="card-elevated p-8 text-center"
              style={challenge.isCompleted ? { borderColor: 'rgba(16,185,129,0.3)', background: 'rgba(16,185,129,0.04)' } : {}}>
              <div className="badge badge-aqua text-xs mb-4"><Clock size={12}/>Today's Challenge</div>
              <div className="text-8xl mb-4 select-none">🤙</div>
              <h2 className="font-display font-900 text-3xl text-gradient-primary mb-2">Sign: {challenge.sign.word}</h2>
              <p className="text-muted text-sm mb-6 leading-relaxed">{challenge.sign.description}</p>
              <div className="flex items-center justify-center gap-6 mb-8">
                <div className="text-center"><p className="font-display font-900 text-2xl text-gradient-accent">+{challenge.xpReward}</p><p className="text-xs text-muted">XP</p></div>
                <div className="text-center"><p className="font-display font-900 text-2xl text-accent">+{challenge.coinReward}</p><p className="text-xs text-muted">Coins</p></div>
              </div>
              {challenge.isCompleted ? (
                <div className="flex items-center justify-center gap-2 text-success font-display font-700"><CheckCircle size={20}/>Completed Today!</div>
              ) : (
                <button onClick={() => completeMutation.mutate()} disabled={completeMutation.isPending} className="btn-primary w-full py-4 text-base">
                  {completeMutation.isPending ? <><Loader2 size={18} className="animate-spin"/>Submitting...</> : <><Zap size={18}/>Complete Challenge</>}
                </button>
              )}
            </motion.div>
            <motion.div variants={fadeUp} initial="hidden" animate="visible" className="card p-4 text-center">
              <p className="text-muted text-sm">New challenge resets at midnight · <span className="text-text font-700">Don't miss it!</span></p>
            </motion.div>
          </>
        ) : (
          <motion.div variants={fadeUp} initial="hidden" animate="visible" className="card p-10 text-center">
            <p className="text-muted">No challenge available today</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
