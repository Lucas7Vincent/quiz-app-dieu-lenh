import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function getScoreLabel(percentage: number): string {
  if (percentage >= 90) return 'Xuất sắc';
  if (percentage >= 80) return 'Giỏi';
  if (percentage >= 65) return 'Khá';
  if (percentage >= 50) return 'Trung bình';
  return 'Chưa đạt';
}

export function getScoreColor(percentage: number): string {
  if (percentage >= 90) return 'text-emerald-400';
  if (percentage >= 80) return 'text-blue-400';
  if (percentage >= 65) return 'text-amber-400';
  if (percentage >= 50) return 'text-orange-400';
  return 'text-red-400';
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}
