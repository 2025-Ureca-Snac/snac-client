import React from 'react';
import ModalPortal from './modal-portal';

interface PrivacyPolicyModalProps {
  open: boolean;
  onClose: () => void;
}

export default function PrivacyPolicyModal({
  open,
  onClose,
}: PrivacyPolicyModalProps) {
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
          className="bg-white rounded-2xl shadow-xl w-[420px] max-w-full pt-6 pb-8 px-6 relative flex flex-col items-center"
          onClick={(e) => e.stopPropagation()}
        >
          {/* 타이틀 및 닫기 */}
          <div className="w-full flex items-center justify-center mb-2 relative">
            <div className="text-2xl font-bold text-black text-center w-full">
              개인정보처리 방침
            </div>
            <button
              onClick={onClose}
              type="button"
              className="absolute right-0 top-1 text-2xl text-gray-400 hover:text-gray-600"
              aria-label="닫기"
            >
              ×
            </button>
          </div>
          <div className="w-full text-left text-gray-900 text-[15px] flex flex-col gap-5 max-h-[400px] overflow-y-auto pr-2">
            <ul className="list-disc pl-5 space-y-1 mb-2">
              <li>수집 항목: 이름, 연락처, 이메일, 서비스 이용 기록 등</li>
              <li>
                이용 목적: 회원 관리, 서비스 제공, 고객 문의 응대, 안전한 거래
                지원
              </li>
              <li>
                보유 기간: 회원 탈퇴 시까지(법령상 보관 필요 시 해당 기간 동안)
              </li>
              <li>제3자 제공: 법령에 따라 필요한 경우 또는 동의 시에만 제공</li>
              <li>이용자 권리: 언제든지 개인정보 조회, 수정, 삭제 요청 가능</li>
            </ul>
            <div className="text-[15px] mt-2">
              서비스 이용 중 개인정보는 안전하게 보호되며, 변경 시 안내해
              드립니다.
            </div>
          </div>
        </div>
      </div>
    </ModalPortal>
  );
}
