// ============================================================
// SIGNAVERSE — Students Roster Page
// ============================================================

import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  ArrowUpDown,
  Flame,
  Zap,
  GraduationCap,
  Calendar,
  ChevronRight,
  BookCheck,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { teacherApi } from '../../services/api/teacherApi';
import { fadeUp, staggerContainer } from '../../utils/motion';

type SortField = 'displayName' | 'xp' | 'streak' | 'completedLessonsCount' | 'createdAt';
type SortOrder = 'asc' | 'desc';

export function StudentsPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState<SortField>('xp');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  const { data: students, isLoading } = useQuery({
    queryKey: ['teacherStudents'],
    queryFn: teacherApi.getStudents,
  });

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc'); // Default to descending for numbers/date
    }
  };

  // Filter students based on search query
  const filteredStudents = students
    ? students.filter(
        (s) =>
          s.displayName.toLowerCase().includes(search.toLowerCase()) ||
          s.email.toLowerCase().includes(search.toLowerCase())
      )
    : [];

  // Sort students
  const sortedStudents = [...filteredStudents].sort((a, b) => {
    let valA = a[sortField];
    let valB = b[sortField];

    if (typeof valA === 'string' && typeof valB === 'string') {
      return sortOrder === 'asc'
        ? valA.localeCompare(valB)
        : valB.localeCompare(valA);
    }

    // Number or Date sorts
    const numA = typeof valA === 'string' ? new Date(valA).getTime() : (valA as number);
    const numB = typeof valB === 'string' ? new Date(valB).getTime() : (valB as number);

    return sortOrder === 'asc' ? numA - numB : numB - numA;
  });

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div>
        <h1 className="font-display font-900 text-display-md text-text">Students Roster</h1>
        <p className="text-muted text-sm mt-1">Manage and track student progress, engagement, and scores.</p>
      </div>

      {/* Roster actions / controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        {/* Search */}
        <div className="relative w-full sm:max-w-md">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-subtle" />
          <input
            type="text"
            placeholder="Search by student name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input pl-11"
          />
        </div>

        {/* Count info */}
        <div className="text-sm text-subtle font-semibold whitespace-nowrap">
          Showing {sortedStudents.length} of {students?.length || 0} students
        </div>
      </div>

      {/* Roster table/cards */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="skeleton h-20" />
          ))}
        </div>
      ) : sortedStudents.length === 0 ? (
        <div className="card-glass p-12 text-center flex flex-col items-center justify-center">
          <GraduationCap size={48} className="text-subtle mb-4" />
          <h3 className="font-display font-800 text-lg text-text">No students found</h3>
          <p className="text-muted text-sm mt-1 max-w-sm">
            Try adjusting your search criteria or register a new student account to see them here.
          </p>
        </div>
      ) : (
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="card overflow-hidden"
        >
          {/* Table Header for Desktop */}
          <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-4 bg-white/5 border-b border-white/5 font-display font-800 text-xs text-subtle tracking-wider uppercase">
            <div
              className="col-span-4 flex items-center gap-1.5 cursor-pointer hover:text-text transition-colors"
              onClick={() => toggleSort('displayName')}
            >
              Student Name
              <ArrowUpDown size={12} />
            </div>
            <div
              className="col-span-2 flex items-center gap-1.5 cursor-pointer hover:text-text transition-colors justify-end"
              onClick={() => toggleSort('xp')}
            >
              XP Score
              <ArrowUpDown size={12} />
            </div>
            <div
              className="col-span-2 flex items-center gap-1.5 cursor-pointer hover:text-text transition-colors justify-end"
              onClick={() => toggleSort('streak')}
            >
              Streak
              <ArrowUpDown size={12} />
            </div>
            <div
              className="col-span-2 flex items-center gap-1.5 cursor-pointer hover:text-text transition-colors justify-end"
              onClick={() => toggleSort('completedLessonsCount')}
            >
              Lessons Done
              <ArrowUpDown size={12} />
            </div>
            <div
              className="col-span-2 flex items-center gap-1.5 cursor-pointer hover:text-text transition-colors justify-end"
              onClick={() => toggleSort('createdAt')}
            >
              Joined
              <ArrowUpDown size={12} />
            </div>
          </div>

          {/* Student rows */}
          <div className="divide-y divide-white/5">
            {sortedStudents.map((student) => (
              <motion.div
                key={student.id}
                variants={fadeUp}
                onClick={() => navigate(`/teacher/progress?studentId=${student.id}`)}
                className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center px-6 py-5 hover:bg-white/5 transition-all duration-200 cursor-pointer group"
              >
                {/* Profile Snapshot */}
                <div className="col-span-1 md:col-span-4 flex items-center gap-4 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 font-display font-900 text-sm flex-shrink-0">
                    {student.displayName.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="font-display font-800 text-sm text-text group-hover:text-amber-400 transition-colors truncate">
                      {student.displayName}
                    </p>
                    <p className="text-xs text-subtle truncate">{student.email}</p>
                  </div>
                </div>

                {/* Level & XP */}
                <div className="col-span-1 md:col-span-2 flex md:flex-col items-center md:items-end justify-between md:justify-center">
                  <span className="md:hidden text-xs text-subtle font-semibold">XP Score</span>
                  <div className="text-right">
                    <span className="font-display font-900 text-sm text-gradient-primary">
                      {student.xp.toLocaleString()}
                    </span>
                    <span className="inline-flex items-center gap-0.5 ml-2 md:ml-0 md:block text-[10px] text-subtle font-bold">
                      <Zap size={10} className="inline mr-0.5 text-purple-400" />
                      Level {student.level}
                    </span>
                  </div>
                </div>

                {/* Streak */}
                <div className="col-span-1 md:col-span-2 flex md:flex-col items-center md:items-end justify-between md:justify-center">
                  <span className="md:hidden text-xs text-subtle font-semibold">Streak</span>
                  <div className="text-right flex items-center gap-1">
                    <Flame size={14} className="text-orange-500" />
                    <span className="font-display font-800 text-sm text-orange-400">
                      {student.streak} days
                    </span>
                  </div>
                </div>

                {/* Completed Lessons count */}
                <div className="col-span-1 md:col-span-2 flex md:flex-col items-center md:items-end justify-between md:justify-center">
                  <span className="md:hidden text-xs text-subtle font-semibold">Lessons Completed</span>
                  <div className="text-right flex items-center gap-1.5">
                    <BookCheck size={14} className="text-emerald-500" />
                    <span className="font-display font-800 text-sm text-emerald-400">
                      {student.completedLessonsCount} completed
                    </span>
                  </div>
                </div>

                {/* Join Date & Action */}
                <div className="col-span-1 md:col-span-2 flex md:flex-col items-center md:items-end justify-between md:justify-center">
                  <span className="md:hidden text-xs text-subtle font-semibold">Joined</span>
                  <div className="flex items-center gap-3">
                    <div className="text-right hidden md:block">
                      <span className="inline-flex items-center gap-1 text-xs text-subtle">
                        <Calendar size={12} />
                        {new Date(student.createdAt).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                    {/* View report indicator */}
                    <ChevronRight
                      size={16}
                      className="text-subtle group-hover:text-amber-400 group-hover:translate-x-1 transition-all"
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
