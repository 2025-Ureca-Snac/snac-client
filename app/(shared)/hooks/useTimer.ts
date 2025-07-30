import { useState, useEffect, useRef, useCallback } from 'react';
import type { TimerReturn } from '../types/timer';

/**
 * @author 이승우
 * @description 타이머 훅
 * @param initial 초기 시간( 기본값 0 )
 * @returns 타이머 시간( 초 단위로 감소 ), 타이머 시작(start( 초 단위 )), 타이머 멈춤(stop())
 */
export function useTimer(initial: number = 0): TimerReturn {
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
