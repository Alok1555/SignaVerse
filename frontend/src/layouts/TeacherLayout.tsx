// ============================================================
// SIGNAVERSE — Teacher Layout (Protected)
// ============================================================

import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  Settings,
  LogOut,
  Menu,
  X,
  Shield,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { ToastContainer } from '../components/ui/Toast';
import { ErrorBoundary } from '../components/ui/ErrorBoundary';
import { useState } from 'react';

const teacherNavItems = [
  { to: '/teacher/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/teacher/students', icon: Users, label: 'Students Roster' },
  { to: '/teacher/progress', icon: GraduationCap, label: 'Progress Reports' },
  { to: '/teacher/settings', icon: Settings, label: 'Settings' },
];

export function TeacherLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <ErrorBoundary>
      <div className="flex min-h-screen w-full bg-background text-text">
        {/* Desktop Sidebar */}
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
              onClick={() => navigate('/teacher/dashboard')}
              className="flex items-center gap-2 group text-left"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow-primary">
                <span className="text-lg">🤟</span>
              </div>
              <div>
                <p className="font-display font-900 text-sm text-gradient-primary leading-none">SIGNAVERSE</p>
                <p className="text-[9px] text-amber-400 font-bold mt-0.5 tracking-wider uppercase">Teacher Portal</p>
              </div>
            </button>
          </div>

          {/* Teacher Profile Info */}
          {user && (
            <div className="px-5 py-5 border-b" style={{ borderColor: 'rgba(167,139,250,0.1)' }}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-display font-900">
                  {user.profile?.displayName?.charAt(0).toUpperCase() || 'T'}
                </div>
                <div className="min-w-0">
                  <p className="font-display font-700 text-sm text-text truncate">
                    {user.profile?.displayName || 'Teacher Account'}
                  </p>
                  <span className="inline-flex items-center gap-1 mt-0.5 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 uppercase tracking-wide">
                    <Shield size={10} />
                    {user.role}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Items */}
          <nav className="flex-1 px-3 py-6 space-y-1" aria-label="Teacher navigation">
            {teacherNavItems.map(({ to, icon: Icon, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                    isActive
                      ? 'bg-amber-500/15 text-amber-300 font-bold border-l-2 border-amber-400'
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
                    <span className="font-display text-sm">{label}</span>
                    {isActive && (
                      <motion.div
                        layoutId="teacher-active-indicator"
                        className="ml-auto w-1.5 h-1.5 rounded-full bg-amber-400"
                      />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Sidebar Footer */}
          <div className="px-3 py-4 border-t space-y-1" style={{ borderColor: 'rgba(167,139,250,0.1)' }}>
            <button
              onClick={logout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-subtle hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
            >
              <LogOut size={18} strokeWidth={1.8} />
              <span className="font-display font-700 text-sm">Sign Out</span>
            </button>
          </div>
        </aside>

        {/* Mobile Header Bar */}
        <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-surface border-b border-border flex items-center justify-between px-4 z-40">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
              <span className="text-sm">🤟</span>
            </div>
            <div>
              <p className="font-display font-900 text-xs text-gradient-primary leading-none">SIGNAVERSE</p>
              <p className="text-[8px] text-amber-400 font-bold mt-0.5 tracking-wider uppercase">Teacher Portal</p>
            </div>
          </div>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 text-text hover:text-amber-400 transition-colors"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Sidebar Overlay */}
        <AnimatePresence>
          {mobileOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setMobileOpen(false)}
                className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
              />
              <motion.aside
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="lg:hidden fixed top-0 bottom-0 left-0 w-72 bg-surface border-r border-border flex flex-col z-50 pt-16"
              >
                {/* User info */}
                {user && (
                  <div className="px-6 py-5 border-b border-border">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-display font-900">
                        {user.profile?.displayName?.charAt(0).toUpperCase() || 'T'}
                      </div>
                      <div>
                        <p className="font-display font-700 text-sm text-text">{user.profile?.displayName}</p>
                        <span className="inline-flex items-center gap-1 mt-0.5 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 uppercase">
                          <Shield size={10} />
                          {user.role}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Nav list */}
                <nav className="flex-1 px-4 py-6 space-y-1">
                  {teacherNavItems.map(({ to, icon: Icon, label }) => (
                    <NavLink
                      key={to}
                      to={to}
                      onClick={() => setMobileOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                          isActive
                            ? 'bg-amber-500/15 text-amber-300 font-bold border-l-2 border-amber-400'
                            : 'text-subtle hover:text-text hover:bg-white/5'
                        }`
                      }
                    >
                      <Icon size={18} />
                      <span className="font-display text-sm">{label}</span>
                    </NavLink>
                  ))}
                </nav>

                <div className="p-4 border-t border-border">
                  <button
                    onClick={() => {
                      setMobileOpen(false);
                      logout();
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-subtle hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
                  >
                    <LogOut size={18} />
                    <span className="font-display font-700 text-sm">Sign Out</span>
                  </button>
                </div>
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col min-h-screen pt-16 lg:pt-0 overflow-y-auto">
          <div className="flex-1 px-4 py-6 md:p-8 lg:p-10 max-w-7xl w-full mx-auto">
            <Outlet />
          </div>
        </main>

        {/* Global Toast container */}
        <ToastContainer />
      </div>
    </ErrorBoundary>
  );
}
