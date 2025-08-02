import React from 'react';
import type { ThemeOptionButtonProps } from '../types/theme';

/**
 * @author 이승우
 * @description 테마 선택 버튼{@link ThemeOptionButtonProps(label, selected, colorClass, onClick, checkColorClass)}
 * @param {string} label 버튼 라벨
 * @param {boolean} selected 선택 여부
 * @param {string} colorClass 버튼 색상 클래스
 * @param {Function} onClick 버튼 클릭 함수
 * @param {string} checkColorClass 선택 시 체크 색상 클래스
 */
export default function ThemeOptionButton({
  label,
  selected,
  colorClass,
  onClick,
  checkColorClass,
}: ThemeOptionButtonProps) {
  return (
    <button
      className={`w-full py-3 px-3 rounded-lg border border-gray-200 hover:bg-gray-50 flex items-center justify-between ${selected ? colorClass : ''}`}
      onClick={onClick}
    >
      {label}
      {selected && <span className={`ml-2 ${checkColorClass}`}>✓</span>}
    </button>
  );
}
