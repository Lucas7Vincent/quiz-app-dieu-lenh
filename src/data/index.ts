import questionsData from './questions.json';
import type { Question } from '@/types';

export const questions: Question[] = questionsData as Question[];

export const CATEGORIES = [
  'Thông tư 34',
  'Thông tư 35',
  'Thông tư 36',
  'Thông tư 04',
  'Thông tư 32',
  'Khác',
] as const;

export const getQuestionById = (id: number): Question | undefined =>
  questions.find((q) => q.id === id);

export const getQuestionsByCategory = (category: string): Question[] =>
  questions.filter((q) => q.category === category);

export const getTotalCount = () => questions.length;
