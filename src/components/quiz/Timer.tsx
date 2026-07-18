'use client';

import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';
import { formatTime } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface TimerProps {
  seconds: number;
  isWarning?: boolean;
  isDanger?: boolean;
  className?: string;
}

export function Timer({ seconds, isWarning, isDanger, className }: TimerProps) {
  return (
    <motion.div
      className={cn(
        'flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-mono font-semibold text-sm transition-colors',
        isDanger
          ? 'bg-red-500/15 text-red-500 border border-red-500/30'
          : isWarning
          ? 'bg-amber-500/15 text-amber-500 border border-amber-500/30'
          : 'bg-secondary text-muted-foreground border border-border',
        className
      )}
      animate={isDanger ? { scale: [1, 1.03, 1] } : {}}
      transition={isDanger ? { duration: 1, repeat: Infinity } : {}}
    >
      <Clock size={14} />
      <span>{formatTime(seconds)}</span>
    </motion.div>
  );
}
