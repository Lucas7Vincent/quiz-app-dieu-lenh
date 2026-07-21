'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dices, ArrowLeft, RefreshCw, Info } from 'lucide-react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { QuestionCard } from '@/components/quiz/QuestionCard';
import { ProgressBar } from '@/components/quiz/ProgressBar';
import { ResultScreen } from '@/components/quiz/ResultScreen';
import { useQuiz, type QuizResult } from '@/hooks/useQuiz';
import { useStopwatch } from '@/hooks/useTimer';
import { useProgress } from '@/store/progressStore';
import {
  selectRandomQuizQuestions,
  getPoolProgress,
  resetRandomQuizPool,
} from '@/lib/randomQuizPool';
import { formatTime } from '@/lib/utils';
import type { Question } from '@/types';

const QUESTIONS_PER_QUIZ = 10;

export default function RandomQuizPage() {
  const { completeSession } = useProgress();
  const [started, setStarted] = useState(false);
  const [result, setResult] = useState<QuizResult | null>(null);
  const [quizKey, setQuizKey] = useState(0);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [poolInfo, setPoolInfo] = useState(() => getPoolProgress());

  const stopwatch = useStopwatch(false);

  const refreshPoolInfo = useCallback(() => {
    setPoolInfo(getPoolProgress());
  }, []);

  const handleComplete = useCallback(
    (r: QuizResult) => {
      stopwatch.pause();
      setResult(r);

      const categoryBreakdown: Record<string, { total: number; correct: number }> = {};
      questions.forEach((q) => {
        if (!categoryBreakdown[q.category]) {
          categoryBreakdown[q.category] = { total: 0, correct: 0 };
        }
        categoryBreakdown[q.category].total++;
        const ans = r.answers[q.id];
        if (ans?.isCorrect) categoryBreakdown[q.category].correct++;
      });

      completeSession({
        mode: 'random',
        date: new Date().toISOString(),
        totalQuestions: r.totalQuestions,
        correctCount: r.correctCount,
        timeTaken: r.timeTaken,
        categoryBreakdown,
      });

      // Refresh pool info after completing
      refreshPoolInfo();
    },
    [questions, completeSession, stopwatch, refreshPoolInfo]
  );

  const quiz = useQuiz({
    questions,
    mode: 'study',
    onComplete: handleComplete,
  });

  const handleStart = useCallback(() => {
    const selected = selectRandomQuizQuestions(QUESTIONS_PER_QUIZ);
    setQuestions(selected);
    setQuizKey((k) => k + 1);
    setResult(null);
    setStarted(true);
    stopwatch.reset();
    stopwatch.resume();
    refreshPoolInfo();
  }, [stopwatch, refreshPoolInfo]);

  const handleRetry = useCallback(() => {
    // Replay the same set of questions (no new pool selection)
    quiz.reset();
    setQuizKey((k) => k + 1);
    setResult(null);
    stopwatch.reset();
    stopwatch.resume();
  }, [stopwatch, quiz]);

  const handleNewQuiz = useCallback(() => {
    const selected = selectRandomQuizQuestions(QUESTIONS_PER_QUIZ);
    setQuestions(selected);
    quiz.reset();
    setQuizKey((k) => k + 1);
    setResult(null);
    stopwatch.reset();
    stopwatch.resume();
    refreshPoolInfo();
  }, [stopwatch, refreshPoolInfo, quiz]);

  const handleResetPool = useCallback(() => {
    resetRandomQuizPool();
    refreshPoolInfo();
  }, [refreshPoolInfo]);

  // ── SETUP SCREEN ─────────────────────────────────────────────────────────
  if (!started) {
    const progressPct =
      poolInfo.totalQuestions > 0
        ? Math.round((poolInfo.usedCount / poolInfo.totalQuestions) * 100)
        : 0;

    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-xl mx-auto px-4 py-12 flex flex-col items-center gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center mx-auto mb-5 shadow-xl shadow-violet-500/30">
              <Dices size={36} className="text-white" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Đề ngẫu nhiên</h1>
            <p className="text-muted-foreground">
              10 câu hỏi ngẫu nhiên · Không lặp lại cho tới khi hết 100 câu
            </p>
          </motion.div>

          {/* Pool progress */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="w-full glass-card rounded-3xl p-6"
          >
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold text-foreground text-sm">Tiến độ vòng hiện tại</h2>
              <span className="text-xs text-muted-foreground">
                {poolInfo.usedCount}/{poolInfo.totalQuestions} câu đã ra
              </span>
            </div>
            <ProgressBar value={progressPct} size="lg" color="purple" />
            <div className="flex items-center justify-between mt-3">
              <p className="text-xs text-muted-foreground">
                Còn lại: <span className="font-semibold text-foreground">{poolInfo.remainingCount}</span> câu
              </p>
              <p className="text-xs text-muted-foreground">
                Đã duyệt: <span className="font-semibold text-foreground">{progressPct}%</span>
              </p>
            </div>
          </motion.div>

          {/* How it works */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="w-full glass-card rounded-3xl p-5"
          >
            <p className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
              <Info size={14} className="text-violet-500" /> Cách hoạt động
            </p>
            <div className="space-y-2">
              {[
                'Mỗi đề gồm 10 câu hỏi ngẫu nhiên',
                'Các câu không lặp lại giữa các đề',
                `Sau khi duyệt hết ${poolInfo.totalQuestions} câu, sẽ bắt đầu vòng mới`,
                'Có thể xem đáp án sau khi trả lời',
              ].map((rule) => (
                <div key={rule} className="flex items-center gap-2.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-violet-500 shrink-0" />
                  <p className="text-sm text-muted-foreground">{rule}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Action buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="w-full flex flex-col gap-3"
          >
            <button
              onClick={handleStart}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-violet-500 to-purple-600 text-white font-bold text-base shadow-xl shadow-violet-500/30 hover:opacity-90 transition-all active:scale-[0.98]"
            >
              Bắt đầu đề ngẫu nhiên →
            </button>

            {poolInfo.usedCount > 0 && (
              <button
                onClick={handleResetPool}
                className="w-full py-3 rounded-2xl bg-secondary text-muted-foreground font-semibold text-sm hover:bg-accent transition-colors flex items-center justify-center gap-2"
              >
                <RefreshCw size={14} />
                Đặt lại vòng (bắt đầu lại từ đầu)
              </button>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25 }}
          >
            <Link
              href="/"
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft size={14} />
              Về trang chủ
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  // ── RESULT SCREEN ────────────────────────────────────────────────────────
  if (result) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-xl mx-auto px-4 py-4">
          {/* Pool progress after quiz */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card rounded-2xl p-4 mb-4"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-muted-foreground">Vòng hiện tại</span>
              <span className="text-xs text-muted-foreground">
                {poolInfo.usedCount}/{poolInfo.totalQuestions} câu đã ra
              </span>
            </div>
            <ProgressBar
              value={
                poolInfo.totalQuestions > 0
                  ? Math.round((poolInfo.usedCount / poolInfo.totalQuestions) * 100)
                  : 0
              }
              color="purple"
            />
            {poolInfo.remainingCount === 0 && (
              <p className="text-xs text-violet-500 font-semibold mt-2 text-center">
                🎉 Đã duyệt hết tất cả câu hỏi! Đề tiếp theo sẽ bắt đầu vòng mới.
              </p>
            )}
          </motion.div>
        </div>
        <ResultScreen result={result} onRetry={handleRetry} onNewQuiz={handleNewQuiz} />
      </div>
    );
  }

  // ── QUIZ SCREEN ──────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="sticky top-[57px] z-30 border-b border-border/30 bg-background/80 backdrop-blur-sm">
        <div className="max-w-3xl mx-auto px-4 py-2.5 flex items-center gap-4">
          <Link
            href="/"
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft size={14} />
          </Link>
          <ProgressBar value={quiz.progress} className="flex-1" color="purple" />
          <span className="text-xs font-semibold text-muted-foreground whitespace-nowrap">
            {quiz.currentIndex + 1}/{quiz.totalQuestions}
          </span>
          <span className="text-xs text-muted-foreground font-mono tabular-nums">
            {formatTime(stopwatch.seconds)}
          </span>
        </div>
      </div>

      <div key={quizKey} className="max-w-3xl mx-auto px-4 py-6">
        <AnimatePresence mode="wait">
          <QuestionCard
            key={quiz.currentQuestion?.id}
            question={quiz.currentQuestion!}
            questionNumber={quiz.currentIndex + 1}
            totalQuestions={quiz.totalQuestions}
            answerState={quiz.answerState}
            onSelectAnswer={quiz.selectAnswer}
            onConfirm={quiz.confirmAnswer}
            onNext={quiz.nextQuestion}
            isLastQuestion={quiz.isLastQuestion}
          />
        </AnimatePresence>
      </div>
    </div>
  );
}
