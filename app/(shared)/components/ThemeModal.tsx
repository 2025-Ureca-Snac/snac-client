import React from 'react';
import ModalPortal from './modal-portal';
import ThemeOptionButton from './ThemeOptionButton';
import { themeOptions } from '../constants/theme-options';
import type { ThemeModalProps, ThemeType } from '../types/theme-modal';

/**
 * @author 이승우
 * @description 화면 테마 선택 모달{@link ThemeModalProps(open, onClose, currentTheme, onThemeChange)}
 * @param {boolean} open 모달 열림 상태
 * @param {Function} onClose 모달 닫기 함수
 * @param {ThemeType} currentTheme 현재 테마
 * @param {Function} onThemeChange 테마 변경 함수
 */
export default function ThemeModal({
  open,
  onClose,
  currentTheme,
  onThemeChange,
}: ThemeModalProps) {
  return (
    <ModalPortal isOpen={open} onClose={onClose}>
      <div
        className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50"
        onClick={onClose}
        tabIndex={-1}
        aria-modal="true"
        role="dialog"
      >
        <div
          className="bg-white rounded-2xl shadow-xl w-[340px] max-w-full p-6 relative"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-4">
            <span className="font-bold text-lg">화면 테마 선택</span>
            <button
              onClick={onClose}
              className="text-2xl text-gray-400 hover:text-gray-600 absolute top-4 right-4"
              aria-label="닫기"
            >
              ×
            </button>
          </div>
          <div className="flex flex-col gap-4">
            {themeOptions.map((opt) => (
              <ThemeOptionButton
                key={opt.value}
                label={opt.label}
                selected={currentTheme === opt.value}
                colorClass={opt.colorClass}
                onClick={() => onThemeChange(opt.value as ThemeType)}
                checkColorClass={opt.checkColorClass}
              />
            ))}
          </div>
        </div>
      </div>
    </ModalPortal>
  );
}
