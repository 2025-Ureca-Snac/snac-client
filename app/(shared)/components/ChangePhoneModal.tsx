import React, { useState } from 'react';
import ModalPortal from './modal-portal';
import type { ChangePhoneModalProps } from '../types/change-phone-modal';

/**
 * @author 이승우
 * @description 전화번호 변경 모달 컴포넌트{@link ChangePhoneModalProps(open, onClose, onSubmit)}
 * @param {boolean} open 모달 열림 상태
 * @param {Function} onClose 모달 닫기 함수
 * @param {Function} onSubmit 전화번호 변경 함수
 */
export default function ChangePhoneModal({
  open,
  onClose,
  onSubmit,
}: ChangePhoneModalProps) {
  const [password, setPassword] = useState('');
  const [next, setNext] = useState('');
  const [code, setCode] = useState('');
  const [codeEnabled, setCodeEnabled] = useState(false);

  const handleSendCode = (e: React.FormEvent) => {
    e.preventDefault();
    setCodeEnabled(true);
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) onSubmit(password, next, code);
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
          onSubmit={codeEnabled ? handleVerify : handleSendCode}
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
              전화번호 변경
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
            변경하려면 전화번호를 입력하세요.
          </div>
          <div className="w-full flex flex-col gap-3 mb-4">
            <div>
              <label className="block text-sm font-semibold mb-1">
                비밀번호
              </label>
              <input
                type="password"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-green-200"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="비밀번호 입력"
                autoComplete="current-password"
                required
                disabled={codeEnabled}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">
                변경하려는 전화번호
              </label>
              <input
                type="text"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-green-200"
                value={next}
                onChange={(e) => setNext(e.target.value)}
                placeholder="변경하려는 전화번호"
                autoComplete="tel"
                required
                disabled={codeEnabled}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">
                인증 코드
              </label>
              <input
                type="text"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-green-200"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="인증 코드 입력"
                autoComplete="one-time-code"
                required
                disabled={!codeEnabled}
              />
            </div>
          </div>
          <button
            type="submit"
            className={`w-full py-3 rounded-lg font-bold text-lg mb-2 transition-colors ${codeEnabled ? 'bg-green-200 text-black hover:bg-green-300' : 'bg-green-200 text-black'}`}
            disabled={codeEnabled ? false : false}
          >
            {codeEnabled ? '확인' : '인증 번호 전송'}
          </button>
          <button
            type="button"
            className="w-full py-3 rounded-lg bg-gray-100 text-gray-700 font-bold text-lg"
            onClick={onClose}
          >
            취소
          </button>
        </form>
      </div>
    </ModalPortal>
  );
}
