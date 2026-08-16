// ============================================================
// SIGNAVERSE — App Router (route tree only)
// ============================================================

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Suspense, lazy } from 'react';

// Layouts
import { AuthLayout } from './layouts/AuthLayout';
import { AppLayout } from './layouts/AppLayout';
import { TeacherLayout } from './layouts/TeacherLayout';

// Auth guard
import { ProtectedRoute } from './components/auth/ProtectedRoute';

// Eager pages (above the fold)
import { SplashScreen } from './pages/SplashScreen';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { ForgotPasswordPage } from './pages/app/SettingsPage';

// Lazy-loaded app pages
const HomePage = lazy(() => import('./pages/app/HomePage').then(m => ({ default: m.HomePage })));
const WorldsPage = lazy(() => import('./pages/app/WorldsPage').then(m => ({ default: m.WorldsPage })));
const WorldDetailPage = lazy(() => import('./pages/app/WorldDetailPage').then(m => ({ default: m.WorldDetailPage })));
const LessonPage = lazy(() => import('./pages/app/LessonPage').then(m => ({ default: m.LessonPage })));
const PracticePage = lazy(() => import('./pages/app/PracticePage').then(m => ({ default: m.PracticePage })));
const ChallengesPage = lazy(() => import('./pages/app/ChallengesPage').then(m => ({ default: m.ChallengesPage })));
const RewardsPage = lazy(() => import('./pages/app/RewardsPage').then(m => ({ default: m.RewardsPage })));
const AchievementsPage = lazy(() => import('./pages/app/AchievementsPage').then(m => ({ default: m.AchievementsPage })));
const LeaderboardPage = lazy(() => import('./pages/app/LeaderboardPage').then(m => ({ default: m.LeaderboardPage })));
const ProfilePage = lazy(() => import('./pages/app/ProfilePage').then(m => ({ default: m.ProfilePage })));
const SettingsPage = lazy(() => import('./pages/app/SettingsPage').then(m => ({ default: m.SettingsPage })));

// Lazy-loaded teacher pages
const TeacherDashboard = lazy(() => import('./pages/teacher/TeacherDashboard').then(m => ({ default: m.TeacherDashboard })));
const StudentsPage = lazy(() => import('./pages/teacher/StudentsPage').then(m => ({ default: m.StudentsPage })));
const ProgressPage = lazy(() => import('./pages/teacher/ProgressPage').then(m => ({ default: m.ProgressPage })));
const TeacherSettingsPage = lazy(() => import('./pages/teacher/SettingsPage').then(m => ({ default: m.SettingsPage })));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function PageFallback() {
  return (
    <div className="flex-1 flex items-center justify-center min-h-[50vh]">
      <div className="flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <div key={i} className="w-2 h-2 rounded-full bg-secondary"
            style={{ animation: `bounce 1s ease-in-out ${i * 0.15}s infinite` }} />
        ))}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* Splash */}
          <Route path="/" element={<SplashScreen />} />

          {/* Auth routes */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          </Route>

          {/* Protected app routes */}
          <Route element={<ProtectedRoute allowedRoles={['STUDENT', 'TEACHER', 'ADMIN']} />}>
            <Route element={<AppLayout />}>
              <Route path="/app" element={<Navigate to="/app/home" replace />} />
              <Route path="/app/home" element={<Suspense fallback={<PageFallback />}><HomePage /></Suspense>} />
              <Route path="/app/worlds" element={<Suspense fallback={<PageFallback />}><WorldsPage /></Suspense>} />
              <Route path="/app/worlds/:id" element={<Suspense fallback={<PageFallback />}><WorldDetailPage /></Suspense>} />
              <Route path="/app/lessons/:id" element={<Suspense fallback={<PageFallback />}><LessonPage /></Suspense>} />
              <Route path="/app/practice" element={<Suspense fallback={<PageFallback />}><PracticePage /></Suspense>} />
              <Route path="/app/challenges" element={<Suspense fallback={<PageFallback />}><ChallengesPage /></Suspense>} />
              <Route path="/app/rewards" element={<Suspense fallback={<PageFallback />}><RewardsPage /></Suspense>} />
              <Route path="/app/achievements" element={<Suspense fallback={<PageFallback />}><AchievementsPage /></Suspense>} />
              <Route path="/app/leaderboard" element={<Suspense fallback={<PageFallback />}><LeaderboardPage /></Suspense>} />
              <Route path="/app/profile" element={<Suspense fallback={<PageFallback />}><ProfilePage /></Suspense>} />
              <Route path="/app/settings" element={<Suspense fallback={<PageFallback />}><SettingsPage /></Suspense>} />
            </Route>
          </Route>

          {/* Protected teacher routes */}
          <Route element={<ProtectedRoute allowedRoles={['TEACHER', 'ADMIN']} />}>
            <Route element={<TeacherLayout />}>
              <Route path="/teacher" element={<Navigate to="/teacher/dashboard" replace />} />
              <Route path="/teacher/dashboard" element={<Suspense fallback={<PageFallback />}><TeacherDashboard /></Suspense>} />
              <Route path="/teacher/students" element={<Suspense fallback={<PageFallback />}><StudentsPage /></Suspense>} />
              <Route path="/teacher/progress" element={<Suspense fallback={<PageFallback />}><ProgressPage /></Suspense>} />
              <Route path="/teacher/settings" element={<Suspense fallback={<PageFallback />}><TeacherSettingsPage /></Suspense>} />
            </Route>
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
