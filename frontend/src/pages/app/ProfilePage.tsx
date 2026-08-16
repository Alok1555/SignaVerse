// SIGNAVERSE — Profile Page
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { LogOut, Settings, Flame, Zap, Trophy } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { XPBar } from '../../components/gamification/XPBar';
import { staggerContainer, fadeUp } from '../../utils/motion';
import { getXPProgress } from '../../utils/xp';

export function ProfilePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  if (!user) return null;
  const { level } = getXPProgress(user.profile.xp);

  const stats = [
    { icon: Zap, label: 'Total XP', value: user.profile.xp.toLocaleString(), color: 'text-secondary' },
    { icon: Flame, label: 'Day Streak', value: `${user.profile.streak}`, color: 'text-orange-400' },
    { icon: Trophy, label: 'Coins', value: user.profile.coins.toLocaleString(), color: 'text-accent' },
  ];

  return (
    <div className="min-h-screen pb-24 lg:pb-8">
      <div className="px-6 pt-8 pb-8 relative overflow-hidden" style={{ background: 'linear-gradient(160deg, #1A0A3E 0%, #0F0A1E 100%)' }}>
        <div className="absolute top-0 right-0 w-48 h-48 rounded-full opacity-15 blur-3xl bg-primary-light pointer-events-none" />
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="relative flex flex-col items-center text-center max-w-sm mx-auto">
          <motion.div className="w-24 h-24 rounded-3xl bg-gradient-primary flex items-center justify-center text-4xl font-display font-900 text-white mb-4 shadow-glow-primary"
            animate={{ boxShadow: ['0 0 20px rgba(124,58,237,0.4)', '0 0 40px rgba(124,58,237,0.6)', '0 0 20px rgba(124,58,237,0.4)'] }}
            transition={{ duration: 3, repeat: Infinity }}>
            {user.profile.displayName.charAt(0).toUpperCase()}
          </motion.div>
          <h1 className="font-display font-900 text-2xl text-text">{user.profile.displayName}</h1>
          <p className="text-muted text-sm mt-1">{user.email}</p>
          <div className="badge badge-primary mt-3 text-xs">Level {level} Signer</div>
          <div className="w-full mt-5"><XPBar xp={user.profile.xp} size="md" showLabels /></div>
        </motion.div>
      </div>

      <div className="px-6 py-6 max-w-sm mx-auto space-y-5">
        <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="grid grid-cols-3 gap-3">
          {stats.map(({ icon: Icon, label, value, color }) => (
            <motion.div key={label} variants={fadeUp} className="card p-4 text-center">
              <Icon size={20} className={`${color} mx-auto mb-2`} />
              <p className={`font-display font-900 text-lg ${color}`}>{value}</p>
              <p className="text-subtle text-xs">{label}</p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div variants={fadeUp} initial="hidden" animate="visible" className="card divide-y divide-white/10">

          {[
            { label: 'Settings', icon: Settings, action: () => navigate('/app/settings') },
            { label: 'Sign Out', icon: LogOut, action: logout, danger: true },
          ].map(({ label, icon: Icon, action, danger }) => (
            <button key={label} onClick={action} className={`w-full flex items-center gap-3 px-5 py-4 text-left transition-colors ${danger ? 'hover:bg-error/10 text-error' : 'hover:bg-white/5 text-muted hover:text-text'}`}>
              <Icon size={18} strokeWidth={1.8} />
              <span className="font-display font-700 text-sm">{label}</span>
            </button>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
