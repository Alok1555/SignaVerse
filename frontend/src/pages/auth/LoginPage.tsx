// ============================================================
// SIGNAVERSE — Login Page
// ============================================================

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, Loader2 } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { fadeUp, staggerContainer } from '../../utils/motion';

export function LoginPage() {
  const { login, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate() {
    const errs: Record<string, string> = {};
    if (!email) errs.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = 'Invalid email';
    if (!password) errs.password = 'Password is required';
    return errs;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length === 0) {
      login({ email, password });
    }
  }

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="visible">
      <motion.div variants={fadeUp} className="mb-8">
        <h2 className="font-display font-900 text-display-md text-text">Welcome back</h2>
        <p className="text-muted text-sm mt-1">Continue your signing journey</p>
      </motion.div>

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        {/* Email */}
        <motion.div variants={fadeUp}>
          <label htmlFor="email" className="block text-sm font-display font-700 text-muted mb-1.5">
            Email
          </label>
          <div className="relative">
            <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-subtle" />
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`input pl-11 ${errors.email ? 'input-error' : ''}`}
              placeholder="you@example.com"
              autoComplete="email"
              disabled={isLoading}
            />
          </div>
          {errors.email && <p className="text-error text-xs mt-1">{errors.email}</p>}
        </motion.div>

        {/* Password */}
        <motion.div variants={fadeUp}>
          <label htmlFor="password" className="block text-sm font-display font-700 text-muted mb-1.5">
            Password
          </label>
          <div className="relative">
            <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-subtle" />
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`input pl-11 pr-12 ${errors.password ? 'input-error' : ''}`}
              placeholder="••••••••"
              autoComplete="current-password"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-subtle hover:text-text transition-colors"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.password && <p className="text-error text-xs mt-1">{errors.password}</p>}
        </motion.div>

        {/* Forgot password */}
        <motion.div variants={fadeUp} className="flex justify-end">
          <Link
            to="/forgot-password"
            className="text-xs text-secondary hover:text-secondary-light transition-colors font-display font-700"
          >
            Forgot password?
          </Link>
        </motion.div>

        {/* Submit */}
        <motion.div variants={fadeUp}>
          <button
            type="submit"
            id="login-submit"
            disabled={isLoading}
            className="btn-primary w-full py-3.5 text-base"
          >
            {isLoading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </motion.div>
      </form>

      <motion.div variants={fadeUp} className="mt-6 text-center">
        <p className="text-muted text-sm">
          New to SignaVerse?{' '}
          <Link
            to="/register"
            className="text-secondary hover:text-secondary-light font-display font-700 transition-colors"
          >
            Create account
          </Link>
        </p>
      </motion.div>

      {/* Demo hint */}
      <motion.div
        variants={fadeUp}
        className="mt-4 p-3 rounded-2xl text-center"
        style={{ background: 'rgba(167,139,250,0.08)', border: '1px solid rgba(167,139,250,0.15)' }}
      >
        <p className="text-subtle text-xs">
          First time? <Link to="/register" className="text-accent font-700">Create an account</Link> to start your adventure
        </p>
      </motion.div>
    </motion.div>
  );
}
