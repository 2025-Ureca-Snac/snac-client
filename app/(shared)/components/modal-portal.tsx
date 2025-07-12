'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { ModalPortalProps } from '../types/modal-portal';

/**
 * @author 이승우
 * @description 모달 포탈 컴포넌트
 * @param props 컴포넌트 속성 {@link ModalPortalProps}(children, isOpen, onClose, className)
 */
export default function ModalPortal({
  children,
  isOpen,
  onClose,
  className = '',
}: ModalPortalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

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

  if (!mounted) return null;

  return createPortal(
    <div className={`fixed inset-0 z-50 ${className}`}>{children}</div>,
    document.body
  );
}
