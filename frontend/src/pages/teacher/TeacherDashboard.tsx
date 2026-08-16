// ============================================================
// SIGNAVERSE — Teacher Dashboard
// ============================================================

import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  Users,
  Trophy,
  Flame,
  BookOpen,
  ArrowRight,
  TrendingUp,
  Activity,
  Award,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { teacherApi } from '../../services/api/teacherApi';
import { fadeUp, staggerContainer } from '../../utils/motion';

export function TeacherDashboard() {
  const navigate = useNavigate();
  const { data: students, isLoading } = useQuery({
    queryKey: ['teacherStudents'],
    queryFn: teacherApi.getStudents,
  });

  // Calculate statistics
  const totalStudents = students?.length || 0;
  const avgXP = totalStudents
    ? Math.round(students!.reduce((acc, s) => acc + s.xp, 0) / totalStudents)
    : 0;
  const avgStreak = totalStudents
    ? Math.round(students!.reduce((acc, s) => acc + s.streak, 0) / totalStudents)
    : 0;
  const avgCompleted = totalStudents
    ? Math.round((students!.reduce((acc, s) => acc + s.completedLessonsCount, 0) / totalStudents) * 10) / 10
    : 0;

  // Level distribution calculation
  const levelDistribution = Array.from({ length: 5 }).map((_, idx) => {
    const level = idx + 1;
    const count = students?.filter((s) => s.level === level).length || 0;
    const percentage = totalStudents ? Math.round((count / totalStudents) * 100) : 0;
    return { level, count, percentage };
  });

  // Level 5+ group
  const level5PlusCount = students?.filter((s) => s.level >= 5).length || 0;
  const level5PlusPercentage = totalStudents ? Math.round((level5PlusCount / totalStudents) * 100) : 0;

  // Top active students list
  const activeStudents = students
    ? [...students].sort((a, b) => b.xp - a.xp).slice(0, 5)
    : [];

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-r from-amber-500/20 via-purple-500/10 to-transparent border border-amber-500/20 p-8 md:p-12">
        <div className="absolute right-0 top-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl -z-10" />
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="badge badge-accent mb-3">TEACHER CONSOLE</span>
          <h1 className="font-display font-900 text-display-md md:text-display-lg text-text tracking-tight">
            Classroom Overview
          </h1>
          <p className="text-muted text-base max-w-xl mt-2 leading-relaxed">
            Monitor student engagement, track XP milestones, and analyze lesson completion rates across your class.
          </p>
        </motion.div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="skeleton h-32" />
          ))}
        </div>
      ) : (
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Metric: Total Students */}
            <motion.div
              variants={fadeUp}
              className="card-glass p-6 flex items-center gap-5 hover:border-amber-400/30 transition-all duration-300 group"
            >
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
                <Users size={22} />
              </div>
              <div>
                <p className="text-subtle text-xs font-bold uppercase tracking-wider">Total Students</p>
                <h3 className="font-display font-900 text-3xl text-text mt-1">{totalStudents}</h3>
              </div>
            </motion.div>

            {/* Metric: Avg XP */}
            <motion.div
              variants={fadeUp}
              className="card-glass p-6 flex items-center gap-5 hover:border-amber-400/30 transition-all duration-300 group"
            >
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
                <Trophy size={22} />
              </div>
              <div>
                <p className="text-subtle text-xs font-bold uppercase tracking-wider">Class Avg XP</p>
                <h3 className="font-display font-900 text-3xl text-gradient-primary mt-1">
                  {avgXP.toLocaleString()}
                </h3>
              </div>
            </motion.div>

            {/* Metric: Avg Streak */}
            <motion.div
              variants={fadeUp}
              className="card-glass p-6 flex items-center gap-5 hover:border-amber-400/30 transition-all duration-300 group"
            >
              <div className="w-12 h-12 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400 group-hover:scale-110 transition-transform">
                <Flame size={22} />
              </div>
              <div>
                <p className="text-subtle text-xs font-bold uppercase tracking-wider">Avg Streak</p>
                <h3 className="font-display font-900 text-3xl text-orange-400 mt-1">{avgStreak}d</h3>
              </div>
            </motion.div>

            {/* Metric: Avg Lessons */}
            <motion.div
              variants={fadeUp}
              className="card-glass p-6 flex items-center gap-5 hover:border-amber-400/30 transition-all duration-300 group"
            >
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                <BookOpen size={22} />
              </div>
              <div>
                <p className="text-subtle text-xs font-bold uppercase tracking-wider">Avg Lessons Done</p>
                <h3 className="font-display font-900 text-3xl text-emerald-400 mt-1">{avgCompleted}</h3>
              </div>
            </motion.div>
          </div>

          {/* Primary Layout Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Student Level Distribution (Custom chart) */}
            <motion.div variants={fadeUp} className="card-glass p-6 lg:col-span-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-display font-800 text-lg text-text flex items-center gap-2">
                    <TrendingUp size={18} className="text-amber-400" />
                    Level Distribution
                  </h3>
                  <span className="text-xs text-subtle font-semibold">Student Counts</span>
                </div>
                <div className="space-y-4">
                  {levelDistribution.slice(0, 4).map((dist) => (
                    <div key={dist.level} className="space-y-1.5">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-muted">Level {dist.level}</span>
                        <span className="text-text">
                          {dist.count} {dist.count === 1 ? 'student' : 'students'} ({dist.percentage}%)
                        </span>
                      </div>
                      <div className="w-full bg-white/5 rounded-full h-2.5 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-amber-500 to-amber-300 rounded-full transition-all duration-1000"
                          style={{ width: `${dist.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                  {/* Level 5+ group */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-muted">Level 5+</span>
                      <span className="text-text">
                        {level5PlusCount} {level5PlusCount === 1 ? 'student' : 'students'} ({level5PlusPercentage}%)
                      </span>
                    </div>
                    <div className="w-full bg-white/5 rounded-full h-2.5 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-purple-500 to-secondary rounded-full transition-all duration-1000"
                        style={{ width: `${level5PlusPercentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-8 p-4 rounded-2xl bg-amber-500/5 border border-amber-500/10 flex items-center gap-3">
                <Award size={20} className="text-amber-400 flex-shrink-0" />
                <p className="text-xs text-muted leading-relaxed">
                  Most students are progressing steadily. Encourage lower-tier learners to boost streaks!
                </p>
              </div>
            </motion.div>

            {/* Top Students / Leaderboard Snapshot */}
            <motion.div variants={fadeUp} className="card-glass p-6 lg:col-span-2 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-display font-800 text-lg text-text flex items-center gap-2">
                    <Activity size={18} className="text-purple-400" />
                    Top Active Learners
                  </h3>
                  <button
                    onClick={() => navigate('/teacher/students')}
                    className="text-xs text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 group/btn"
                  >
                    View Roster
                    <ArrowRight size={14} className="group-hover/btn:translate-x-0.5 transition-transform" />
                  </button>
                </div>

                {totalStudents === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <p className="text-subtle text-sm">No students registered in the system yet.</p>
                  </div>
                ) : (
                  <div className="divide-y divide-white/5">
                    {activeStudents.map((student, idx) => (
                      <div key={student.id} className="py-3.5 flex items-center justify-between first:pt-0 last:pb-0">
                        <div className="flex items-center gap-4 min-w-0">
                          {/* Rank indicator */}
                          <span className="font-display font-900 text-sm text-subtle w-4">
                            {idx + 1}
                          </span>
                          {/* Avatar representation */}
                          <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 font-display font-800 text-sm flex-shrink-0">
                            {student.displayName.charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <p className="font-display font-700 text-sm text-text truncate">
                              {student.displayName}
                            </p>
                            <p className="text-xs text-subtle truncate">{student.email}</p>
                          </div>
                        </div>

                        {/* Student quick stats */}
                        <div className="flex items-center gap-6 flex-shrink-0">
                          <div className="text-right hidden sm:block">
                            <span className="inline-flex items-center gap-0.5 text-xs text-orange-400">
                              <Flame size={12} />
                              {student.streak}d streak
                            </span>
                            <p className="text-[10px] text-subtle mt-0.5">Level {student.level}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-display font-900 text-sm text-gradient-primary">
                              {student.xp.toLocaleString()}
                            </p>
                            <p className="text-[10px] text-subtle">XP</p>
                          </div>
                          <button
                            onClick={() => navigate(`/teacher/progress?studentId=${student.id}`)}
                            className="p-1.5 rounded-lg hover:bg-white/5 text-subtle hover:text-amber-400 transition-all"
                            aria-label={`View progress for ${student.displayName}`}
                          >
                            <ArrowRight size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
