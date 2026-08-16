// ============================================================
// SIGNAVERSE — Side Navigation (Desktop)
// ============================================================

import { NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Home, Globe, Dumbbell, Trophy, User, Settings,
  LogOut, Zap, Flame, Swords, Medal,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { XPBar } from '../gamification/XPBar';

const navItems = [
  { to: '/app/home', icon: Home, label: 'Home' },
  { to: '/app/worlds', icon: Globe, label: 'Worlds' },
  { to: '/app/practice', icon: Dumbbell, label: 'Practice' },
  { to: '/app/challenges', icon: Swords, label: 'Challenges' },
  { to: '/app/rewards', icon: Trophy, label: 'Rewards' },
  { to: '/app/achievements', icon: Medal, label: 'Achievements' },
  { to: '/app/leaderboard', icon: Zap, label: 'Leaderboard' },
  { to: '/app/profile', icon: User, label: 'Profile' },
];

export function SideNav() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <aside
      className="hidden lg:flex flex-col w-64 h-screen border-r shrink-0 overflow-y-auto no-scrollbar"
      style={{
        background: 'rgba(15,10,30,0.98)',
        borderColor: 'rgba(167,139,250,0.1)',
        position: 'sticky',
        top: 0,
      }}
    >
      {/* Logo */}
      <div className="px-6 py-6 border-b" style={{ borderColor: 'rgba(167,139,250,0.1)' }}>
        <button
          onClick={() => navigate('/app/home')}
          className="flex items-center gap-2 group"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow-primary">
            <span className="text-lg">🤟</span>
          </div>
          <div>
            <p className="font-display font-900 text-sm text-gradient-primary leading-none">SIGNAVERSE</p>
            <p className="text-[10px] text-subtle mt-0.5">LEARN · SIGN · CONNECT</p>
          </div>
        </button>
      </div>

      {/* User snapshot */}
      {user && (
        <div className="px-4 py-4 border-b" style={{ borderColor: 'rgba(167,139,250,0.1)' }}>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center text-base font-display font-900 text-white">
              {user.profile.displayName.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="font-display font-700 text-sm text-text truncate">{user.profile.displayName}</p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs text-subtle">Level {user.profile.level}</span>
                <span className="flex items-center gap-0.5 text-xs text-amber-400">
                  <Flame size={10} />
                  {user.profile.streak}d
                </span>
              </div>
            </div>
          </div>
          <XPBar xp={user.profile.xp} size="sm" showLabels={false} />
        </div>
      )}

      {/* Nav Items */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto no-scrollbar" aria-label="Main navigation">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group ${
                isActive
                  ? 'bg-primary-light/15 text-secondary'
                  : 'text-subtle hover:text-text hover:bg-white/5'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <motion.div
                  animate={isActive ? { scale: 1.1 } : { scale: 1 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                >
                  <Icon size={18} strokeWidth={isActive ? 2.5 : 1.8} />
                </motion.div>
                <span className="font-display font-700 text-sm">{label}</span>
                {isActive && (
                  <motion.div
                    layoutId="active-indicator"
                    className="ml-auto w-1.5 h-1.5 rounded-full bg-secondary"
                  />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t space-y-1" style={{ borderColor: 'rgba(167,139,250,0.1)' }}>
        <NavLink
          to="/app/settings"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-subtle hover:text-text hover:bg-white/5 transition-all duration-200"
        >
          <Settings size={18} strokeWidth={1.8} />
          <span className="font-display font-700 text-sm">Settings</span>
        </NavLink>
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-subtle hover:text-error hover:bg-error/10 transition-all duration-200"
          aria-label="Sign out"
        >
          <LogOut size={18} strokeWidth={1.8} />
          <span className="font-display font-700 text-sm">Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
