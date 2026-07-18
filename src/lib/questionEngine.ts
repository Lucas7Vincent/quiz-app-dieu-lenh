import type { Question, CategoryStats, UserProgress } from '@/types';
import { questions } from '@/data';
import { shuffleArray } from '@/lib/utils';

/**
 * Select questions based on mode/filters
 */
export function selectQuestions(opts: {
  mode: 'sequential' | 'random' | 'exam' | 'review';
  category?: string;
  count?: number;
  wrongIds?: number[];
}): Question[] {
  let pool: Question[] = [...questions];

  if (opts.category && opts.category !== 'Tất cả') {
    pool = pool.filter((q) => q.category === opts.category);
  }

  if (opts.mode === 'review' && opts.wrongIds && opts.wrongIds.length > 0) {
    pool = pool.filter((q) => opts.wrongIds!.includes(q.id));
  }

  if (opts.mode === 'random' || opts.mode === 'exam') {
    pool = shuffleArray(pool);
  }

  if (opts.count) {
    pool = pool.slice(0, opts.count);
  }

  return pool;
}

/**
 * Compute per-category accuracy stats
 */
export function computeCategoryStats(progress: UserProgress): CategoryStats[] {
  const map: Record<string, CategoryStats> = {};

  for (const q of questions) {
    if (!map[q.category]) {
      map[q.category] = {
        category: q.category,
        total: 0,
        attempted: 0,
        correct: 0,
        accuracy: 0,
      };
    }
    map[q.category].total++;

    const qp = progress.questionProgress[q.id];
    if (qp && qp.attempts > 0) {
      map[q.category].attempted++;
      map[q.category].correct += qp.correct;
    }
  }

  return Object.values(map).map((s) => ({
    ...s,
    accuracy: s.attempted > 0 ? Math.round((s.correct / s.attempted) * 100) : 0,
  }));
}

/**
 * Get IDs of wrong answers
 */
export function getWrongQuestionIds(progress: UserProgress): number[] {
  return Object.entries(progress.questionProgress)
    .filter(([, p]) => p.attempts > 0 && p.correct < p.attempts)
    .map(([id]) => Number(id));
}

/**
 * Get completion percentage
 */
export function getCompletionPercent(progress: UserProgress): number {
  const attempted = Object.values(progress.questionProgress).filter(
    (p) => p.attempts > 0
  ).length;
  return Math.round((attempted / questions.length) * 100);
}

/**
 * Search questions by content
 */
export function searchQuestions(query: string, category?: string): Question[] {
  const q = query.toLowerCase().trim();
  let pool = questions;

  if (category && category !== 'Tất cả') {
    pool = pool.filter((item) => item.category === category);
  }

  if (!q) return pool;

  return pool.filter(
    (item) =>
      item.question.toLowerCase().includes(q) ||
      item.answers.some((a) => a.text.toLowerCase().includes(q)) ||
      item.explanation.toLowerCase().includes(q)
  );
}
