'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, ArrowLeft, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { QuestionCard } from '@/components/quiz/QuestionCard';
import { ProgressBar } from '@/components/quiz/ProgressBar';
import { Timer } from '@/components/quiz/Timer';
import { ResultScreen } from '@/components/quiz/ResultScreen';
import { useQuiz, type QuizResult } from '@/hooks/useQuiz';
import { useTimer } from '@/hooks/useTimer';
import { selectQuestions } from '@/lib/questionEngine';
import { useProgress } from '@/store/progressStore';

const EXAM_DURATION = 90 * 60; // 90 minutes

export default function ExamPage() {
  const { completeSession } = useProgress();
  const [started, setStarted] = useState(false);
  const [result, setResult] = useState<QuizResult | null>(null);
  const [questions] = useState(() => selectQuestions({ mode: 'exam', count: 100 }));

  const handleComplete = useCallback(
    (r: QuizResult) => {
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
        mode: 'exam',
        date: new Date().toISOString(),
        totalQuestions: r.totalQuestions,
        correctCount: r.correctCount,
        timeTaken: r.timeTaken,
        categoryBreakdown,
      });
    },
    [questions, completeSession]
  );

  const quiz = useQuiz({
    questions,
    mode: 'exam',
    onComplete: handleComplete,
  });

  const timer = useTimer({
    initialSeconds: EXAM_DURATION,
    autoStart: started && !result,
    onExpire: () => {
      // Force submit on timer expire
      handleComplete({
        totalQuestions: questions.length,
        correctCount: 0,
        timeTaken: EXAM_DURATION,
        answers: {},
      });
    },
  });

  const handleRetry = () => {
    window.location.reload();
  };

  if (!started) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-xl mx-auto px-4 py-16 flex flex-col items-center gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center mx-auto mb-5 shadow-xl shadow-amber-500/30">
              <Zap size={36} className="text-white" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Thi thử</h1>
            <p className="text-muted-foreground">Mô phỏng bài thi thật với đồng hồ đếm ngược</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="w-full glass-card rounded-3xl p-6"
          >
            <h2 className="font-semibold text-foreground mb-4">Quy định thi</h2>
            <div className="space-y-2.5">
              {[
                '100 câu hỏi ngẫu nhiên',
                'Thời gian: 90 phút',
                'Không được xem giải thích',
                'Không được quay lại câu trước',
                'Nộp bài sau khi làm xong',
              ].map((rule) => (
                <div key={rule} className="flex items-center gap-2.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                  <p className="text-sm text-foreground">{rule}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="w-full flex items-start gap-2 px-4 py-3 rounded-2xl bg-amber-500/10 border border-amber-500/25"
          >
            <AlertTriangle size={16} className="text-amber-500 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-600 dark:text-amber-400">
              Khi bắt đầu, đồng hồ sẽ chạy và bạn không thể tạm dừng. Đảm bảo bạn có đủ 90 phút.
            </p>
          </motion.div>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setStarted(true)}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 text-white font-bold text-base shadow-xl shadow-amber-500/30 hover:opacity-90 transition-all"
          >
            Bắt đầu thi →
          </motion.button>
        </div>
      </div>
    );
  }

  if (result) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <ResultScreen result={result} onRetry={handleRetry} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="sticky top-[57px] z-30 border-b border-border/30 bg-background/80 backdrop-blur-sm">
        <div className="max-w-3xl mx-auto px-4 py-2.5 flex items-center gap-4">
          <ProgressBar value={quiz.progress} className="flex-1" color="amber" />
          <span className="text-xs font-semibold text-muted-foreground whitespace-nowrap">
            {quiz.currentIndex + 1}/{quiz.totalQuestions}
          </span>
          <Timer seconds={timer.seconds} isWarning={timer.isWarning} isDanger={timer.isDanger} />
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6">
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
            showExam
          />
        </AnimatePresence>
      </div>
    </div>
  );
}
