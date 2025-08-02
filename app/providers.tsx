// app/providers.tsx
'use client';

// 'next-themes'에서 ThemeProvider를 직접 import합니다.
import { ThemeProvider as NextThemesProvider } from 'next-themes';

export function Providers({ children }: { children: React.ReactNode }) {
  // 직접 만든 useTheme() 훅 대신, next-themes의 Provider를 사용합니다.
  return (
    <NextThemesProvider attribute="class" defaultTheme="system" enableSystem>
      {children}
    </NextThemesProvider>
  );
}
