// ============================================================
// SIGNAVERSE — World Detail + Lesson List Page
// ============================================================

import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, CheckCircle, Lock, PlayCircle, Star, Zap } from 'lucide-react';
import { worldApi } from '../../services/api/worldApi';
import { fadeUp, staggerContainer } from '../../utils/motion';
import type { Lesson } from '../../types/world';

function LessonItem({ lesson, index, worldColor }: { lesson: Lesson; index: number; worldColor: string }) {
  const navigate = useNavigate();
  const isCompleted = lesson.userProgress?.completed ?? false;
  const isLocked = false; // For now all lessons accessible once world is unlocked

  return (
    <motion.div variants={fadeUp}>
      <motion.button
        onClick={() => !isLocked && navigate(`/app/lessons/${lesson.id}`)}
        className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all duration-200 text-left ${
          isCompleted
            ? 'bg-success/5 border border-success/20'
            : isLocked
            ? 'opacity-50 cursor-not-allowed card'
            : 'card hover:border-secondary/30 hover:bg-primary-light/5'
        }`}
        whileHover={!isLocked ? { x: 4 } : {}}
        whileTap={!isLocked ? { scale: 0.98 } : {}}
        aria-label={`${lesson.title} - ${isCompleted ? 'Completed' : 'Start lesson'}`}
      >
        {/* Step number / status */}
        <div className="flex-shrink-0">
          {isCompleted ? (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, delay: index * 0.05 }}
              className="w-12 h-12 rounded-2xl bg-success/20 flex items-center justify-center"
            >
              <CheckCircle size={24} className="text-success" />
            </motion.div>
          ) : isLocked ? (
            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center">
              <Lock size={20} className="text-subtle" />
            </div>
          ) : (
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center font-display font-900 text-white text-lg"
              style={{ background: `linear-gradient(135deg, ${worldColor}88, ${worldColor})` }}
            >
              {index + 1}
            </div>
          )}
        </div>

        {/* Lesson info */}
        <div className="flex-1 min-w-0">
          <p className={`font-display font-700 text-base ${isCompleted ? 'text-success' : 'text-text'}`}>
            {lesson.title}
          </p>
          <p className="text-muted text-sm truncate mt-0.5">{lesson.description}</p>
          <div className="flex items-center gap-3 mt-2">
            <span className="flex items-center gap-1 text-xs text-secondary">
              <Zap size={11} />+{lesson.xpReward} XP
            </span>
            <span className="text-xs text-accent">+{lesson.coinReward} 🪙</span>
            <span className="text-xs text-subtle">{lesson.signs?.length ?? 0} signs</span>
            {lesson.userProgress?.accuracy && (
              <span className="flex items-center gap-1 text-xs text-accent">
                <Star size={11} />{Math.round(lesson.userProgress.accuracy)}%
              </span>
            )}
          </div>
        </div>

        {!isLocked && (
          <PlayCircle
            size={22}
            className={isCompleted ? 'text-success/50' : 'text-secondary/70'}
            strokeWidth={1.5}
          />
        )}
      </motion.button>
    </motion.div>
  );
}

export function WorldDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: world, isLoading } = useQuery({
    queryKey: ['world', id],
    queryFn: () => worldApi.getWorld(id!),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen px-6 pt-8 pb-24 space-y-4 max-w-2xl mx-auto">
        <div className="skeleton h-10 w-32 mb-6" />
        <div className="skeleton h-48 w-full" />
        <div className="space-y-3 mt-6">
          {[1, 2, 3].map((i) => <div key={i} className="skeleton h-24 w-full" />)}
        </div>
      </div>
    );
  }

  if (!world) return null;

  const completed = world.userProgress?.completedLessons ?? 0;
  const total = world.userProgress?.totalLessons ?? world.lessons?.length ?? 0;
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="min-h-screen pb-24 lg:pb-8">
      {/* Hero */}
      <div
        className="px-6 pt-6 pb-8 relative overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #1A0A3E 0%, #0F0A1E 100%)' }}
      >
        <div className="absolute top-0 right-0 bottom-0 flex items-center opacity-10 pointer-events-none select-none">
          <span className="text-[10rem]">{world.emoji}</span>
        </div>

        <div className="relative z-10 max-w-2xl mx-auto">
          <button
            onClick={() => navigate('/app/worlds')}
            className="flex items-center gap-2 text-muted hover:text-text transition-colors mb-5 font-display font-700 text-sm"
          >
            <ArrowLeft size={16} /> Back to Worlds
          </button>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="text-5xl mb-3">{world.emoji}</div>
            <h1 className="font-display font-900 text-display-md text-text mb-2">{world.name}</h1>
            <p className="text-muted text-sm mb-5 max-w-lg">{world.description}</p>

            {/* Progress */}
            <div className="flex items-center gap-3 mb-3">
              <div className="flex-1 h-3 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.1)' }}>
                <motion.div
                  className="h-full rounded-full bg-gradient-primary"
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 1, ease: [0.34, 1.56, 0.64, 1] }}
                />
              </div>
              <span className="text-sm font-display font-700 text-text">{pct}%</span>
            </div>
            <p className="text-muted text-xs">{completed} of {total} lessons complete</p>
          </motion.div>
        </div>
      </div>

      {/* Lessons */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="px-6 pt-6 pb-6 max-w-2xl mx-auto space-y-3"
      >
        <motion.h2 variants={fadeUp} className="font-display font-700 text-text mb-4">
          Lessons
        </motion.h2>
        {world.lessons?.map((lesson: Lesson, index: number) => (
          <LessonItem key={lesson.id} lesson={lesson} index={index} worldColor="#7C3AED" />
        ))}
      </motion.div>
    </div>
  );
}
