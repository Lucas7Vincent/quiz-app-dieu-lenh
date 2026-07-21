'use client';

import { questions } from '@/data';
import type { Question } from '@/types';
import { shuffleArray } from '@/lib/utils';

const STORAGE_KEY = 'ly_thuyet_dieu_lenh_random_quiz_pool';

interface RandomQuizPool {
  usedIds: number[];
}

/**
 * Load the random quiz pool from localStorage
 */
function loadPool(): RandomQuizPool {
  if (typeof window === 'undefined') return { usedIds: [] };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { usedIds: [] };
    return JSON.parse(raw) as RandomQuizPool;
  } catch {
    return { usedIds: [] };
  }
}

/**
 * Save the random quiz pool to localStorage
 */
function savePool(pool: RandomQuizPool): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(pool));
  } catch {
    // ignore quota errors
  }
}

/**
 * Get the number of remaining questions in the pool
 */
export function getRemainingCount(): number {
  const pool = loadPool();
  return questions.length - pool.usedIds.length;
}

/**
 * Get the number of questions already used
 */
export function getUsedCount(): number {
  const pool = loadPool();
  return pool.usedIds.length;
}

/**
 * Select 10 random questions from the unused pool.
 * If fewer than 10 remain, reset the pool first.
 * After selection, mark selected IDs as used.
 */
export function selectRandomQuizQuestions(count: number = 10): Question[] {
  let pool = loadPool();
  const allIds = questions.map((q) => q.id);

  // If remaining questions are fewer than requested count, reset pool
  const remainingIds = allIds.filter((id) => !pool.usedIds.includes(id));
  if (remainingIds.length < count) {
    pool = { usedIds: [] };
  }

  // Get available questions (not yet used in this cycle)
  const available = questions.filter((q) => !pool.usedIds.includes(q.id));

  // Shuffle and pick `count` questions
  const shuffled = shuffleArray(available);
  const selected = shuffled.slice(0, count);

  // Mark selected IDs as used
  const newUsedIds = [...pool.usedIds, ...selected.map((q) => q.id)];
  savePool({ usedIds: newUsedIds });

  return selected;
}

/**
 * Reset the random quiz pool (start fresh)
 */
export function resetRandomQuizPool(): void {
  savePool({ usedIds: [] });
}

/**
 * Get current cycle progress info
 */
export function getPoolProgress(): {
  totalQuestions: number;
  usedCount: number;
  remainingCount: number;
  completedCycles: number;
} {
  const pool = loadPool();
  return {
    totalQuestions: questions.length,
    usedCount: pool.usedIds.length,
    remainingCount: questions.length - pool.usedIds.length,
    completedCycles: 0, // could track this if needed
  };
}
