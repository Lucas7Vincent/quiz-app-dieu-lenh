'use client';

import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import type { UserProgress } from '@/types';
import { loadProgress, saveProgress, recordAnswer, toggleBookmark, saveSession } from '@/lib/storage';
import type { CompletedSession } from '@/types';

type Action =
  | { type: 'LOAD'; payload: UserProgress }
  | { type: 'RECORD_ANSWER'; questionId: number; isCorrect: boolean }
  | { type: 'TOGGLE_BOOKMARK'; questionId: number }
  | { type: 'SAVE_SESSION'; session: Omit<CompletedSession, 'id'> }
  | { type: 'RESET' };

interface ProgressContextValue {
  progress: UserProgress;
  recordQuestionAnswer: (questionId: number, isCorrect: boolean) => void;
  bookmarkQuestion: (questionId: number) => void;
  completeSession: (session: Omit<CompletedSession, 'id'>) => void;
  resetProgress: () => void;
}

const defaultProgress: UserProgress = {
  questionProgress: {},
  studySessions: [],
  totalStudyTime: 0,
  streak: 0,
  lastStudyDate: '',
};

const ProgressContext = createContext<ProgressContextValue | null>(null);

function reducer(state: UserProgress, action: Action): UserProgress {
  switch (action.type) {
    case 'LOAD':
      return action.payload;
    case 'RECORD_ANSWER':
      return recordAnswer(state, action.questionId, action.isCorrect);
    case 'TOGGLE_BOOKMARK':
      return toggleBookmark(state, action.questionId);
    case 'SAVE_SESSION':
      return saveSession(state, action.session);
    case 'RESET':
      return { ...defaultProgress };
    default:
      return state;
  }
}

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [progress, dispatch] = useReducer(reducer, defaultProgress);

  useEffect(() => {
    dispatch({ type: 'LOAD', payload: loadProgress() });
  }, []);

  useEffect(() => {
    saveProgress(progress);
  }, [progress]);

  const recordQuestionAnswer = useCallback(
    (questionId: number, isCorrect: boolean) =>
      dispatch({ type: 'RECORD_ANSWER', questionId, isCorrect }),
    []
  );

  const bookmarkQuestion = useCallback(
    (questionId: number) => dispatch({ type: 'TOGGLE_BOOKMARK', questionId }),
    []
  );

  const completeSession = useCallback(
    (session: Omit<CompletedSession, 'id'>) =>
      dispatch({ type: 'SAVE_SESSION', session }),
    []
  );

  const resetProgress = useCallback(() => dispatch({ type: 'RESET' }), []);

  return (
    <ProgressContext.Provider
      value={{ progress, recordQuestionAnswer, bookmarkQuestion, completeSession, resetProgress }}
    >
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error('useProgress must be used inside ProgressProvider');
  return ctx;
}
