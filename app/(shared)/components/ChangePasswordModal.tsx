import React, { useState } from 'react';
import ModalPortal from './modal-portal';

interface ChangePasswordModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit?: (current: string, next: string, confirm: string) => void;
}

export default function ChangePasswordModal({
  open,
  onClose,
  onSubmit,
}: ChangePasswordModalProps) {
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) onSubmit(current, next, confirm);
  };

  return (
    <ModalPortal isOpen={open} onClose={onClose}>
      <div
        className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50"
        onClick={onClose}
        tabIndex={-1}
        aria-modal="true"
        role="dialog"
      >
        <form
          className="bg-white rounded-2xl shadow-xl w-[370px] max-w-full pt-6 pb-8 px-6 relative flex flex-col items-center"
          onClick={(e) => e.stopPropagation()}
          onSubmit={handleSubmit}
        >
          {/* 상단 아이콘 */}
          <div className="flex flex-col items-center -mt-12 mb-2">
            <div
              className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-2 border-4 border-white shadow"
              style={{ marginTop: '-32px' }}
            >
              <svg width="32" height="32" fill="none" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" fill="#D1FADF" />
                <path
                  d="M12 7v4l2 2"
                  stroke="#16B364"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="#16B364"
                  strokeWidth="2"
                />
              </svg>
            </div>
            <div className="text-xl font-extrabold text-black text-center">
              비밀번호 변경
            </div>
            <button
              onClick={onClose}
              type="button"
              className="absolute right-4 top-4 text-2xl text-gray-400 hover:text-gray-600"
              aria-label="닫기"
            >
              ×
            </button>
          </div>
          <div className="w-full text-center text-gray-600 mb-4 text-sm">
            변경하려면 비밀번호를 입력하세요.
          </div>
          <div className="w-full flex flex-col gap-3 mb-4">
            <div>
              <label className="block text-sm font-semibold mb-1">
                현재 비밀번호
              </label>
              <input
                type="password"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-green-200"
                value={current}
                onChange={(e) => setCurrent(e.target.value)}
                placeholder="현재 비밀번호"
                autoComplete="current-password"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">
                새 비밀번호
              </label>
              <input
                type="password"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-green-200"
                value={next}
                onChange={(e) => setNext(e.target.value)}
                placeholder="새 비밀번호"
                autoComplete="new-password"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">
                새 비밀번호 한 번 더 입력
              </label>
              <input
                type="password"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-green-200"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="새 비밀번호 한 번 더 입력"
                autoComplete="new-password"
                required
              />
            </div>
          </div>
          <div className="w-full flex gap-2 mb-2">
            <button
              type="submit"
              className="w-2/3 py-3 rounded-lg bg-green-200 text-black font-bold text-lg hover:bg-green-300 transition-colors"
            >
              변경하기
            </button>
            <button
              type="button"
              className="w-1/3 py-3 rounded-lg bg-gray-100 text-gray-700 font-bold text-lg"
              onClick={onClose}
            >
              취소
            </button>
          </div>
        </form>
      </div>
    </ModalPortal>
  );
}
