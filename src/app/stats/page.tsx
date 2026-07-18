'use client';

import { motion } from 'framer-motion';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from 'recharts';
import { Header } from '@/components/layout/Header';
import { ProgressBar } from '@/components/quiz/ProgressBar';
import { useProgress } from '@/store/progressStore';
import { computeCategoryStats, getCompletionPercent } from '@/lib/questionEngine';
import { questions } from '@/data';
import { formatTime, getScoreColor } from '@/lib/utils';
import { Trophy, Target, Clock, Flame, TrendingUp, TrendingDown } from 'lucide-react';

const COLORS = ['#2563EB', '#7C3AED', '#0D9488', '#D97706', '#E11D48', '#64748B'];

export default function StatsPage() {
  const { progress } = useProgress();
  const categoryStats = computeCategoryStats(progress);
  const completionPct = getCompletionPercent(progress);

  const totalAttempts = Object.values(progress.questionProgress).reduce(
    (s, p) => s + p.attempts, 0
  );
  const totalCorrect = Object.values(progress.questionProgress).reduce(
    (s, p) => s + p.correct, 0
  );
  const overallAccuracy = totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : 0;
  const recentSessions = progress.studySessions.slice(0, 5);

  const best = [...categoryStats].sort((a, b) => b.accuracy - a.accuracy)[0];
  const worst = [...categoryStats].sort((a, b) => a.accuracy - b.accuracy)[0];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-5xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-2xl font-bold text-foreground mb-1">Thống kê học tập</h1>
          <p className="text-muted-foreground text-sm">Phân tích chi tiết tiến độ của bạn</p>
        </motion.div>

        {/* Summary cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6"
        >
          {[
            { icon: Trophy, label: 'Tỷ lệ đúng', value: `${overallAccuracy}%`, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
            { icon: Target, label: 'Hoàn thành', value: `${completionPct}%`, color: 'text-blue-500', bg: 'bg-blue-500/10' },
            { icon: Flame, label: 'Chuỗi ngày', value: `${progress.streak}d`, color: 'text-orange-500', bg: 'bg-orange-500/10' },
            { icon: Clock, label: 'Tổng giờ', value: formatTime(progress.totalStudyTime), color: 'text-purple-500', bg: 'bg-purple-500/10' },
          ].map(({ icon: Icon, label, value, color, bg }) => (
            <div key={label} className={`${bg} rounded-2xl p-4`}>
              <Icon className={`${color} mb-2`} size={20} />
              <p className={`text-xl font-bold ${color}`}>{value}</p>
              <p className="text-xs text-muted-foreground">{label}</p>
            </div>
          ))}
        </motion.div>

        {/* Overall progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="glass-card rounded-3xl p-5 mb-6"
        >
          <div className="flex justify-between items-center mb-3">
            <p className="font-semibold text-foreground text-sm">Tiến độ tổng thể</p>
            <p className="text-sm text-muted-foreground">{Object.values(progress.questionProgress).filter(p => p.attempts > 0).length}/{questions.length} câu</p>
          </div>
          <ProgressBar value={completionPct} size="lg" showLabel />
        </motion.div>

        {/* Category bar chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card rounded-3xl p-5 mb-6"
        >
          <p className="font-semibold text-foreground text-sm mb-4">Tỷ lệ đúng theo Thông tư</p>
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryStats} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(100,116,139,0.15)" />
                <XAxis
                  dataKey="category"
                  tick={{ fontSize: 10, fill: 'rgb(100,116,139)' }}
                  tickFormatter={(v) => v.replace('Thông tư ', 'TT')}
                />
                <YAxis tick={{ fontSize: 10, fill: 'rgb(100,116,139)' }} domain={[0, 100]} />
                <Tooltip
                  contentStyle={{
                    background: 'rgb(30 41 59)',
                    border: '1px solid rgb(51 65 85)',
                    borderRadius: '12px',
                    fontSize: '12px',
                  }}
                  formatter={(v: unknown) => [`${v}%`, 'Tỷ lệ đúng']}
                />
                <Bar dataKey="accuracy" radius={[6, 6, 0, 0]}>
                  {categoryStats.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Best/Worst + Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="grid md:grid-cols-2 gap-4 mb-6"
        >
          {/* Best and worst */}
          <div className="glass-card rounded-3xl p-5">
            <p className="font-semibold text-foreground text-sm mb-4">Điểm nổi bật</p>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-emerald-500/10">
                <TrendingUp size={18} className="text-emerald-500" />
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">Mạnh nhất</p>
                  <p className="text-sm font-semibold text-foreground">{best?.category ?? 'N/A'}</p>
                </div>
                <span className="text-sm font-bold text-emerald-500">{best?.accuracy ?? 0}%</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-red-500/10">
                <TrendingDown size={18} className="text-red-500" />
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">Yếu nhất</p>
                  <p className="text-sm font-semibold text-foreground">{worst?.category ?? 'N/A'}</p>
                </div>
                <span className="text-sm font-bold text-red-500">{worst?.accuracy ?? 0}%</span>
              </div>
            </div>
          </div>

          {/* Category distribution pie */}
          <div className="glass-card rounded-3xl p-5">
            <p className="font-semibold text-foreground text-sm mb-2">Phân bổ câu hỏi</p>
            <div className="h-[160px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryStats}
                    dataKey="total"
                    nameKey="category"
                    cx="50%"
                    cy="50%"
                    outerRadius={70}
                    innerRadius={35}
                  >
                    {categoryStats.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: 'rgb(30 41 59)',
                      border: '1px solid rgb(51 65 85)',
                      borderRadius: '12px',
                      fontSize: '11px',
                    }}
                    formatter={(v: unknown, name: unknown) => [v as number, name as string]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </motion.div>

        {/* Category detail table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card rounded-3xl p-5 mb-6"
        >
          <p className="font-semibold text-foreground text-sm mb-4">Chi tiết theo Thông tư</p>
          <div className="space-y-3">
            {categoryStats.map((stat, i) => (
              <div key={stat.category} className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-foreground">{stat.category}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground">
                      {stat.correct}/{stat.attempted}
                    </span>
                    <span
                      className={`text-xs font-bold ${getScoreColor(stat.accuracy)}`}
                    >
                      {stat.accuracy}%
                    </span>
                  </div>
                </div>
                <ProgressBar
                  value={stat.accuracy}
                  size="sm"
                  color={
                    stat.accuracy >= 80 ? 'green' :
                    stat.accuracy >= 60 ? 'blue' :
                    stat.accuracy >= 40 ? 'amber' : 'red'
                  }
                />
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recent sessions */}
        {recentSessions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="glass-card rounded-3xl p-5"
          >
            <p className="font-semibold text-foreground text-sm mb-4">Phiên học gần đây</p>
            <div className="space-y-2">
              {recentSessions.map((session) => {
                const pct = Math.round((session.correctCount / session.totalQuestions) * 100);
                return (
                  <div
                    key={session.id}
                    className="flex items-center gap-3 p-3 rounded-2xl bg-secondary/50"
                  >
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold ${getScoreColor(pct)} bg-current/10`}>
                      {pct}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-foreground truncate">
                        {session.mode === 'exam' ? 'Thi thử' : session.mode === 'review' ? 'Ôn câu sai' : 'Học'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {session.correctCount}/{session.totalQuestions} đúng · {formatTime(session.timeTaken)}
                      </p>
                    </div>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {new Date(session.date).toLocaleDateString('vi-VN')}
                    </span>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}
