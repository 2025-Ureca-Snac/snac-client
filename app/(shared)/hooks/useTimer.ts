import { useState, useEffect, useRef, useCallback } from 'react';

export function useTimer(initial: number = 0) {
  const [time, setTime] = useState(initial);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // 타이머 시작/재시작
  const start = useCallback((seconds: number) => {
    setTime(seconds);
  }, []);

  // 타이머 감소
  useEffect(() => {
    if (time > 0) {
      timerRef.current = setInterval(() => {
        setTime((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [time]);

  // 타이머 멈춤
  const stop = useCallback(() => {
    setTime(0);
    if (timerRef.current) clearInterval(timerRef.current);
  }, []);

  return { time, start, stop };
}
