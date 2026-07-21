'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ProgressBarProps {
  value: number; // 0-100
  className?: string;
  showLabel?: boolean;
  color?: 'blue' | 'green' | 'amber' | 'red' | 'purple';
  size?: 'sm' | 'md' | 'lg';
}

const colorMap = {
  blue: 'from-blue-500 to-indigo-500',
  green: 'from-emerald-500 to-teal-500',
  amber: 'from-amber-400 to-orange-500',
  red: 'from-red-500 to-rose-500',
  purple: 'from-violet-500 to-purple-600',
};

const sizeMap = {
  sm: 'h-1.5',
  md: 'h-2.5',
  lg: 'h-3.5',
};

export function ProgressBar({
  value,
  className,
  showLabel = false,
  color = 'blue',
  size = 'md',
}: ProgressBarProps) {
  const pct = Math.max(0, Math.min(100, value));

  return (
    <div className={cn('w-full', className)}>
      {showLabel && (
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs text-muted-foreground">Tiến độ</span>
          <span className="text-xs font-semibold text-foreground">{pct}%</span>
        </div>
      )}
      <div className={cn('w-full bg-secondary rounded-full overflow-hidden', sizeMap[size])}>
        <motion.div
          className={cn('h-full rounded-full bg-gradient-to-r', colorMap[color])}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}
