// ============================================================
// SIGNAVERSE — Auth Layout
// ============================================================

import { Outlet, Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { ToastContainer } from '../components/ui/Toast';

export function AuthLayout() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  if (isAuthenticated) {
    return <Navigate to="/app/home" replace />;
  }

  return (
    <div className="min-h-screen w-full flex bg-background overflow-hidden relative">
      {/* Ambient background shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full opacity-20 blur-3xl bg-primary-light" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full opacity-15 blur-3xl bg-aqua" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full opacity-10 blur-3xl bg-accent" />
      </div>

      {/* Left — branding panel (desktop only) */}
      <div className="hidden lg:flex flex-col justify-between w-2/5 p-12 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow-primary">
            <span className="text-xl">🤟</span>
          </div>
          <div>
            <p className="font-display font-900 text-lg text-gradient-primary leading-none">SIGNAVERSE</p>
            <p className="text-xs text-subtle">LEARN · SIGN · CONNECT</p>
          </div>
        </div>

        <div>
          <h1 className="font-display font-900 text-display-lg text-text leading-tight mb-4">
            Master Indian
            <br />
            <span className="text-gradient-primary">Sign Language</span>
          </h1>
          <p className="text-muted text-base leading-relaxed mb-8">
            Learn ISL through gamified lessons, earn XP, connect your smart glove,
            and join thousands of learners on their signing journey.
          </p>

          {/* Feature pills */}
          <div className="flex flex-wrap gap-2">
            {['🎮 Gamified Learning', '🤖 AI Feedback', '🏆 Leaderboard', '🧤 Smart Glove Ready'].map((f) => (
              <span key={f} className="badge badge-primary text-xs">{f}</span>
            ))}
          </div>
        </div>

        <p className="text-subtle text-xs">© 2025 SignaVerse AI. Built for ISL learners.</p>
      </div>

      {/* Right — form area */}
      <div className="flex-1 flex items-center justify-center p-6 relative z-10">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 justify-center mb-8 lg:hidden">
            <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow-primary">
              <span className="text-xl">🤟</span>
            </div>
            <p className="font-display font-900 text-xl text-gradient-primary">SIGNAVERSE</p>
          </div>

          <Outlet />
        </div>
      </div>

      <ToastContainer />
    </div>
  );
}
