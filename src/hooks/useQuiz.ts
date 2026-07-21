'use client';

import { useState, useCallback, useRef, useMemo } from 'react';
import type { Question, AnswerState } from '@/types';
import { useProgress } from '@/store/progressStore';

interface UseQuizOptions {
  questions: Question[];
  mode: 'study' | 'exam' | 'review';
  onComplete?: (results: QuizResult) => void;
}

export interface QuizResult {
  totalQuestions: number;
  correctCount: number;
  timeTaken: number;
  answers: Record<number, { selected: string; isCorrect: boolean }>;
}

export function useQuiz({ questions, mode, onComplete }: UseQuizOptions) {
  const { recordQuestionAnswer } = useProgress();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answerState, setAnswerState] = useState<AnswerState>({
    selected: null,
    confirmed: false,
    isCorrect: null,
  });

  const [results, setResults] = useState<Record<number, { selected: string; isCorrect: boolean }>>({});
  const [startTime] = useState(() => Date.now()); // safe initialization

  const currentQuestion = questions[currentIndex];
  const isLastQuestion = currentIndex === questions.length - 1;
  const totalAnswered = Object.keys(results).length;
  const correctCount = useMemo(() => Object.values(results).filter((r) => r.isCorrect).length, [results]);

  const selectAnswer = useCallback((key: string) => {
    setAnswerState((prev) => {
      if (prev.confirmed) return prev;
      return { ...prev, selected: key };
    });
  }, []);

  const confirmAnswer = useCallback(() => {
    if (!answerState.selected || answerState.confirmed) return;

    const isCorrect = answerState.selected === currentQuestion.correctAnswer;

    if (mode !== 'exam') {
      recordQuestionAnswer(currentQuestion.id, isCorrect);
    }

    setResults((prev) => ({
      ...prev,
      [currentQuestion.id]: { selected: answerState.selected!, isCorrect },
    }));

    setAnswerState((prev) => ({ ...prev, confirmed: true, isCorrect }));
  }, [answerState, currentQuestion, mode, recordQuestionAnswer]);

  const nextQuestion = useCallback(() => {
    if (isLastQuestion) {
      const timeTaken = Math.round((Date.now() - startTime) / 1000);
      const finalResults: QuizResult = {
        totalQuestions: questions.length,
        correctCount: Object.values(results).filter((r) => r.isCorrect).length,
        timeTaken,
        answers: results,
      };

      if (mode === 'exam') {
        Object.entries(results).forEach(([qId, r]) => {
          recordQuestionAnswer(Number(qId), r.isCorrect);
        });
      }

      onComplete?.(finalResults);
    } else {
      setCurrentIndex((i) => i + 1);
      setAnswerState({ selected: null, confirmed: false, isCorrect: null });
    }
  }, [isLastQuestion, questions.length, mode, onComplete, recordQuestionAnswer, startTime, results]);

  const skipQuestion = useCallback(() => {
    if (!isLastQuestion) {
      setCurrentIndex((i) => i + 1);
      setAnswerState({ selected: null, confirmed: false, isCorrect: null });
    }
  }, [isLastQuestion]);

  const reset = useCallback(() => {
    setCurrentIndex(0);
    setAnswerState({ selected: null, confirmed: false, isCorrect: null });
    setResults({});
  }, []);

  return {
    currentQuestion,
    currentIndex,
    totalQuestions: questions.length,
    answerState,
    isLastQuestion,
    totalAnswered,
    correctCount,
    selectAnswer,
    confirmAnswer,
    nextQuestion,
    skipQuestion,
    reset,
    progress: questions.length > 0 ? (currentIndex / questions.length) * 100 : 0,
  };
}
