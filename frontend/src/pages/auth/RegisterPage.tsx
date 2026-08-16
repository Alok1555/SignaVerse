// ============================================================
// SIGNAVERSE — Register Page
// ============================================================

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, User, Loader2 } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { fadeUp, staggerContainer } from '../../utils/motion';

export function RegisterPage() {
  const { register, isLoading } = useAuth();
  const [form, setForm] = useState({ displayName: '', email: '', password: '', confirm: '' });
  const [role, setRole] = useState<'STUDENT' | 'TEACHER'>('STUDENT');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  type RegisterFormErrors = Record<string, string>;

  function validate() {
    const errs: RegisterFormErrors = {};
    if (!form.displayName.trim()) errs.displayName = 'Display name is required';
    else if (form.displayName.trim().length < 2) errs.displayName = 'Must be at least 2 characters';
    if (!form.email) errs.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Invalid email';
    if (!form.password) errs.password = 'Password is required';
    else if (form.password.length < 8) errs.password = 'Must be at least 8 characters';
    if (form.password !== form.confirm) errs.confirm = 'Passwords do not match';
    return errs;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length === 0) {
      register({
        displayName: form.displayName.trim(),
        email: form.email,
        password: form.password,
        role,
      });
    }
  }

  const update = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="visible">
      <motion.div variants={fadeUp} className="mb-6">
        <h2 className="font-display font-900 text-display-md text-text">Start your adventure</h2>
        <p className="text-muted text-sm mt-1">Join thousands learning Indian Sign Language</p>
      </motion.div>

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        {/* Display Name */}
        <motion.div variants={fadeUp}>
          <label htmlFor="displayName" className="block text-sm font-display font-700 text-muted mb-1.5">
            Your Name
          </label>
          <div className="relative">
            <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-subtle" />
            <input
              id="displayName"
              type="text"
              value={form.displayName}
              onChange={update('displayName')}
              className={`input pl-11 ${errors.displayName ? 'input-error' : ''}`}
              placeholder="Priya Sharma"
              autoComplete="name"
              disabled={isLoading}
            />
          </div>
          {errors.displayName && <p className="text-error text-xs mt-1">{errors.displayName}</p>}
        </motion.div>

        {/* Email */}
        <motion.div variants={fadeUp}>
          <label htmlFor="reg-email" className="block text-sm font-display font-700 text-muted mb-1.5">
            Email
          </label>
          <div className="relative">
            <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-subtle" />
            <input
              id="reg-email"
              type="email"
              value={form.email}
              onChange={update('email')}
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
          <label htmlFor="reg-password" className="block text-sm font-display font-700 text-muted mb-1.5">
            Password
          </label>
          <div className="relative">
            <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-subtle" />
            <input
              id="reg-password"
              type={showPassword ? 'text' : 'password'}
              value={form.password}
              onChange={update('password')}
              className={`input pl-11 pr-12 ${errors.password ? 'input-error' : ''}`}
              placeholder="8+ characters"
              autoComplete="new-password"
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

        {/* Confirm Password */}
        <motion.div variants={fadeUp}>
          <label htmlFor="confirm" className="block text-sm font-display font-700 text-muted mb-1.5">
            Confirm Password
          </label>
          <div className="relative">
            <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-subtle" />
            <input
              id="confirm"
              type={showPassword ? 'text' : 'password'}
              value={form.confirm}
              onChange={update('confirm')}
              className={`input pl-11 ${errors.confirm ? 'input-error' : ''}`}
              placeholder="Repeat password"
              autoComplete="new-password"
              disabled={isLoading}
            />
          </div>
          {errors.confirm && <p className="text-error text-xs mt-1">{errors.confirm}</p>}
        </motion.div>

        {/* Role Toggle for Demo / Testing */}
        <motion.div variants={fadeUp} className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/5">
          <div>
            <p className="font-display font-700 text-xs text-text">Sign up as Teacher</p>
            <p className="text-subtle text-[10px] mt-0.5">Toggle to create a teacher account</p>
          </div>
          <button
            type="button"
            onClick={() => setRole(role === 'STUDENT' ? 'TEACHER' : 'STUDENT')}
            className={`relative w-10 h-5 rounded-full transition-colors ${role === 'TEACHER' ? 'bg-amber-400' : 'bg-white/10'}`}
            style={{ minWidth: '40px' }}
          >
            <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-surface transition-transform ${role === 'TEACHER' ? 'translate-x-5' : 'translate-x-0.5'}`} />
          </button>
        </motion.div>

        {/* Submit */}
        <motion.div variants={fadeUp} className="pt-1">
          <button
            type="submit"
            id="register-submit"
            disabled={isLoading}
            className="btn-accent w-full py-3.5 text-base"
          >
            {isLoading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Creating account...
              </>
            ) : (
              '🚀 Start Learning'
            )}
          </button>
        </motion.div>
      </form>

      <motion.div variants={fadeUp} className="mt-6 text-center">
        <p className="text-muted text-sm">
          Already have an account?{' '}
          <Link
            to="/login"
            className="text-secondary hover:text-secondary-light font-display font-700 transition-colors"
          >
            Sign in
          </Link>
        </p>
      </motion.div>
    </motion.div>
  );
}
