'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

// Simple global toast event system
const listeners: Array<(toast: Toast) => void> = [];

export function showToast(message: string, type: Toast['type'] = 'info') {
  const id = `${Date.now()}`;
  listeners.forEach((l) => l({ id, message, type }));
}

export function Toaster() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const handler = (toast: Toast) => {
      setToasts((prev) => [...prev, toast]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== toast.id));
      }, 3000);
    };
    listeners.push(handler);
    return () => {
      const idx = listeners.indexOf(handler);
      if (idx !== -1) listeners.splice(idx, 1);
    };
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.9 }}
            className={cn(
              'flex items-center gap-3 px-4 py-3 rounded-2xl shadow-xl pointer-events-auto',
              'glass-card min-w-[240px] max-w-[360px]',
              toast.type === 'success' && 'border-emerald-500/30',
              toast.type === 'error' && 'border-red-500/30',
              toast.type === 'info' && 'border-blue-500/30'
            )}
          >
            {toast.type === 'success' && <CheckCircle2 className="text-emerald-500 shrink-0" size={20} />}
            {toast.type === 'error' && <XCircle className="text-red-500 shrink-0" size={20} />}
            {toast.type === 'info' && <CheckCircle2 className="text-blue-500 shrink-0" size={20} />}
            <span className="text-sm font-medium text-foreground">{toast.message}</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
