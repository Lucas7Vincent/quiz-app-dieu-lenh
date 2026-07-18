'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  BookOpen, Zap, CreditCard, BarChart3, Search,
  RotateCcw, Target, Trophy, Flame, Clock
} from 'lucide-react';
import { useProgress } from '@/store/progressStore';
import { Header } from '@/components/layout/Header';
import { ProgressBar } from '@/components/quiz/ProgressBar';
import { getCompletionPercent, getWrongQuestionIds, computeCategoryStats } from '@/lib/questionEngine';
import { questions } from '@/data';
import { formatTime } from '@/lib/utils';

const stagger = {
  container: { transition: { staggerChildren: 0.07 } },
  item: { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } },
};

interface ModeCardProps {
  href: string;
  icon: React.ElementType;
  title: string;
  description: string;
  gradient: string;
  badge?: string;
}

function ModeCard({ href, icon: Icon, title, description, gradient, badge }: ModeCardProps) {
  return (
    <Link href={href}>
      <motion.div
        variants={stagger.item}
        whileHover={{ scale: 1.03, y: -4 }}
        whileTap={{ scale: 0.97 }}
        className="glass-card rounded-3xl p-5 cursor-pointer group relative overflow-hidden"
      >
        {/* Gradient background */}
        <div
          className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${gradient}`}
        />
        <div className="relative z-10">
          {badge && (
            <span className="absolute top-0 right-0 text-[10px] font-bold px-2 py-0.5 bg-primary/20 text-primary rounded-bl-xl rounded-tr-2xl">
              {badge}
            </span>
          )}
          <div className="w-12 h-12 rounded-2xl bg-primary/15 group-hover:bg-primary/25 flex items-center justify-center mb-3 transition-colors">
            <Icon size={22} className="text-primary" />
          </div>
          <h3 className="font-bold text-base text-foreground mb-1">{title}</h3>
          <p className="text-sm text-muted-foreground leading-snug">{description}</p>
        </div>
      </motion.div>
    </Link>
  );
}

export default function HomePage() {
  const { progress } = useProgress();
  const completionPct = getCompletionPercent(progress);
  const wrongIds = getWrongQuestionIds(progress);
  const categoryStats = computeCategoryStats(progress);
  const totalAttempted = Object.values(progress.questionProgress).filter(
    (p) => p.attempts > 0
  ).length;
  const totalCorrect = Object.values(progress.questionProgress).reduce(
    (s, p) => s + p.correct, 0
  );
  const accuracy = totalAttempted > 0
    ? Math.round((totalCorrect / Object.values(progress.questionProgress).reduce((s, p) => s + p.attempts, 0)) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-4"
          >
            <Target size={14} className="text-primary" />
            <span className="text-xs font-semibold text-primary">100 Câu Hỏi Trắc Nghiệm</span>
          </motion.div>

          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            <span className="text-gradient">Lý Thuyết Điều Lệnh</span>
          </h1>
          <p className="text-muted-foreground text-base max-w-md mx-auto">
            Ôn thi điều lệnh CAND 2026 · Thông tư 34, 35, 36, 04, 32
          </p>
        </motion.div>

        {/* Progress card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card rounded-3xl p-6 mb-6 shadow-xl shadow-primary/5"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm font-semibold text-foreground">Tiến độ học</p>
              <p className="text-xs text-muted-foreground">{totalAttempted}/{questions.length} câu đã làm</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-gradient">{completionPct}%</p>
              <p className="text-xs text-muted-foreground">hoàn thành</p>
            </div>
          </div>
          <ProgressBar value={completionPct} size="lg" />

          {/* Mini stats */}
          <div className="grid grid-cols-4 gap-3 mt-4">
            {[
              { icon: Trophy, label: 'Đúng', value: totalCorrect, color: 'text-emerald-500' },
              { icon: Target, label: 'Tỷ lệ', value: `${accuracy}%`, color: 'text-blue-500' },
              { icon: Flame, label: 'Streak', value: `${progress.streak}d`, color: 'text-orange-500' },
              { icon: Clock, label: 'Giờ học', value: formatTime(progress.totalStudyTime), color: 'text-purple-500' },
            ].map(({ icon: Icon, label, value, color }) => (
              <div key={label} className="text-center">
                <Icon size={16} className={`${color} mx-auto mb-1`} />
                <p className={`text-sm font-bold ${color}`}>{value}</p>
                <p className="text-xs text-muted-foreground">{label}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Mode cards */}
        <motion.div
          variants={stagger.container}
          initial="initial"
          animate="animate"
          className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6"
        >
          <ModeCard
            href="/study?mode=sequential"
            icon={BookOpen}
            title="Học tuần tự"
            description="Học từng câu theo thứ tự từ 1-100"
            gradient="bg-gradient-to-br from-blue-500/10 to-indigo-500/10"
          />
          <ModeCard
            href="/study?mode=random"
            icon={RotateCcw}
            title="Học ngẫu nhiên"
            description="Xáo trộn câu hỏi để luyện tập tốt hơn"
            gradient="bg-gradient-to-br from-purple-500/10 to-pink-500/10"
          />
          <ModeCard
            href="/exam"
            icon={Zap}
            title="Thi thử"
            description="100 câu · 90 phút · Không xem đáp án"
            gradient="bg-gradient-to-br from-amber-500/10 to-orange-500/10"
            badge="HOT"
          />
          <ModeCard
            href="/flashcard"
            icon={CreditCard}
            title="Flashcard"
            description="Lật thẻ học như Anki - nhớ lâu hơn"
            gradient="bg-gradient-to-br from-teal-500/10 to-cyan-500/10"
          />
          <ModeCard
            href={`/study?mode=review`}
            icon={Target}
            title="Ôn câu sai"
            description={`${wrongIds.length} câu cần ôn lại`}
            gradient="bg-gradient-to-br from-red-500/10 to-rose-500/10"
          />
          <ModeCard
            href="/stats"
            icon={BarChart3}
            title="Thống kê"
            description="Phân tích chi tiết theo Thông tư"
            gradient="bg-gradient-to-br from-green-500/10 to-emerald-500/10"
          />
        </motion.div>

        {/* Search shortcut */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Link href="/search">
            <motion.div
              whileHover={{ scale: 1.01 }}
              className="glass-card rounded-2xl px-5 py-3.5 flex items-center gap-3 cursor-pointer hover:border-primary/30 transition-colors"
            >
              <Search size={18} className="text-muted-foreground" />
              <span className="text-sm text-muted-foreground flex-1">Tìm kiếm câu hỏi...</span>
              <kbd className="text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded">
                Tìm kiếm
              </kbd>
            </motion.div>
          </Link>
        </motion.div>
      </main>
    </div>
  );
}
