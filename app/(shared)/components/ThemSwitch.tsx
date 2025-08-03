import React from 'react';
import LightIcon from '@/public/light.svg';
import DarkIcon from '@/public/dark.svg';
import LightDarkModeIcon from '@/public/lightDarkMode.svg';

interface ThemeSwitchProps {
  isDark: boolean | undefined;
  onToggle: () => void;
}

export function ThemeSwitch({ isDark, onToggle }: ThemeSwitchProps) {
  return (
    <>
      {/* PC 이상: 스위치 */}
      <button
        type="button"
        aria-label="테마 토글"
        onClick={onToggle}
        className={`
          hidden w-[75px] h-7 items-center justify-between
          rounded-full border-2 bg-white px-1 py-1
          transition-all duration-300 md:flex
          ${isDark ? '!border-white' : 'border-gray-800'}
        `}
        style={isDark ? { borderColor: '#fff' } : undefined}
      >
        <LightIcon
          className={`text-black transition-opacity duration-300 ${
            isDark ? 'opacity-40' : 'opacity-100'
          }`}
        />
        <DarkIcon
          className={`transition-opacity duration-300 ${
            isDark ? 'opacity-100 text-black' : 'opacity-40 text-gray-600'
          }`}
        />
      </button>

      {/* 모바일:  한 개만 */}
      <button
        type="button"
        aria-label="다크/라이트 토글"
        onClick={onToggle}
        className="flex items-center justify-center p-2 md:hidden"
      >
        <LightDarkModeIcon width={24} height={24} />
      </button>
    </>
  );
}
