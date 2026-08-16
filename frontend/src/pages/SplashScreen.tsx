// ============================================================
// SIGNAVERSE — Splash Screen
// ============================================================

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthStore } from '../store/authStore';

export function SplashScreen() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuthStore();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (isAuthenticated && user) {
        if (user.role === 'TEACHER' || user.role === 'ADMIN') {
          navigate('/teacher/dashboard', { replace: true });
        } else {
          navigate('/app/home', { replace: true });
        }
      } else {
        navigate('/login', { replace: true });
      }
    }, 2800);
    return () => clearTimeout(timer);
  }, [navigate, isAuthenticated, user]);

  return (
    <div className="fixed inset-0 bg-background flex flex-col items-center justify-center overflow-hidden">
      {/* Ambient orbs */}
      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full opacity-20 blur-3xl"
        style={{ background: 'radial-gradient(circle, #7C3AED, #4C1D95)' }}
        animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.25, 0.15] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute w-72 h-72 rounded-full opacity-10 blur-3xl"
        style={{ background: 'radial-gradient(circle, #06B6D4, transparent)', top: '20%', right: '15%' }}
        animate={{ scale: [1, 1.3, 1], x: [0, 20, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute w-64 h-64 rounded-full opacity-10 blur-3xl"
        style={{ background: 'radial-gradient(circle, #F59E0B, transparent)', bottom: '20%', left: '10%' }}
        animate={{ scale: [1.1, 1, 1.1], y: [0, -20, 0] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Floating particles */}
      {Array.from({ length: 12 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: 3 + (i % 4) * 2,
            height: 3 + (i % 4) * 2,
            background: ['#A78BFA', '#06B6D4', '#F59E0B', '#10B981'][i % 4],
            left: `${10 + (i * 7.5) % 80}%`,
            top: `${15 + (i * 6.5) % 70}%`,
            opacity: 0.4 + (i % 3) * 0.2,
          }}
          animate={{
            y: [0, -30 - (i % 3) * 15, 0],
            opacity: [0.3, 0.7, 0.3],
          }}
          transition={{
            duration: 3 + (i % 3),
            repeat: Infinity,
            delay: i * 0.2,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* Logo */}
      <motion.div
        className="relative z-10 flex flex-col items-center gap-6"
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.34, 1.56, 0.64, 1] }}
      >
        {/* Icon */}
        <motion.div
          className="w-28 h-28 rounded-[2rem] bg-gradient-primary flex items-center justify-center"
          style={{ boxShadow: '0 0 60px rgba(124,58,237,0.5), 0 0 120px rgba(124,58,237,0.2)' }}
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        >
          <span className="text-6xl select-none">🤟</span>
        </motion.div>

        {/* Brand name */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <h1 className="font-display font-900 text-display-lg text-gradient-primary tracking-wide">
            SIGNAVERSE
          </h1>
          <motion.p
            className="text-muted text-sm font-display font-700 tracking-[0.3em] mt-1 uppercase"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            LEARN · SIGN · CONNECT
          </motion.p>
        </motion.div>

        {/* Loading indicator */}
        <motion.div
          className="flex gap-1.5 mt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-secondary"
              animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                delay: i * 0.2,
                ease: 'easeInOut',
              }}
            />
          ))}
        </motion.div>
      </motion.div>

      {/* AI ready indicator */}
      <motion.div
        className="absolute bottom-8 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        <p className="text-subtle text-xs">Powered by AI · Smart Glove Ready</p>
      </motion.div>
    </div>
  );
}
