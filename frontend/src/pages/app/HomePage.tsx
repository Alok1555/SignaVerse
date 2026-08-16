// ============================================================
// SIGNAVERSE — Home / Adventure Page
// ============================================================

import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  ChevronRight, Flame, Zap, Globe,
  Star, Clock
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { gamificationApi } from '../../services/api/gamificationApi';
import { worldApi } from '../../services/api/worldApi';
import { XPBar } from '../../components/gamification/XPBar';
import { StreakBadge, CoinBadge, LevelBadge } from '../../components/gamification/Badges';
import { getXPProgress } from '../../utils/xp';
import { fadeUp, staggerContainer, scaleIn } from '../../utils/motion';

export function HomePage() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);

  const { data: worlds } = useQuery({
    queryKey: ['worlds'],
    queryFn: worldApi.getWorlds,
    staleTime: 5 * 60 * 1000,
  });

  const { data: todayChallenge } = useQuery({
    queryKey: ['challenge-today'],
    queryFn: gamificationApi.getTodayChallenge,
    staleTime: 60 * 1000,
  });

  if (!user) return null;

  const profile = user.profile;
  const { level } = getXPProgress(profile.xp);

  const currentWorld = worlds?.find((w) => !w.userProgress?.isUnlocked === false) ?? worlds?.[0];
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="min-h-screen pb-24 lg:pb-8 pt-0">
      {/* Hero Header */}
      <motion.div
        className="relative overflow-hidden px-6 pt-8 pb-10"
        style={{
          background: 'linear-gradient(160deg, #1A0A3E 0%, #1A1235 60%, #0F0A1E 100%)',
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {/* Ambient glow */}
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-20 blur-3xl bg-primary-light pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full opacity-10 blur-3xl bg-aqua pointer-events-none" />

        <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="relative z-10 max-w-4xl mx-auto">
          {/* Greeting row */}
          <motion.div variants={fadeUp} className="flex items-center justify-between mb-6">
            <div>
              <p className="text-muted text-sm font-display font-700">{greeting} 👋</p>
              <h1 className="font-display font-900 text-display-md text-text mt-0.5">
                {profile.displayName}
              </h1>
            </div>
            <motion.button
              onClick={() => navigate('/app/profile')}
              className="relative"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="w-14 h-14 rounded-2xl bg-gradient-primary flex items-center justify-center text-2xl font-display font-900 text-white shadow-glow-primary">
                {profile.displayName.charAt(0).toUpperCase()}
              </div>
              <div className="absolute -bottom-1 -right-1 badge badge-accent text-[10px] px-1.5 py-0.5">
                {level}
              </div>
            </motion.button>
          </motion.div>

          {/* Stats row */}
          <motion.div variants={fadeUp} className="flex items-center gap-3 flex-wrap mb-5">
            <LevelBadge level={level} />
            <StreakBadge streak={profile.streak} />
            <CoinBadge coins={profile.coins} />
          </motion.div>

          {/* XP Bar */}
          <motion.div variants={fadeUp}>
            <XPBar xp={profile.xp} size="md" showLabels />
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Content */}
      <div className="px-6 max-w-4xl mx-auto mt-6 space-y-6">

        {/* Continue Adventure CTA */}
        {currentWorld && (
          <motion.div {...{ variants: scaleIn, initial: 'hidden', animate: 'visible' }}>
            <motion.button
              onClick={() => navigate(`/app/worlds/${currentWorld.id}`)}
              className="w-full relative overflow-hidden rounded-3xl p-6 text-left"
              style={{
                background: 'linear-gradient(135deg, #4C1D95 0%, #7C3AED 60%, #A78BFA 100%)',
                boxShadow: '0 8px 40px rgba(124,58,237,0.4)',
              }}
              whileHover={{ scale: 1.01, boxShadow: '0 12px 50px rgba(124,58,237,0.5)' }}
              whileTap={{ scale: 0.99 }}
              id="continue-adventure-btn"
            >
              {/* BG decoration */}
              <div className="absolute right-0 top-0 bottom-0 w-40 opacity-20">
                <div className="text-9xl absolute -right-4 top-1/2 -translate-y-1/2">🌏</div>
              </div>

              <div className="relative z-10">
                <p className="badge badge-accent text-xs mb-3 inline-flex">CONTINUE ADVENTURE</p>
                <h2 className="font-display font-900 text-xl text-white mb-1">
                  {currentWorld.emoji} {currentWorld.name}
                </h2>
                <p className="text-purple-200 text-sm mb-4 max-w-xs">
                  {currentWorld.description}
                </p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 rounded-full bg-white/20 overflow-hidden">
                    <motion.div
                      className="h-full rounded-full bg-white"
                      initial={{ width: 0 }}
                      animate={{ width: `${(currentWorld.userProgress?.percentComplete ?? 0) * 100}%` }}
                      transition={{ duration: 1, delay: 0.5 }}
                    />
                  </div>
                  <span className="text-white/70 text-xs font-display font-700">
                    {currentWorld.userProgress?.completedLessons ?? 0}/{currentWorld.userProgress?.totalLessons ?? 0}
                  </span>
                  <ChevronRight size={18} className="text-white/70" />
                </div>
              </div>
            </motion.button>
          </motion.div>
        )}

        {/* Quick Stats Grid */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 lg:grid-cols-4 gap-3"
        >
          {[
            { icon: Flame, label: 'Day Streak', value: `${profile.streak}`, color: 'text-orange-400', bg: 'bg-orange-500/10' },
            { icon: Zap, label: 'Total XP', value: profile.xp.toLocaleString(), color: 'text-secondary', bg: 'bg-primary-light/10' },
            { icon: Globe, label: 'Worlds', value: `${worlds?.filter(w => w.userProgress?.isUnlocked).length ?? 0}/${worlds?.length ?? 0}`, color: 'text-aqua', bg: 'bg-aqua/10' },
            { icon: Star, label: 'Level', value: level.toString(), color: 'text-accent', bg: 'bg-accent/10' },
          ].map(({ icon: Icon, label, value, color, bg }) => (
            <motion.div key={label} variants={fadeUp} className="card p-4">
              <div className={`w-9 h-9 rounded-xl ${bg} flex items-center justify-center mb-3`}>
                <Icon size={18} className={color} />
              </div>
              <p className={`font-display font-900 text-xl ${color}`}>{value}</p>
              <p className="text-subtle text-xs mt-0.5">{label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Daily Challenge */}
        {todayChallenge && (
          <motion.div variants={fadeUp} initial="hidden" animate="visible">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-display font-700 text-text">Daily Challenge</h3>
              <span className="badge badge-aqua text-xs">
                <Clock size={11} />
                Today
              </span>
            </div>
            <motion.button
              onClick={() => navigate('/app/challenges')}
              className="w-full card p-5 flex items-center gap-4 text-left"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              style={todayChallenge.isCompleted ? { opacity: 0.6 } : {}}
            >
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0"
                style={{ background: 'linear-gradient(135deg, rgba(6,182,212,0.2), rgba(59,130,246,0.2))' }}
              >
                🤙
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-display font-700 text-text">Sign: {todayChallenge.sign.word}</p>
                <p className="text-muted text-sm truncate">{todayChallenge.sign.description}</p>
                <div className="flex gap-2 mt-2">
                  <span className="badge badge-primary text-xs">+{todayChallenge.xpReward} XP</span>
                  <span className="badge badge-accent text-xs">+{todayChallenge.coinReward} 🪙</span>
                </div>
              </div>
              {todayChallenge.isCompleted ? (
                <div className="badge badge-success text-xs">Done ✓</div>
              ) : (
                <ChevronRight size={20} className="text-subtle flex-shrink-0" />
              )}
            </motion.button>
          </motion.div>
        )}

        {/* Worlds Preview */}
        {worlds && worlds.length > 0 && (
          <motion.div variants={fadeUp} initial="hidden" animate="visible" className="pb-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-display font-700 text-text">All Worlds</h3>
              <button
                onClick={() => navigate('/app/worlds')}
                className="text-secondary text-xs font-display font-700 flex items-center gap-1 hover:text-secondary-light transition-colors"
              >
                See all <ChevronRight size={14} />
              </button>
            </div>
            <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
              {worlds.slice(0, 4).map((world) => (
                <motion.button
                  key={world.id}
                  onClick={() => navigate(`/app/worlds/${world.id}`)}
                  className="card p-4 flex-shrink-0 w-40 text-center"
                  style={!world.userProgress?.isUnlocked ? { opacity: 0.5 } : {}}
                  whileHover={world.userProgress?.isUnlocked ? { scale: 1.03 } : {}}
                  whileTap={{ scale: 0.97 }}
                >
                  <div className="text-4xl mb-2">{world.emoji}</div>
                  <p className="font-display font-700 text-sm text-text leading-tight">{world.name}</p>
                  <p className="text-subtle text-xs mt-1">
                    {world.userProgress?.isUnlocked ? `${world.userProgress.completedLessons}/${world.userProgress.totalLessons}` : `🔒 ${world.unlocksAtXP} XP`}
                  </p>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Motivational tip */}
        {!worlds && (
          <motion.div variants={fadeUp} initial="hidden" animate="visible" className="card p-5 text-center">
            <div className="text-5xl mb-3">🤟</div>
            <p className="font-display font-700 text-text mb-1">Ready to start?</p>
            <p className="text-muted text-sm mb-4">Explore worlds to begin your ISL journey</p>
            <button onClick={() => navigate('/app/worlds')} className="btn-primary mx-auto px-8">
              Explore Worlds
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
