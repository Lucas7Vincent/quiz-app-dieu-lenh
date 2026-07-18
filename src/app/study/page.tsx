'use client';

import { useState, useCallback, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Shuffle, List, Tag, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { QuestionCard } from '@/components/quiz/QuestionCard';
import { ProgressBar } from '@/components/quiz/ProgressBar';
import { ResultScreen } from '@/components/quiz/ResultScreen';
import { useQuiz, type QuizResult } from '@/hooks/useQuiz';
import { useStopwatch } from '@/hooks/useTimer';
import { selectQuestions } from '@/lib/questionEngine';
import { CATEGORIES } from '@/data';
import { useProgress } from '@/store/progressStore';
import { getWrongQuestionIds } from '@/lib/questionEngine';
import { Suspense } from 'react';
import { cn } from '@/lib/utils';
import { formatTime } from '@/lib/utils';
import type { Question } from '@/types';

function StudyContent() {
  const searchParams = useSearchParams();
  const mode = (searchParams.get('mode') ?? 'sequential') as 'sequential' | 'random' | 'review';
  const { progress, completeSession } = useProgress();
  const wrongIds = getWrongQuestionIds(progress);

  const [selectedCategory, setSelectedCategory] = useState('Tất cả');
  const [started, setStarted] = useState(false);
  const [result, setResult] = useState<QuizResult | null>(null);
  // Keep a stable key to force-remount useQuiz when retrying
  const [quizKey, setQuizKey] = useState(0);
  const [questionSet, setQuestionSet] = useState<Question[]>(() =>
    selectQuestions({
      mode: mode === 'review' ? 'review' : mode,
      category: selectedCategory === 'Tất cả' ? undefined : selectedCategory,
      wrongIds: mode === 'review' ? wrongIds : undefined,
    })
  );

  const stopwatch = useStopwatch(false);

  const handleComplete = useCallback(
    (r: QuizResult) => {
      stopwatch.pause();
      setResult(r);
      const categoryBreakdown: Record<string, { total: number; correct: number }> = {};
      questionSet.forEach((q) => {
        if (!categoryBreakdown[q.category]) {
          categoryBreakdown[q.category] = { total: 0, correct: 0 };
        }
        categoryBreakdown[q.category].total++;
        const ans = r.answers[q.id];
        if (ans?.isCorrect) categoryBreakdown[q.category].correct++;
      });

      completeSession({
        mode: mode === 'review' ? 'review' : mode,
        date: new Date().toISOString(),
        totalQuestions: r.totalQuestions,
        correctCount: r.correctCount,
        timeTaken: r.timeTaken,
        categoryBreakdown,
      });
    },
    [questionSet, mode, completeSession, stopwatch.pause]
  );

  const quiz = useQuiz({
    questions: questionSet,
    mode: 'study',
    onComplete: handleComplete,
  });

  const handleStart = useCallback(() => {
    const newSet = selectQuestions({
      mode: mode === 'review' ? 'review' : mode,
      category: selectedCategory === 'Tất cả' ? undefined : selectedCategory,
      wrongIds: mode === 'review' ? wrongIds : undefined,
    });
    setQuestionSet(newSet);
    setQuizKey((k) => k + 1);
    setResult(null);
    setStarted(true);
    stopwatch.reset();
    stopwatch.resume();
  }, [mode, selectedCategory, wrongIds, stopwatch.reset, stopwatch.resume]);

  const handleRetry = useCallback(() => {
    const newSet = selectQuestions({
      mode: mode === 'review' ? 'review' : mode,
      category: selectedCategory === 'Tất cả' ? undefined : selectedCategory,
      wrongIds: mode === 'review' ? wrongIds : undefined,
    });
    setQuestionSet(newSet);
    setQuizKey((k) => k + 1); // force remount of quiz
    setResult(null);
    stopwatch.resume();
  }, [mode, selectedCategory, wrongIds, stopwatch]);

  // ── SETUP SCREEN ─────────────────────────────────────────────────────────
  if (!started) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 flex flex-col items-center gap-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="w-16 h-16 rounded-3xl bg-primary/15 flex items-center justify-center mx-auto mb-4">
            {mode === 'random' ? (
              <Shuffle size={28} className="text-primary" />
            ) : (
              <List size={28} className="text-primary" />
            )}
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">
            {mode === 'sequential'
              ? 'Học tuần tự'
              : mode === 'random'
              ? 'Học ngẫu nhiên'
              : 'Ôn câu sai'}
          </h1>
          <p className="text-muted-foreground text-sm">Chọn Thông tư và bắt đầu học</p>
        </motion.div>

        {/* Category filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="w-full glass-card rounded-3xl p-5"
        >
          <p className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
            <Tag size={14} /> Lọc theo Thông tư
          </p>
          <div className="flex flex-wrap gap-2">
            {['Tất cả', ...CATEGORIES].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={cn(
                  'px-3 py-1.5 rounded-xl text-xs font-medium transition-all',
                  selectedCategory === cat
                    ? 'bg-primary text-white shadow-md shadow-primary/30'
                    : 'bg-secondary text-muted-foreground hover:bg-accent'
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </motion.div>

        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleStart}
          disabled={mode === 'review' && wrongIds.length === 0}
          className="w-full py-4 rounded-2xl bg-primary text-white font-bold text-base shadow-xl shadow-primary/30 hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {mode === 'review' && wrongIds.length === 0
            ? 'Chưa có câu sai nào!'
            : `Bắt đầu học (${questionSet.length} câu)`}
        </motion.button>
      </div>
    );
  }

  // ── RESULT SCREEN ────────────────────────────────────────────────────────
  if (result) {
    return <ResultScreen result={result} onRetry={handleRetry} />;
  }

  // ── QUIZ SCREEN ──────────────────────────────────────────────────────────
  return (
    <div key={quizKey} className="max-w-3xl mx-auto px-4 py-6">
      {/* Top bar */}
      <div className="flex items-center gap-4 mb-6">
        <ProgressBar
          value={quiz.progress}
          className="flex-1"
          color={quiz.answerState.confirmed && quiz.answerState.isCorrect === false ? 'red' : 'blue'}
        />
        <span className="text-xs font-semibold text-muted-foreground whitespace-nowrap">
          {quiz.currentIndex + 1}&nbsp;/&nbsp;{quiz.totalQuestions}
        </span>
        <span className="text-xs text-muted-foreground font-mono tabular-nums">
          {formatTime(stopwatch.seconds)}
        </span>
      </div>

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
  );
}

export default function StudyPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="sticky top-[57px] z-30 border-b border-border/30 bg-background/80 backdrop-blur-sm">
        <div className="max-w-3xl mx-auto px-4 py-2 flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft size={14} />
            Trang chủ
          </Link>
        </div>
      </div>
      <Suspense>
        <StudyContent />
      </Suspense>
    </div>
  );
}
