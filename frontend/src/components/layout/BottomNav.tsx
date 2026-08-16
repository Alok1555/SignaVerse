// ============================================================
// SIGNAVERSE — Bottom Navigation (Mobile)
// ============================================================

import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Globe, Dumbbell, Trophy, User } from 'lucide-react';

const navItems = [
  { to: '/app/home', icon: Home, label: 'Home' },
  { to: '/app/worlds', icon: Globe, label: 'Worlds' },
  { to: '/app/practice', icon: Dumbbell, label: 'Practice' },
  { to: '/app/rewards', icon: Trophy, label: 'Rewards' },
  { to: '/app/profile', icon: User, label: 'Profile' },
];

export function BottomNav() {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 lg:hidden"
      aria-label="Main navigation"
    >
      <div
        className="flex items-center justify-around px-2 py-2"
        style={{
          background: 'rgba(15,10,30,0.95)',
          backdropFilter: 'blur(24px)',
          borderTop: '1px solid rgba(167,139,250,0.15)',
        }}
      >
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `nav-item px-3 py-1 rounded-2xl ${isActive ? 'active' : ''}`
            }
            aria-label={label}
          >
            {({ isActive }) => (
              <>
                <motion.div
                  className="nav-icon"
                  animate={isActive ? { backgroundColor: 'rgba(167,139,250,0.15)' } : { backgroundColor: 'transparent' }}
                  transition={{ duration: 0.2 }}
                >
                  <motion.div
                    animate={isActive ? { scale: 1.15, y: -1 } : { scale: 1, y: 0 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                  >
                    <Icon
                      size={22}
                      strokeWidth={isActive ? 2.5 : 1.8}
                      className={isActive ? 'text-secondary' : 'text-subtle'}
                    />
                  </motion.div>
                </motion.div>
                <span
                  className={`text-[10px] font-display font-700 leading-none ${
                    isActive ? 'text-secondary' : 'text-subtle'
                  }`}
                >
                  {label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
