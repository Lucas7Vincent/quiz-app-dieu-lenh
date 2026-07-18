'use client';

import type { UserProgress, QuestionProgress, CompletedSession } from '@/types';
import { generateId } from '@/lib/utils';

const STORAGE_KEY = 'ly_thuyet_dieu_lenh_progress';

const defaultProgress: UserProgress = {
  questionProgress: {},
  studySessions: [],
  totalStudyTime: 0,
  streak: 0,
  lastStudyDate: '',
};

export function loadProgress(): UserProgress {
  if (typeof window === 'undefined') return defaultProgress;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...defaultProgress };
    return JSON.parse(raw) as UserProgress;
  } catch {
    return { ...defaultProgress };
  }
}

export function saveProgress(progress: UserProgress): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {
    // ignore quota errors
  }
}

export function recordAnswer(
  progress: UserProgress,
  questionId: number,
  isCorrect: boolean
): UserProgress {
  const qp: QuestionProgress = progress.questionProgress[questionId] ?? {
    questionId,
    attempts: 0,
    correct: 0,
    lastAttempt: 0,
    bookmarked: false,
  };

  const updated: QuestionProgress = {
    ...qp,
    attempts: qp.attempts + 1,
    correct: qp.correct + (isCorrect ? 1 : 0),
    lastAttempt: Date.now(),
  };

  return {
    ...progress,
    questionProgress: {
      ...progress.questionProgress,
      [questionId]: updated,
    },
  };
}

export function toggleBookmark(progress: UserProgress, questionId: number): UserProgress {
  const qp: QuestionProgress = progress.questionProgress[questionId] ?? {
    questionId,
    attempts: 0,
    correct: 0,
    lastAttempt: 0,
    bookmarked: false,
  };

  return {
    ...progress,
    questionProgress: {
      ...progress.questionProgress,
      [questionId]: { ...qp, bookmarked: !qp.bookmarked },
    },
  };
}

export function saveSession(
  progress: UserProgress,
  session: Omit<CompletedSession, 'id'>
): UserProgress {
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

  let streak = progress.streak;
  if (progress.lastStudyDate === yesterday) {
    streak += 1;
  } else if (progress.lastStudyDate !== today) {
    streak = 1;
  }

  return {
    ...progress,
    studySessions: [
      { id: generateId(), ...session },
      ...progress.studySessions.slice(0, 49), // keep last 50
    ],
    totalStudyTime: progress.totalStudyTime + session.timeTaken,
    streak,
    lastStudyDate: today,
  };
}

export function clearProgress(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
}
