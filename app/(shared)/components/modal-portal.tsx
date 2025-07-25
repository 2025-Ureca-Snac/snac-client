'use client';

import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ModalPortalProps } from '../types/modal-portal';

/**
 * @author 이승우
 * @description 모달 포탈 컴포넌트{@link ModalPortalProps(children, isOpen, onClose, className)}
 * @param {React.ReactNode} children 자식 요소
 * @param {boolean} isOpen 모달 열림 상태
 * @param {Function} onClose 모달 닫기 함수
 * @param {string} className 클래스 이름
 */
export default function ModalPortal({
  children,
  isOpen,
  onClose,
  className = '',
}: ModalPortalProps) {
  useEffect(() => {
    // 모달이 열렸을 때 body 스크롤 방지
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // ESC 키로 모달 닫기
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && onClose) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div className={`fixed inset-0 z-50 ${className}`}>{children}</div>,
    document.body
  );
}
