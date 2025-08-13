import React from 'react';
import ModalPortal from './modal-portal';
import type { PrivacyPolicyModalProps } from '../types/privacy-policy-modal';

/**
 * @author 이승우
 * @description 개인정보처리방침 모달 컴포넌트({@link PrivacyPolicyModalProps(open, onClose)})
 * @param {boolean} open 모달 열림 상태
 * @param {Function} onClose 모달 닫기 함수
 */
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
          className="bg-card rounded-2xl shadow-xl w-[420px] max-w-full pt-6 pb-8 px-6 relative flex flex-col items-center mx-2 sm:mx-0"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header and Close Button */}
          <div className="flex flex-col items-center -mt-12 mb-2">
            <div
              className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-2 border-4 border-white shadow"
              style={{ marginTop: '-32px' }}
            >
              <svg width="32" height="32" fill="none" viewBox="0 0 24 24">
                <path
                  d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
                  fill="#DBEAFE"
                  stroke="#2563EB"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M9 12l2 2 4-4"
                  stroke="#2563EB"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div className="text-xl font-extrabold text-card-foreground text-center">
              개인정보처리 방침
            </div>
            <button
              onClick={onClose}
              type="button"
              className="absolute right-4 top-4 text-2xl text-muted-foreground hover:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
              aria-label="닫기"
              tabIndex={0}
            >
              ×
            </button>
          </div>
          <div className="w-full text-left text-card-foreground text-[15px] flex flex-col gap-5 max-h-[400px] overflow-y-auto pr-2">
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
