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
        className="hidden md:flex items-center justify-center p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors focus:outline-none"
      >
        <LightDarkModeIcon
          width={24}
          height={24}
          className={isDark ? 'text-white' : 'text-gray-800'}
        />
      </button>

      {/* 모바일 */}
      <button
        type="button"
        aria-label="테마 토글"
        onClick={onToggle}
        className="flex w-full items-center gap-3 px-2 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition focus:outline-none md:hidden"
      >
        <LightDarkModeIcon
          width={24}
          height={24}
          className={`w-6 h-6 ${isDark ? 'text-white' : 'text-gray-800'}`}
        />

        <span
          className={`text-base font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}
        >
          {isDark ? '라이트 모드' : '다크 모드'}
        </span>
      </button>
    </>
  );
}
