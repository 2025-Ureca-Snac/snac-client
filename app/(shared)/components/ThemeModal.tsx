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
      // localStorage에서 직접 테마 가져오기
      const savedTheme = localStorage.getItem('theme') as
        | 'light'
        | 'dark'
        | 'auto';
      if (savedTheme && ['light', 'dark', 'auto'].includes(savedTheme)) {
        setSelectedTheme(savedTheme);
      } else {
        setSelectedTheme('auto');
      }
      setTimeout(() => {
        lightRef.current?.focus();
      }, 100);
    }
  }, [open]);

  const handleThemeSelect = useCallback(
    (newTheme: 'light' | 'dark' | 'auto') => {
      setSelectedTheme(newTheme);
    },
    []
  );

  const handleSubmit = useCallback(() => {
    changeTheme(selectedTheme);
    onClose();
    // 테마 변경 후 페이지 새로고침
    setTimeout(() => {
      window.location.reload();
    }, 100);
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
          className="bg-card rounded-2xl shadow-xl w-[370px] max-w-full pt-6 pb-8 px-6 relative flex flex-col items-center"
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
                <rect
                  x="2"
                  y="3"
                  width="20"
                  height="14"
                  rx="2"
                  ry="2"
                  fill="#DBEAFE"
                  stroke="#2563EB"
                  strokeWidth="2"
                />
                <line
                  x1="8"
                  y1="21"
                  x2="16"
                  y2="21"
                  stroke="#2563EB"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <line
                  x1="12"
                  y1="17"
                  x2="12"
                  y2="21"
                  stroke="#2563EB"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <div className="text-xl font-extrabold text-card-foreground text-center">
              화면 테마
            </div>
            <button
              onClick={onClose}
              type="button"
              className="absolute right-4 top-4 text-2xl text-muted-foreground hover:text-foreground"
              aria-label="닫기"
              tabIndex={0}
            >
              ×
            </button>
          </div>
          <div className="w-full text-center text-muted-foreground text-muted-foreground mb-4 text-sm">
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
                    : 'border-border bg-card text-foreground hover:border-gray-500'
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
              className="w-2/3 py-3 rounded-lg bg-blue-200 text-card-foreground font-bold text-lg hover:bg-blue-300 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              onClick={handleSubmit}
              tabIndex={0}
            >
              적용하기
            </button>
            <button
              type="button"
              className="w-1/3 py-3 rounded-lg bg-secondary text-foreground font-bold text-lg hover:bg-secondary transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
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
