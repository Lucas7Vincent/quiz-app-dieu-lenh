export interface Answer {
  key: string;
  text: string;
}

export interface Question {
  id: number;
  question: string;
  answers: Answer[];
  correctAnswer: string;
  explanation: string;
  category: string;
}

export type Category =
  | 'Thông tư 34'
  | 'Thông tư 35'
  | 'Thông tư 36'
  | 'Thông tư 04'
  | 'Thông tư 32'
  | 'Khác';

export type StudyMode = 'sequential' | 'random' | 'exam' | 'flashcard' | 'review';

export interface QuizSession {
  id: string;
  mode: StudyMode;
  questionIds: number[];
  currentIndex: number;
  answers: Record<number, string>; // questionId -> selectedKey
  startTime: number;
  endTime?: number;
  bookmarked: number[];
}

export interface QuestionProgress {
  questionId: number;
  attempts: number;
  correct: number;
  lastAttempt: number;
  bookmarked: boolean;
}

export interface UserProgress {
  questionProgress: Record<number, QuestionProgress>;
  studySessions: CompletedSession[];
  totalStudyTime: number; // seconds
  streak: number;
  lastStudyDate: string;
}

export interface CompletedSession {
  id: string;
  mode: StudyMode;
  date: string;
  totalQuestions: number;
  correctCount: number;
  timeTaken: number; // seconds
  categoryBreakdown: Record<string, { total: number; correct: number }>;
}

export interface CategoryStats {
  category: string;
  total: number;
  attempted: number;
  correct: number;
  accuracy: number;
}

export interface AnswerState {
  selected: string | null;
  confirmed: boolean;
  isCorrect: boolean | null;
}
