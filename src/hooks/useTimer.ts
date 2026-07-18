'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

interface UseTimerOptions {
  initialSeconds: number;
  onExpire?: () => void;
  autoStart?: boolean;
}

export function useTimer({ initialSeconds, onExpire, autoStart = true }: UseTimerOptions) {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(autoStart);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setIsRunning(autoStart);
  }, [autoStart]);
  
  // Safely keep a reference to onExpire without mutating in render
  const onExpireRef = useRef(onExpire);
  useEffect(() => {
    onExpireRef.current = onExpire;
  }, [onExpire]);

  useEffect(() => {
    if (!isRunning) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }
    intervalRef.current = setInterval(() => {
      setSeconds((s) => {
        if (s <= 1) {
          clearInterval(intervalRef.current!);
          setIsRunning(false);
          onExpireRef.current?.();
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning]);

  const pause = useCallback(() => setIsRunning(false), []);
  const resume = useCallback(() => setIsRunning(true), []);
  const reset = useCallback(() => {
    setSeconds(initialSeconds);
    setIsRunning(autoStart);
  }, [initialSeconds, autoStart]);

  const percentage = Math.round((seconds / initialSeconds) * 100);
  const isWarning = seconds < initialSeconds * 0.2;
  const isDanger = seconds < 60;

  return { seconds, isRunning, percentage, isWarning, isDanger, pause, resume, reset };
}

// Stopwatch (count up)
export function useStopwatch(autoStart = true) {
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(autoStart);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isRunning) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }
    intervalRef.current = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning]);

  const pause = useCallback(() => setIsRunning(false), []);
  const resume = useCallback(() => setIsRunning(true), []);
  const reset = useCallback(() => {
    setSeconds(0);
    setIsRunning(autoStart);
  }, [autoStart]);

  return { seconds, isRunning, pause, resume, reset };
}
