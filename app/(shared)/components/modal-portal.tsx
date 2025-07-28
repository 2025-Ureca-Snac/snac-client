'use client';

import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { ModalPortalProps } from '../types/modal-portal';

/**
 * @author 이승우
 * @description 모달 포탈 컴포넌트
 */
export default function ModalPortal({
  children,
  isOpen,
  onClose,
  className = '',
}: ModalPortalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    // 모달이 열렸을 때 body 스크롤 방지
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      // 현재 활성 요소 저장
      previousActiveElement.current = document.activeElement as HTMLElement;
    } else {
      document.body.style.overflow = 'unset';
      // 모달이 닫힐 때 원래 포커스로 복원
      if (previousActiveElement.current) {
        previousActiveElement.current.focus();
      }
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

  // 강력한 포커스 트랩
  useEffect(() => {
    if (!isOpen || !modalRef.current) return;

    const node = modalRef.current;
    const focusableSelectors = [
      'a[href]',
      'area[href]',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      'button:not([disabled])',
      'iframe',
      'object',
      'embed',
      '[tabindex]:not([tabindex="-1"])',
      '[contenteditable]',
    ];

    const getFocusableElements = () =>
      Array.from(
        node.querySelectorAll(focusableSelectors.join(','))
      ) as HTMLElement[];

    // 최초 포커스 설정
    const focusables = getFocusableElements();
    if (focusables.length) {
      setTimeout(() => focusables[0].focus(), 0);
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      const focusables = getFocusableElements();
      if (focusables.length === 0) return;

      const firstElement = focusables[0];
      const lastElement = focusables[focusables.length - 1];
      const activeElement = document.activeElement as HTMLElement;

      // 모달 내부에 포커스가 있는지 확인
      const isFocusInsideModal = node.contains(activeElement);

      if (e.shiftKey) {
        // Shift + Tab
        if (activeElement === firstElement || !isFocusInsideModal) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        // Tab
        if (activeElement === lastElement || !isFocusInsideModal) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    // 포커스가 모달 밖으로 나가는 것을 방지
    const handleFocusIn = (e: FocusEvent) => {
      const target = e.target as HTMLElement;
      if (!node.contains(target)) {
        e.preventDefault();
        const focusables = getFocusableElements();
        if (focusables.length) {
          focusables[0].focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown, true);
    document.addEventListener('focusin', handleFocusIn, true);

    return () => {
      document.removeEventListener('keydown', handleKeyDown, true);
      document.removeEventListener('focusin', handleFocusIn, true);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <div ref={modalRef} className={`fixed inset-0 z-50 ${className}`}>
      {children}
    </div>,
    document.body
  );
}
