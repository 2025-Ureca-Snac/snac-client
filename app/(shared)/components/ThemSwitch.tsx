'use client';

import React from 'react';
import LightDarkModeIcon from '@/public/lightDarkMode.svg';

interface ThemeSwitchProps {
  isDark: boolean | undefined;
  onToggle: () => void;
}

export function ThemeSwitch({ isDark, onToggle }: ThemeSwitchProps) {
  return (
    <>
      {/* PC  */}
      <button
        type="button"
        aria-label="테마 토글"
        onClick={onToggle}
        className="hidden md:flex items-center justify-center p-2 rounded-lg hover:bg-secondary:bg-card transition-colors focus:outline-none"
      >
        <LightDarkModeIcon
          width={24}
          height={24}
          className={isDark ? 'text-primary-foreground' : 'text-foreground'}
        />
      </button>

      {/* 모바일 */}
      <button
        type="button"
        aria-label="테마 토글"
        onClick={onToggle}
        className="flex w-full items-center gap-3 px-2 py-3 rounded-lg hover:bg-secondary:bg-card transition focus:outline-none md:hidden"
      >
        <LightDarkModeIcon
          width={24}
          height={24}
          className={`w-6 h-6 ${isDark ? 'text-primary-foreground' : 'text-foreground'}`}
        />

        <span
          className={`text-base font-medium ${isDark ? 'text-primary-foreground' : 'text-card-foreground'}`}
        >
          {isDark ? '라이트 모드' : '다크 모드'}
        </span>
      </button>
    </>
  );
}
