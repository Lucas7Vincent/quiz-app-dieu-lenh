'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, RotateCcw, CheckCircle2 } from 'lucide-react';
import type { Question } from '@/types';
import { cn } from '@/lib/utils';

interface FlashCardProps {
  question: Question;
  index: number;
  total: number;
  onNext: () => void;
  onPrev: () => void;
}

export function FlashCard({ question, index, total, onNext, onPrev }: FlashCardProps) {
  const [flipped, setFlipped] = useState(false);

  const handleNext = () => {
    setFlipped(false);
    setTimeout(onNext, 150);
  };
  const handlePrev = () => {
    setFlipped(false);
    setTimeout(onPrev, 150);
  };

  const correctAnswer = question.answers.find((a) => a.key === question.correctAnswer);

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-2xl mx-auto">
      {/* Counter */}
      <div className="text-sm text-muted-foreground font-medium">
        {index + 1} / {total}
      </div>

      {/* Card */}
      <div
        className="w-full cursor-pointer"
        style={{ perspective: '1000px' }}
        onClick={() => setFlipped((f) => !f)}
      >
        <motion.div
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          style={{ transformStyle: 'preserve-3d', position: 'relative' }}
          className="w-full"
        >
          {/* Front */}
          <div
            style={{ backfaceVisibility: 'hidden' }}
            className="glass-card rounded-3xl p-8 md:p-10 min-h-[280px] flex flex-col items-center justify-center text-center shadow-xl"
          >
            <div className="w-10 h-10 rounded-2xl bg-primary/15 flex items-center justify-center mb-4">
              <span className="text-primary font-bold text-sm">Q</span>
            </div>
            <p className="text-base md:text-lg font-medium text-foreground leading-relaxed">
              {question.question}
            </p>
            <p className="mt-4 text-xs text-muted-foreground">Nhấn để xem đáp án</p>
          </div>

          {/* Back */}
          <div
            style={{
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
              position: 'absolute',
              inset: 0,
            }}
            className="glass-card rounded-3xl p-8 md:p-10 min-h-[280px] flex flex-col items-center justify-center text-center shadow-xl border-2 border-emerald-500/30 bg-emerald-500/5"
          >
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 flex items-center justify-center mb-4">
              <CheckCircle2 size={20} className="text-emerald-500" />
            </div>
            <p className="text-xs font-semibold uppercase tracking-wider text-emerald-500 mb-2">
              Đáp án: {question.correctAnswer}
            </p>
            <p className="text-base font-semibold text-emerald-700 dark:text-emerald-300 leading-relaxed mb-4">
              {correctAnswer?.text}
            </p>
            <div className="w-full border-t border-border/50 pt-3">
              <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
                {question.explanation}
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handlePrev}
          disabled={index === 0}
          className={cn(
            'w-12 h-12 rounded-2xl flex items-center justify-center transition-colors',
            index === 0
              ? 'bg-secondary/50 text-muted-foreground/50 cursor-not-allowed'
              : 'bg-secondary hover:bg-accent text-foreground'
          )}
        >
          <ChevronLeft size={20} />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setFlipped((f) => !f)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-secondary hover:bg-accent text-sm font-medium text-foreground transition-colors"
        >
          <RotateCcw size={15} />
          Lật thẻ
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleNext}
          disabled={index === total - 1}
          className={cn(
            'w-12 h-12 rounded-2xl flex items-center justify-center transition-colors',
            index === total - 1
              ? 'bg-secondary/50 text-muted-foreground/50 cursor-not-allowed'
              : 'bg-primary text-white shadow-lg shadow-primary/30 hover:bg-primary/90'
          )}
        >
          <ChevronRight size={20} />
        </motion.button>
      </div>
    </div>
  );
}
