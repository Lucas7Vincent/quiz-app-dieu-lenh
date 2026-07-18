'use client';

import { motion } from 'framer-motion';
import { CheckCircle2, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Answer } from '@/types';

interface AnswerOptionProps {
  answer: Answer;
  index: number;
  selected: boolean;      // is THIS answer the one the user clicked?
  confirmed: boolean;     // has the user clicked "Xác nhận"?
  isCorrect: boolean;     // was the selected answer correct? (overall quiz result)
  correctKey: string;     // the key of the correct answer for this question
  onClick: () => void;
}

export function AnswerOption({
  answer,
  index,
  selected,
  confirmed,
  isCorrect,
  correctKey,
  onClick,
}: AnswerOptionProps) {
  // Is THIS specific answer the correct one?
  const isThisCorrect = answer.key === correctKey;
  // Was THIS answer selected AND is it the wrong one?
  const isWrongSelected = confirmed && selected && !isCorrect;
  // Is THIS the correct answer shown after confirmation?
  const isCorrectAnswer = confirmed && isThisCorrect;
  // Is THIS the selected-correct answer (user got it right)?
  const isSelectedCorrect = confirmed && selected && isCorrect;
  // Neutral: not yet confirmed
  const isNeutral = !confirmed;
  // Dimmed: confirmed, not selected, not the correct answer
  const isDimmed = confirmed && !selected && !isThisCorrect;

  return (
    <motion.button
      onClick={onClick}
      disabled={confirmed}
      initial={{ opacity: 0, x: -20 }}
      animate={{
        opacity: 1,
        x: 0,
        // Shake animation ONLY for the wrong-selected answer
        scale: isWrongSelected ? [1, 1.01, 0.99, 1.01, 0.99, 1] : 1,
      }}
      transition={{
        delay: index * 0.08,
        duration: isWrongSelected ? 0.45 : 0.3,
        ease: 'easeOut',
      }}
      whileHover={!confirmed ? { scale: 1.015, y: -2 } : {}}
      whileTap={!confirmed ? { scale: 0.98 } : {}}
      className={cn(
        'w-full text-left rounded-2xl border-2 p-4 transition-all duration-300',
        'relative overflow-hidden group cursor-pointer',

        // ── NEUTRAL states (before confirm) ──────────────────────────
        // Not selected → default card
        isNeutral && !selected &&
          'border-border bg-card hover:border-primary/50 hover:bg-primary/5 hover:shadow-md',
        // Selected (not yet confirmed) → blue highlight
        isNeutral && selected &&
          'border-blue-500 bg-blue-500/10 shadow-lg shadow-blue-500/15',

        // ── CONFIRMED states (after confirm) ─────────────────────────
        // User selected the CORRECT answer → rich green
        isSelectedCorrect &&
          'border-emerald-500 bg-emerald-500/12 shadow-lg shadow-emerald-500/20',
        // CORRECT answer (not selected) → softer green to distinguish
        isCorrectAnswer && !selected &&
          'border-emerald-500 bg-emerald-500/10 shadow-md shadow-emerald-500/15',
        // User selected the WRONG answer → red
        isWrongSelected &&
          'border-red-500 bg-red-500/10 shadow-lg shadow-red-500/20',
        // All other answers → dimmed
        isDimmed &&
          'border-border/40 bg-card/40 opacity-50'
      )}
    >
      {/* Pulsing glow for correct answer */}
      {isCorrectAnswer && (
        <motion.div
          className="absolute inset-0 rounded-2xl bg-emerald-500/5"
          animate={{ opacity: [0.3, 0.8, 0.3] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}

      <div className="flex items-start gap-3 relative">
        {/* ── Key badge ── */}
        <div
          className={cn(
            'shrink-0 w-8 h-8 rounded-xl flex items-center justify-center',
            'text-sm font-bold transition-all duration-300',

            // Neutral
            isNeutral && !selected &&
              'bg-secondary text-muted-foreground group-hover:bg-blue-500/20 group-hover:text-blue-600 dark:group-hover:text-blue-400',
            isNeutral && selected &&
              'bg-blue-500 text-white',

            // Confirmed
            isCorrectAnswer && 'bg-emerald-500 text-white',
            isWrongSelected && 'bg-red-500 text-white',
            isDimmed && 'bg-secondary/60 text-muted-foreground/60'
          )}
        >
          {answer.key}
        </div>

        {/* ── Answer text ── */}
        <p
          className={cn(
            'flex-1 text-sm leading-relaxed pt-0.5 transition-colors duration-300',

            // Neutral
            isNeutral && !selected && 'text-foreground',
            isNeutral && selected && 'text-blue-700 dark:text-blue-300 font-semibold',

            // Confirmed
            isCorrectAnswer && 'text-emerald-700 dark:text-emerald-300 font-semibold',
            isWrongSelected && 'text-red-700 dark:text-red-300 font-medium',
            isDimmed && 'text-muted-foreground'
          )}
        >
          {answer.text}
        </p>

        {/* ── Status icon ── */}
        {confirmed && (isCorrectAnswer || isWrongSelected) && (
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 350, damping: 20, delay: 0.05 }}
            className="shrink-0"
          >
            {isCorrectAnswer && (
              <CheckCircle2 className="text-emerald-500" size={20} />
            )}
            {isWrongSelected && (
              <XCircle className="text-red-500" size={20} />
            )}
          </motion.div>
        )}
      </div>
    </motion.button>
  );
}
