// ============================================================
// SIGNAVERSE — Teacher Settings Page
// ============================================================

import { motion } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';
import { fadeUp, staggerContainer } from '../../utils/motion';
import { Shield, Sparkles } from 'lucide-react';
import { useState } from 'react';

export function SettingsPage() {
  const { user } = useAuth();
  const [reminders, setReminders] = useState(true);
  const [anonymousMetrics, setAnonymousMetrics] = useState(false);

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div>
        <h1 className="font-display font-900 text-display-md text-text">Teacher Settings</h1>
        <p className="text-muted text-sm mt-1">Configure your dashboard preferences and portal options.</p>
      </div>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="max-w-2xl space-y-6"
      >
        {/* Profile Card */}
        <motion.div variants={fadeUp} className="card-elevated p-6 flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-display font-900 text-xl">
            {user?.profile?.displayName?.charAt(0).toUpperCase() || 'T'}
          </div>
          <div>
            <h3 className="font-display font-800 text-base text-text">
              {user?.profile?.displayName || 'Teacher Account'}
            </h3>
            <p className="text-xs text-subtle mt-0.5">{user?.email}</p>
            <div className="flex items-center gap-1.5 mt-2">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 uppercase tracking-wide">
                <Shield size={10} />
                {user?.role || 'TEACHER'} ROLE
              </span>
            </div>
          </div>
        </motion.div>

        {/* Configurations List */}
        <motion.div variants={fadeUp} className="space-y-4">
          {/* Setting 1 */}
          <div className="card p-5 flex items-center justify-between gap-4">
            <div>
              <p className="font-display font-700 text-sm text-text">Classroom Reminders</p>
              <p className="text-subtle text-xs mt-0.5">Receive digests of weekly student accomplishments</p>
            </div>
            <button
              onClick={() => setReminders(!reminders)}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                reminders ? 'bg-amber-400' : 'bg-white/10'
              }`}
              aria-label="Toggle Reminders"
            >
              <div
                className={`absolute top-1 w-4 h-4 rounded-full bg-surface transition-transform ${
                  reminders ? 'translate-x-7' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Setting 2 */}
          <div className="card p-5 flex items-center justify-between gap-4">
            <div>
              <p className="font-display font-700 text-sm text-text">Anonymized Reports</p>
              <p className="text-subtle text-xs mt-0.5">Export logs with generic student identifiers</p>
            </div>
            <button
              onClick={() => setAnonymousMetrics(!anonymousMetrics)}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                anonymousMetrics ? 'bg-amber-400' : 'bg-white/10'
              }`}
              aria-label="Toggle Anonymized Reports"
            >
              <div
                className={`absolute top-1 w-4 h-4 rounded-full bg-surface transition-transform ${
                  anonymousMetrics ? 'translate-x-7' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </motion.div>

        {/* Notice Info */}
        <motion.div
          variants={fadeUp}
          className="p-5 rounded-3xl bg-purple-500/5 border border-purple-500/10 flex items-start gap-3.5"
        >
          <Sparkles size={20} className="text-purple-400 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-display font-800 text-sm text-purple-300">More Tools Coming Soon</h4>
            <p className="text-xs text-muted leading-relaxed mt-1">
              Indian Sign Language interactive quizzes, customized assignment builders, and live virtual classroom rooms are being integrated. Stay tuned!
            </p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
