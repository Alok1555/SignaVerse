// SIGNAVERSE — Settings & ForgotPassword stub pages
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Mail, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { fadeUp, staggerContainer } from '../../utils/motion';

export function SettingsPage() {
  return (
    <div className="min-h-screen pb-24 lg:pb-8">
      <div className="px-6 pt-8 pb-6" style={{ background: 'linear-gradient(160deg, #1A0A3E 0%, #0F0A1E 100%)' }}>
        <h1 className="font-display font-900 text-display-md text-text">⚙️ Settings</h1>
        <p className="text-muted text-sm mt-1">Customize your SignaVerse experience</p>
      </div>
      <div className="px-6 py-6 max-w-lg mx-auto space-y-4">
        {[
          { label: 'Notifications', desc: 'Daily reminders and streak alerts', toggle: true },
          { label: 'Sound Effects', desc: 'Button clicks and reward sounds', toggle: true },
          { label: 'Reduced Motion', desc: 'Disable animations for accessibility', toggle: false },
          { label: 'Privacy Mode', desc: 'Hide your profile from leaderboard', toggle: false },
        ].map(({ label, desc, toggle }) => (
          <motion.div key={label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="card p-4 flex items-center justify-between gap-4">
            <div><p className="font-display font-700 text-sm text-text">{label}</p><p className="text-subtle text-xs mt-0.5">{desc}</p></div>
            <button className={`relative w-12 h-6 rounded-full transition-colors ${toggle ? 'bg-primary-light' : 'bg-white/10'}`} aria-label={`Toggle ${label}`}>
              <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${toggle ? 'translate-x-7' : 'translate-x-1'}`} />
            </button>
          </motion.div>
        ))}
        <div className="card p-4 text-center">
          <p className="text-subtle text-xs">Settings persistence coming soon</p>
        </div>
      </div>
    </div>
  );
}

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const { isLoading } = useAuth();
  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="visible">
      <motion.div variants={fadeUp} className="mb-8">
        <h2 className="font-display font-900 text-display-md text-text">Reset password</h2>
        <p className="text-muted text-sm mt-1">We'll send you a reset link</p>
      </motion.div>
      {sent ? (
        <motion.div variants={fadeUp} className="card p-6 text-center">
          <div className="text-5xl mb-3">📨</div>
          <p className="font-display font-700 text-text mb-2">Check your email</p>
          <p className="text-muted text-sm">We sent a reset link to <span className="text-text">{email}</span></p>
        </motion.div>
      ) : (
        <motion.div variants={fadeUp} className="space-y-4">
          <div>
            <label htmlFor="fp-email" className="block text-sm font-display font-700 text-muted mb-1.5">Email</label>
            <div className="relative"><Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-subtle"/>
              <input id="fp-email" type="email" value={email} onChange={e=>setEmail(e.target.value)} className="input pl-11" placeholder="you@example.com" /></div>
          </div>
          <button onClick={()=>setSent(true)} disabled={!email || isLoading} className="btn-primary w-full py-3.5">
            {isLoading ? <><Loader2 size={16} className="animate-spin"/>Sending...</> : 'Send Reset Link'}
          </button>
          <p className="text-center text-sm text-muted">Remember it? <Link to="/login" className="text-secondary font-700">Sign in</Link></p>
        </motion.div>
      )}
    </motion.div>
  );
}
