// ============================================================
// SIGNAVERSE — Detailed Progress Page
// ============================================================

import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  GraduationCap,
  Flame,
  CheckCircle2,
  Calendar,
  Lock,
} from 'lucide-react';
import { teacherApi } from '../../services/api/teacherApi';
import { fadeUp, staggerContainer } from '../../utils/motion';

export function ProgressPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const studentId = searchParams.get('studentId') || '';

  // Fetch all students for the dropdown
  const { data: students, isLoading: loadingStudents } = useQuery({
    queryKey: ['teacherStudents'],
    queryFn: teacherApi.getStudents,
  });

  // Fetch student detailed progress
  const { data: progress, isLoading: loadingProgress } = useQuery({
    queryKey: ['studentProgressDetail', studentId],
    queryFn: () => teacherApi.getStudentProgress(studentId),
    enabled: !!studentId,
  });

  const handleStudentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (val) {
      setSearchParams({ studentId: val });
    } else {
      setSearchParams({});
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-900 text-display-md text-text">Progress Reports</h1>
          <p className="text-muted text-sm mt-1">Detailed, lesson-by-lesson progress analysis for each student.</p>
        </div>

        {/* Student Selector */}
        <div className="w-full md:max-w-xs space-y-1.5">
          <label htmlFor="student-select" className="block text-xs font-bold text-subtle uppercase tracking-wider">
            Select Student
          </label>
          {loadingStudents ? (
            <div className="skeleton h-12" />
          ) : (
            <select
              id="student-select"
              value={studentId}
              onChange={handleStudentChange}
              className="input pr-10 cursor-pointer appearance-none bg-surface"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%239d8ec7' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                backgroundPosition: 'right 1rem center',
                backgroundSize: '1.25em 1.25em',
                backgroundRepeat: 'no-repeat',
              }}
            >
              <option value="">-- Choose a Student --</option>
              {students?.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.displayName} ({s.email})
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* Main progress details */}
      {!studentId ? (
        <div className="card-glass p-16 text-center flex flex-col items-center justify-center">
          <GraduationCap size={64} className="text-subtle mb-4 animate-bounce" />
          <h3 className="font-display font-800 text-lg text-text">Select a student above</h3>
          <p className="text-muted text-sm mt-1 max-w-sm">
            Choose a student from the dropdown menu to inspect their completed worlds, streak history, and accuracy rates.
          </p>
        </div>
      ) : loadingProgress ? (
        <div className="space-y-6">
          <div className="skeleton h-32" />
          <div className="skeleton h-64" />
        </div>
      ) : !progress ? (
        <div className="card-glass p-12 text-center text-error">
          <p className="font-semibold">Failed to load progress details for this student.</p>
        </div>
      ) : (
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          {/* Student Profile Card */}
          <motion.div variants={fadeUp} className="card-elevated p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 font-display font-900 text-xl">
                {progress.student.displayName.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 className="font-display font-900 text-xl text-text">{progress.student.displayName}</h3>
                <p className="text-sm text-subtle">{progress.student.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-8 border-t md:border-t-0 md:border-l border-white/5 pt-4 md:pt-0 md:pl-8">
              <div>
                <span className="text-subtle text-xs font-bold uppercase tracking-wider block">Level & XP</span>
                <div className="flex items-center gap-2 mt-1">
                  <span className="font-display font-950 text-gradient-primary text-xl">
                    {progress.student.xp.toLocaleString()} XP
                  </span>
                  <span className="badge badge-primary">Lv {progress.student.level}</span>
                </div>
              </div>

              <div>
                <span className="text-subtle text-xs font-bold uppercase tracking-wider block">Activity Streak</span>
                <div className="flex items-center gap-1.5 mt-1 text-orange-400">
                  <Flame size={18} />
                  <span className="font-display font-900 text-xl">{progress.student.streak} days</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Progress Breakdown title */}
          <div>
            <h3 className="font-display font-800 text-lg text-text">Worlds & Lessons Overview</h3>
            <p className="text-subtle text-xs mt-0.5">Click into any world to see lesson accomplishments.</p>
          </div>

          {/* Worlds iteration */}
          <div className="space-y-6">
            {progress.worlds.map((world) => {
              const completePercent = Math.round(world.progress.percentComplete * 100);
              return (
                <motion.div key={world.id} variants={fadeUp} className="card-glass p-6 space-y-6">
                  {/* World Overview banner */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/5">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{world.emoji}</span>
                      <div>
                        <h4 className="font-display font-800 text-base text-text">{world.name}</h4>
                        <p className="text-xs text-subtle">{world.description}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 sm:text-right shrink-0">
                      <div>
                        <p className="text-xs font-bold text-text">
                          {world.progress.completedLessons} / {world.progress.totalLessons} Lessons
                        </p>
                        <p className="text-[10px] text-subtle mt-0.5">({completePercent}% complete)</p>
                      </div>
                      <div className="w-16 h-16 rounded-full border-4 border-white/5 flex items-center justify-center relative">
                        {/* Circle overlay progress */}
                        <span className="font-display font-900 text-xs text-gradient-primary">
                          {completePercent}%
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Lessons list inside World */}
                  {world.lessons.length === 0 ? (
                    <p className="text-sm text-subtle text-center py-4">No lessons in this world.</p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {world.lessons.map((lesson) => {
                        const dateFormatted = lesson.completedAt
                          ? new Date(lesson.completedAt).toLocaleDateString(undefined, {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })
                          : '';

                        return (
                          <div
                            key={lesson.id}
                            className={`p-4 rounded-2xl flex items-start gap-3.5 transition-all ${
                              lesson.completed
                                ? 'bg-emerald-500/5 border border-emerald-500/20'
                                : 'bg-white/5 border border-white/5 opacity-60'
                            }`}
                          >
                            {/* Complete icon or locked */}
                            {lesson.completed ? (
                              <CheckCircle2 size={18} className="text-emerald-500 flex-shrink-0 mt-0.5" />
                            ) : (
                              <Lock size={16} className="text-subtle flex-shrink-0 mt-0.5" />
                            )}

                            <div className="flex-1 min-w-0">
                              <p className={`font-display font-800 text-sm truncate ${lesson.completed ? 'text-text' : 'text-muted'}`}>
                                {lesson.order}. {lesson.title}
                              </p>
                              <p className="text-xs text-subtle truncate mt-0.5">{lesson.description}</p>

                              {/* Progress metadata */}
                              {lesson.completed && (
                                <div className="flex flex-wrap items-center gap-3 mt-2.5 pt-2.5 border-t border-emerald-500/10">
                                  {lesson.accuracy !== null && (
                                    <span className="badge badge-success text-[10px] py-0 px-2 font-semibold">
                                      Accuracy: {Math.round(lesson.accuracy * 100)}%
                                    </span>
                                  )}
                                  {dateFormatted && (
                                    <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400/70 font-semibold">
                                      <Calendar size={10} />
                                      {dateFormatted}
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      )}
    </div>
  );
}
