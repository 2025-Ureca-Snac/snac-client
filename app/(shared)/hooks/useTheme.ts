import { useState, useEffect } from 'react';
import type { Theme } from '../types/theme';

/**
 * @author 이승우
 * @description 브라우저 단에서 테마를 관리하는 커스텀 훅
 */
export function useTheme() {
  const [theme, setTheme] = useState<Theme>('auto');
  const [systemTheme, setSystemTheme] = useState<'light' | 'dark'>('light');

  // 시스템 테마 감지
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = (e: MediaQueryListEvent) => {
      setSystemTheme(e.matches ? 'dark' : 'light');
    };

    setSystemTheme(mediaQuery.matches ? 'dark' : 'light');
    mediaQuery.addEventListener('change', handleChange);

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // localStorage에서 테마 불러오기
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme && ['light', 'dark', 'auto'].includes(savedTheme)) {
      setTheme(savedTheme);
    } else {
      // localStorage에 저장된 값이 없으면 auto로 설정하고 저장
      setTheme('auto');
      localStorage.setItem('theme', 'auto');
    }
  }, []);

  // 실제 적용될 테마 계산
  const actualTheme = theme === 'auto' ? systemTheme : theme;

  // 테마 변경 함수
  const changeTheme = (newTheme: Theme) => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  // HTML 클래스 적용
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(actualTheme);

    // 부드러운 전환을 위한 transition 클래스 추가
    root.classList.add('transition-colors', 'duration-300');
  }, [actualTheme]);

  return {
    theme,
    actualTheme,
    systemTheme,
    changeTheme,
  };
}
