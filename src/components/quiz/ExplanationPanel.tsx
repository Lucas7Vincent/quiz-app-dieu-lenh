'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb, BookOpen } from 'lucide-react';

interface ExplanationPanelProps {
  show: boolean;
  explanation: string;
  isCorrect: boolean;
}

export function ExplanationPanel({ show, explanation, isCorrect }: ExplanationPanelProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, height: 0, y: -10 }}
          animate={{ opacity: 1, height: 'auto', y: 0 }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="overflow-hidden"
        >
          <div
            className={`p-4 rounded-2xl border ${
              isCorrect
                ? 'bg-emerald-500/8 border-emerald-500/25'
                : 'bg-amber-500/8 border-amber-500/25'
            }`}
          >
            <div className="flex items-start gap-3">
              <div
                className={`shrink-0 w-8 h-8 rounded-xl flex items-center justify-center ${
                  isCorrect ? 'bg-emerald-500/20' : 'bg-amber-500/20'
                }`}
              >
                {isCorrect ? (
                  <BookOpen size={15} className="text-emerald-600 dark:text-emerald-400" />
                ) : (
                  <Lightbulb size={15} className="text-amber-600 dark:text-amber-400" />
                )}
              </div>
              <div>
                <p
                  className={`text-xs font-semibold uppercase tracking-wider mb-1 ${
                    isCorrect
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-amber-600 dark:text-amber-400'
                  }`}
                >
                  Giải thích
                </p>
                <p className="text-sm text-foreground/80 leading-relaxed">{explanation}</p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
