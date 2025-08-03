'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';

// 'light', 'dark' 외에 사용자의 시스템 설정을 따르는 'auto' 추가
type Theme = 'light' | 'dark' | 'auto';

interface ThemeContextType {
  theme: Theme; // 사용자가 선택한 테마 ('auto', 'light', 'dark')
  actualTheme: 'light' | 'dark'; // 실제 화면에 적용된 테마
  changeTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  // 1. 사용자의 선택(theme)과 실제 적용될 테마(actualTheme)를 관리합니다.
  const [theme, setTheme] = useState<Theme>('auto');
  const [actualTheme, setActualTheme] = useState<'light' | 'dark'>('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // 이 Effect는 클라이언트에서 단 한 번만 실행됩니다.
    // localStorage와 시스템 설정을 읽어 초기 테마를 결정합니다.
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    const prefersDark = window.matchMedia(
      '(prefers-color-scheme: dark)'
    ).matches;

    const initialTheme = savedTheme || 'auto';
    setTheme(initialTheme);

    if (initialTheme === 'auto') {
      setActualTheme(prefersDark ? 'dark' : 'light');
    } else {
      setActualTheme(initialTheme);
    }

    setMounted(true); // 클라이언트에서 설정이 완료되었음을 표시
  }, []);

  useEffect(() => {
    // 실제 적용될 테마(actualTheme)가 바뀔 때마다 <html> 태그의 클래스를 변경합니다.
    if (mounted) {
      const root = document.documentElement;
      root.classList.remove('light', 'dark');
      root.classList.add(actualTheme);
    }
  }, [actualTheme, mounted]);

  const changeTheme = (newTheme: Theme) => {
    localStorage.setItem('theme', newTheme);
    setTheme(newTheme);

    if (newTheme === 'auto') {
      const prefersDark = window.matchMedia(
        '(prefers-color-scheme: dark)'
      ).matches;
      setActualTheme(prefersDark ? 'dark' : 'light');
    } else {
      setActualTheme(newTheme);
    }
  };

  // 2. 깜빡임 방지: 클라이언트에서 테마 설정이 완료되기 전까지는 children을 렌더링하지 않습니다.
  // 이렇게 하면 서버에서 보낸 기본 테마가 잠시 보이는 것을 막을 수 있습니다.
  if (!mounted) {
    return null;
  }

  return (
    <ThemeContext.Provider value={{ theme, actualTheme, changeTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// 이제 useTheme 훅은 Context에서 상태를 가져오는 역할만 합니다.
export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  // 실제 테마를 isDarkmode 변환하여 반환, 기존 코드와 호환성을 맞춤
  return {
    ...context,
    isDarkmode: context.actualTheme === 'dark',
    onToggle: () =>
      context.changeTheme(context.actualTheme === 'dark' ? 'light' : 'dark'),
  };
}
