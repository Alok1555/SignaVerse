// SIGNAVERSE — Lesson Player Page
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation } from '@tanstack/react-query';
import { ArrowLeft, ArrowRight, CheckCircle, Hand, Zap, X } from 'lucide-react';
import { worldApi } from '../../services/api/worldApi';
import { practiceApi } from '../../services/api/practiceApi';
import { useGamification } from '../../hooks/useGamification';
import { slideInRight, scaleIn } from '../../utils/motion';
import type { Sign } from '../../types/world';

function SignIllustration({ sign }: { sign: Sign }) {
  return (
    <div className="flex flex-col items-center gap-4">
      <motion.div
        className="relative w-48 h-48 rounded-full flex items-center justify-center"
        style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.15), rgba(167,139,250,0.1))' }}
        animate={{ boxShadow: ['0 0 30px rgba(124,58,237,0.2)', '0 0 50px rgba(124,58,237,0.35)', '0 0 30px rgba(124,58,237,0.2)'] }}
        transition={{ duration: 2.5, repeat: Infinity }}
      >
        <motion.div className="text-8xl select-none"
          animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.05, 1] }}
          transition={{ duration: 3, repeat: Infinity }}
        >🤟</motion.div>
        {[1, 2].map((i) => (
          <motion.div key={i} className="absolute inset-0 rounded-full border border-primary-light/30"
            animate={{ scale: [1, 1.3, 1.6], opacity: [0.5, 0.2, 0] }}
            transition={{ duration: 2, repeat: Infinity, delay: i * 0.7 }}
          />
        ))}
      </motion.div>
      <div className="text-center">
        <h2 className="font-display font-900 text-4xl text-gradient-primary">{sign.word}</h2>
        <p className="text-muted text-sm mt-2 max-w-xs leading-relaxed">{sign.description}</p>
      </div>
    </div>
  );
}

export function LessonPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { submitResult } = useGamification();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [learned, setLearned] = useState<Set<string>>(new Set());
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isComplete, setIsComplete] = useState(false);

  const { data: lesson, isLoading } = useQuery({
    queryKey: ['lesson', id],
    queryFn: () => worldApi.getLesson(id!),
    enabled: !!id,
  });

  const startMutation = useMutation({
    mutationFn: practiceApi.startSession,
    onSuccess: (data) => setSessionId(data.sessionId),
  });

  const signs: Sign[] = lesson?.signs ?? [];
  const currentSign = signs[currentIndex];

  if (!sessionId && lesson && !startMutation.isPending && !startMutation.isSuccess) {
    startMutation.mutate(lesson.id);
  }

  async function handleNext() {
    if (currentSign) setLearned((p) => new Set([...p, currentSign.id]));
    if (currentIndex < signs.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setIsComplete(true);
      if (sessionId && currentSign) {
        try { await submitResult({ sessionId, signId: currentSign.id, confidence: 0.88, correct: true }); }
        catch (_) {}
      }
    }
  }

  if (isLoading) return <div className="min-h-screen flex items-center justify-center"><div className="skeleton h-64 w-full max-w-lg mx-6 rounded-3xl" /></div>;
  if (!lesson) return null;

  if (isComplete) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="card-elevated p-8 text-center max-w-sm w-full">
          <div className="text-7xl mb-4">🎉</div>
          <h2 className="font-display font-900 text-display-md text-gradient-primary mb-2">Lesson Complete!</h2>
          <p className="text-muted text-sm mb-6">You learned <span className="text-text font-700">{signs.length} signs</span>.</p>
          <div className="flex items-center justify-center gap-6 mb-8">
            <div className="text-center"><p className="font-display font-900 text-2xl text-gradient-accent">+{lesson.xpReward}</p><p className="text-xs text-muted">XP Earned</p></div>
            <div className="text-center"><p className="font-display font-900 text-2xl text-accent">+{lesson.coinReward}</p><p className="text-xs text-muted">Coins</p></div>
          </div>
          <div className="flex flex-col gap-3">
            <button onClick={() => navigate('/app/practice')} className="btn-accent py-3">Practice Signs</button>
            <button onClick={() => navigate(-1)} className="btn-ghost py-3">Back to World</button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="px-6 pt-6 pb-4 flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors" aria-label="Close lesson"><X size={18} className="text-muted" /></button>
        <div className="flex-1">
          <p className="text-muted text-xs font-display font-700 mb-1">{lesson.title}</p>
          <div className="flex gap-1">
            {signs.map((s, i) => (
              <div key={i} className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.1)' }}>
                <motion.div className="h-full rounded-full" animate={{ scaleX: learned.has(s.id) || i === currentIndex ? 1 : 0 }} style={{ originX: 0, background: learned.has(s.id) ? '#10B981' : '#A78BFA' }} transition={{ duration: 0.3 }} />
              </div>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-1 text-secondary"><Zap size={14} /><span className="text-xs font-display font-700">+{lesson.xpReward}</span></div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6 py-8">
        <AnimatePresence mode="wait">
          <motion.div key={currentIndex} variants={slideInRight} initial="hidden" animate="visible" exit="exit" className="w-full max-w-lg">
            <div className="card-elevated p-8 flex flex-col items-center gap-6">
              <div className="badge badge-primary text-xs">Sign {currentIndex + 1} of {signs.length}</div>
              {currentSign && <SignIllustration sign={currentSign} />}
              <div className="w-full rounded-2xl p-4" style={{ background: 'rgba(167,139,250,0.06)', border: '1px solid rgba(167,139,250,0.12)' }}>
                <div className="flex items-center gap-2 mb-1"><Hand size={14} className="text-secondary" /><span className="text-secondary text-xs font-display font-700">HOW TO SIGN</span></div>
                <p className="text-muted text-sm leading-relaxed">{currentSign?.description}</p>
              </div>
              {learned.has(currentSign?.id ?? '') && (
                <motion.div variants={scaleIn} initial="hidden" animate="visible" className="flex items-center gap-2 text-success text-sm font-display font-700"><CheckCircle size={18} />Got it!</motion.div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="px-6 pb-8 lg:pb-6 flex gap-3">
        <button onClick={() => setCurrentIndex(i => i - 1)} disabled={currentIndex === 0} className="btn-ghost py-3.5 px-5 disabled:opacity-30" aria-label="Previous"><ArrowLeft size={18} /></button>
        <button onClick={handleNext} className="btn-primary flex-1 py-3.5" id="lesson-next-btn">
          {currentIndex === signs.length - 1 ? (<><CheckCircle size={18} />Complete Lesson</>) : (<>Next Sign<ArrowRight size={18} /></>)}
        </button>
      </div>
    </div>
  );
}
