import React from 'react';
import LightIcon from '@/public/light.svg';
import DarkIcon from '@/public/dark.svg';
import LightDarkModeIcon from '@/public/lightDarkMode.svg'; // 추가

export function ThemeSwitch({
  isDark,
  onToggle,
}: {
  isDark: boolean;
  onToggle: () => void;
}) {
  return (
    <>
      {/* PC 이상: 스위치 */}
      <button
        type="button"
        aria-label="테마 토글"
        onClick={onToggle}
        className={`
          w-[75px] h-7 rounded-full items-center justify-between
          border-2
          ${isDark ? '!border-white bg-white' : 'border-gray-800 bg-white'}
          px-1 py-1 transition-all duration-300
          hidden md:flex
        `}
        style={isDark ? { borderColor: '#fff' } : undefined}
      >
        <LightIcon
          className={`${isDark ? 'opacity-40' : 'opacity-100'} text-black`}
          style={{ transition: 'opacity 0.3s' }}
        />
        <DarkIcon
          className={`${isDark ? 'opacity-100 text-black' : 'opacity-40 text-gray-600'}`}
          style={{ transition: 'opacity 0.3s' }}
        />
      </button>

      {/* 모바일:  한 개만 */}
      <button
        type="button"
        aria-label="다크/라이트 토글"
        onClick={onToggle}
        className="flex md:hidden items-center justify-center p-2"
      >
        <LightDarkModeIcon width={24} height={24} />
      </button>
    </>
  );
}
