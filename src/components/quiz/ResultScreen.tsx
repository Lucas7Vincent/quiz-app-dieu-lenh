'use client';

import { motion } from 'framer-motion';
import { Trophy, RotateCcw, Home, CheckCircle2, XCircle, Clock, Dices } from 'lucide-react';
import Link from 'next/link';
import { formatTime, getScoreLabel, getScoreColor } from '@/lib/utils';
import type { QuizResult } from '@/hooks/useQuiz';

interface ResultScreenProps {
  result: QuizResult;
  onRetry: () => void;
  onNewQuiz?: () => void;
  mode?: string;
}

export function ResultScreen({ result, onRetry, onNewQuiz, mode }: ResultScreenProps) {
  const percentage = Math.round((result.correctCount / result.totalQuestions) * 100);
  const label = getScoreLabel(percentage);
  const color = getScoreColor(percentage);
  const wrongCount = result.totalQuestions - result.correctCount;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="flex flex-col items-center gap-8 py-12 px-4 max-w-lg mx-auto"
    >
      {/* Trophy */}
      <motion.div
        initial={{ scale: 0, rotate: -20 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
        className="relative"
      >
        <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-2xl shadow-amber-500/30">
          <Trophy size={44} className="text-white" />
        </div>
        {percentage >= 90 && (
          <motion.div
            className="absolute -inset-2 rounded-3xl border-2 border-amber-400/50"
            animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}
      </motion.div>

      {/* Score */}
      <div className="text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <p className={`text-6xl font-bold ${color}`}>{percentage}%</p>
          <p className="text-xl font-semibold text-foreground mt-1">{label}</p>
          <p className="text-sm text-muted-foreground mt-1">
            {result.correctCount}/{result.totalQuestions} câu đúng
          </p>
        </motion.div>
      </div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="w-full grid grid-cols-3 gap-3"
      >
        {[
          { icon: CheckCircle2, label: 'Đúng', value: result.correctCount, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
          { icon: XCircle, label: 'Sai', value: wrongCount, color: 'text-red-500', bg: 'bg-red-500/10' },
          { icon: Clock, label: 'Thời gian', value: formatTime(result.timeTaken), color: 'text-blue-500', bg: 'bg-blue-500/10' },
        ].map(({ icon: Icon, label, value, color: c, bg }) => (
          <div key={label} className={`${bg} rounded-2xl p-3 text-center`}>
            <Icon className={`${c} mx-auto mb-1`} size={20} />
            <p className={`text-lg font-bold ${c}`}>{value}</p>
            <p className="text-xs text-muted-foreground">{label}</p>
          </div>
        ))}
      </motion.div>

      {/* Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="flex flex-col gap-3 w-full"
      >
        <div className="flex gap-3 w-full">
          <button
            onClick={onRetry}
            className="flex-1 flex items-center justify-center gap-2 py-3 px-5 rounded-2xl bg-primary text-white font-semibold text-sm hover:bg-primary/90 transition-colors"
          >
            <RotateCcw size={16} />
            Làm lại
          </button>
          <Link
            href="/"
            className="flex-1 flex items-center justify-center gap-2 py-3 px-5 rounded-2xl bg-secondary text-foreground font-semibold text-sm hover:bg-accent transition-colors"
          >
            <Home size={16} />
            Trang chủ
          </Link>
        </div>
        {onNewQuiz && (
          <button
            onClick={onNewQuiz}
            className="w-full flex items-center justify-center gap-2 py-3 px-5 rounded-2xl bg-gradient-to-r from-violet-500 to-purple-600 text-white font-semibold text-sm hover:opacity-90 transition-all shadow-lg shadow-violet-500/20"
          >
            <Dices size={16} />
            Đề mới
          </button>
        )}
      </motion.div>
    </motion.div>
  );
}
