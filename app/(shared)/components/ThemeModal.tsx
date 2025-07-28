import React, { useState, useRef, useCallback, useEffect } from 'react';
import ModalPortal from './modal-portal';
import { useTheme } from '../hooks/useTheme';
import type { ThemeModalProps } from '../types/theme';

export default function ThemeModal({ open, onClose }: ThemeModalProps) {
  const { theme, changeTheme } = useTheme();
  const [selectedTheme, setSelectedTheme] = useState<'light' | 'dark' | 'auto'>(
    theme
  );
  const lightRef = useRef<HTMLButtonElement>(null);
  const darkRef = useRef<HTMLButtonElement>(null);
  const autoRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (open) {
      setSelectedTheme(theme);
      setTimeout(() => {
        lightRef.current?.focus();
      }, 100);
    }
  }, [open, theme]);

  const handleThemeSelect = useCallback(
    (newTheme: 'light' | 'dark' | 'auto') => {
      setSelectedTheme(newTheme);
    },
    []
  );

  const handleSubmit = useCallback(() => {
    changeTheme(selectedTheme);
    onClose();
  }, [selectedTheme, changeTheme, onClose]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    },
    [onClose]
  );

  const themes = [
    { id: 'light', label: '라이트 모드', ref: lightRef },
    { id: 'dark', label: '다크 모드', ref: darkRef },
    { id: 'auto', label: '시스템 설정', ref: autoRef },
  ] as const;

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
          className="bg-white rounded-2xl shadow-xl w-[370px] max-w-full pt-6 pb-8 px-6 relative flex flex-col items-center"
          onClick={(e) => e.stopPropagation()}
          onKeyDown={handleKeyDown}
        >
          {/* Header and Close Button */}
          <div className="flex flex-col items-center -mt-12 mb-2">
            <div
              className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-2 border-4 border-white shadow"
              style={{ marginTop: '-32px' }}
            >
              <svg width="32" height="32" fill="none" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="5" fill="#DBEAFE" />
                <path
                  d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"
                  stroke="#2563EB"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div className="text-xl font-extrabold text-black text-center">
              화면 테마
            </div>
            <button
              onClick={onClose}
              type="button"
              className="absolute right-4 top-4 text-2xl text-gray-400 hover:text-gray-600"
              aria-label="닫기"
              tabIndex={0}
            >
              ×
            </button>
          </div>
          <div className="w-full text-center text-gray-600 mb-4 text-sm">
            원하는 테마를 선택해주세요.
          </div>

          <div className="w-full flex flex-col gap-3 mb-4">
            {themes.map(({ id, label, ref }) => (
              <button
                key={id}
                ref={ref}
                type="button"
                className={`w-full py-3 px-4 rounded-lg border-2 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  selectedTheme === id
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => handleThemeSelect(id)}
                aria-label={`${label} 선택`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{label}</span>
                  {selectedTheme === id && (
                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                      <path
                        d="M20 6L9 17l-5-5"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </div>
              </button>
            ))}
          </div>

          <div className="w-full flex gap-2">
            <button
              type="button"
              className="w-2/3 py-3 rounded-lg bg-blue-200 text-black font-bold text-lg hover:bg-blue-300 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              onClick={handleSubmit}
              tabIndex={0}
            >
              적용하기
            </button>
            <button
              type="button"
              className="w-1/3 py-3 rounded-lg bg-gray-100 text-gray-700 font-bold text-lg hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              onClick={onClose}
              tabIndex={0}
            >
              취소
            </button>
          </div>
        </div>
      </div>
    </ModalPortal>
  );
}
