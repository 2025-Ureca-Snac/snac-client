'use client';

import { useTheme } from './(shared)/hooks/useTheme';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  useTheme(); // 테마 초기화를 위해 호출

  return <>{children}</>;
}
