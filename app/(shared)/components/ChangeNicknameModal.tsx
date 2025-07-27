import React, { useState, useEffect } from 'react';
import ModalPortal from './modal-portal';
import type { ChangeNicknameModalProps } from '../types/change-nickname-modal';

/**
 * @author 이승우
 * @description 닉네임 변경 모달 컴포넌트{@link ChangeNicknameModalProps(open, onClose, onSubmit, currentNickname)}
 * @param {boolean} open 모달 열림 상태
 * @param {Function} onClose 모달 닫기 함수
 * @param {Function} onSubmit 닉네임 변경 함수
 * @param {string} currentNickname 현재 닉네임
 */
export default function ChangeNicknameModal({
  open,
  onClose,
  onSubmit,
  currentNickname = '',
}: ChangeNicknameModalProps) {
  const [nickname, setNickname] = useState(currentNickname);

  // 모달이 열릴 때마다 현재 닉네임으로 초기화
  useEffect(() => {
    if (open) {
      setNickname(currentNickname);
    }
  }, [open, currentNickname]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) onSubmit(nickname);
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
              className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-2 border-4 border-white shadow"
              style={{ marginTop: '-32px' }}
            >
              <svg width="32" height="32" fill="none" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" fill="#DBEAFE" />
                <path
                  d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"
                  stroke="#2563EB"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle cx="12" cy="7" r="4" stroke="#2563EB" strokeWidth="2" />
              </svg>
            </div>
            <div className="text-xl font-extrabold text-black text-center">
              닉네임 변경
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
            현재 닉네임을 수정해주세요.
          </div>
          <div className="w-full flex flex-col gap-3 mb-4">
            <div>
              <label className="block text-sm font-semibold mb-1">닉네임</label>
              <input
                type="text"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-200"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="닉네임을 입력하세요"
                maxLength={10}
                required
              />
              <div className="text-xs text-gray-500 mt-1">
                최대 10자까지 입력 가능합니다.
              </div>
            </div>
          </div>
          <div className="w-full flex gap-2 mb-2">
            <button
              type="submit"
              className="w-2/3 py-3 rounded-lg bg-blue-200 text-black font-bold text-lg hover:bg-blue-300 transition-colors"
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
