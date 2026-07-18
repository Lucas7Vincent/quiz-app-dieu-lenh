'use client';

import { motion } from 'framer-motion';
import { Bookmark, BookmarkCheck, Tag } from 'lucide-react';
import { useProgress } from '@/store/progressStore';
import { AnswerOption } from './AnswerOption';
import { ExplanationPanel } from './ExplanationPanel';
import { cn } from '@/lib/utils';
import type { Question, AnswerState } from '@/types';

interface QuestionCardProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  answerState: AnswerState;
  onSelectAnswer: (key: string) => void;
  onConfirm: () => void;
  onNext: () => void;
  isLastQuestion: boolean;
  showExam?: boolean; // exam mode hides explanation
}

const categoryColors: Record<string, string> = {
  'Thông tư 34': 'bg-blue-500/15 text-blue-600 dark:text-blue-400',
  'Thông tư 35': 'bg-purple-500/15 text-purple-600 dark:text-purple-400',
  'Thông tư 36': 'bg-teal-500/15 text-teal-600 dark:text-teal-400',
  'Thông tư 04': 'bg-amber-500/15 text-amber-600 dark:text-amber-400',
  'Thông tư 32': 'bg-rose-500/15 text-rose-600 dark:text-rose-400',
  'Khác': 'bg-slate-500/15 text-slate-600 dark:text-slate-400',
};

export function QuestionCard({
  question,
  questionNumber,
  totalQuestions,
  answerState,
  onSelectAnswer,
  onConfirm,
  onNext,
  isLastQuestion,
  showExam = false,
}: QuestionCardProps) {
  const { progress, bookmarkQuestion } = useProgress();
  const qp = progress.questionProgress[question.id];
  const isBookmarked = qp?.bookmarked ?? false;

  return (
    <motion.div
      key={question.id}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="w-full max-w-2xl mx-auto flex flex-col gap-4"
    >
      {/* Question header */}
      <div className="glass-card rounded-3xl p-5 md:p-6 shadow-xl shadow-primary/5">
        {/* Meta row */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground font-medium">
              Câu {questionNumber}/{totalQuestions}
            </span>
            <span className={cn('text-xs px-2 py-0.5 rounded-lg font-medium flex items-center gap-1', categoryColors[question.category] ?? categoryColors['Khác'])}>
              <Tag size={10} />
              {question.category}
            </span>
          </div>
          <motion.button
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => bookmarkQuestion(question.id)}
            className="w-8 h-8 rounded-xl bg-secondary hover:bg-accent flex items-center justify-center transition-colors"
            aria-label="Bookmark question"
          >
            {isBookmarked ? (
              <BookmarkCheck size={16} className="text-primary" />
            ) : (
              <Bookmark size={16} className="text-muted-foreground" />
            )}
          </motion.button>
        </div>

        {/* Question text */}
        <p className="text-base md:text-lg font-medium text-foreground leading-relaxed">
          {question.question}
        </p>
      </div>

      {/* Answer options */}
      <div className="flex flex-col gap-2.5">
        {question.answers.map((answer, i) => (
          <AnswerOption
            key={answer.key}
            answer={answer}
            index={i}
            selected={answerState.selected === answer.key}
            confirmed={answerState.confirmed}
            isCorrect={answerState.isCorrect ?? false}
            correctKey={question.correctAnswer}
            onClick={() => onSelectAnswer(answer.key)}
          />
        ))}
      </div>

      {/* Explanation */}
      {!showExam && (
        <ExplanationPanel
          show={answerState.confirmed}
          explanation={question.explanation}
          isCorrect={answerState.isCorrect ?? false}
        />
      )}

      {/* Action buttons */}
      <div className="flex gap-3 pt-2">
        {!answerState.confirmed ? (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onConfirm}
            disabled={!answerState.selected}
            className={cn(
              'flex-1 py-3.5 px-6 rounded-2xl font-semibold text-sm transition-all duration-200',
              answerState.selected
                ? 'bg-primary text-white shadow-lg shadow-primary/30 hover:bg-primary/90'
                : 'bg-secondary text-muted-foreground cursor-not-allowed'
            )}
          >
            Xác nhận
          </motion.button>
        ) : (
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onNext}
            className="flex-1 py-3.5 px-6 rounded-2xl bg-primary text-white font-semibold text-sm shadow-lg shadow-primary/30 hover:bg-primary/90 transition-all"
          >
            {isLastQuestion ? '🎉 Xem kết quả' : 'Câu tiếp theo →'}
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}
