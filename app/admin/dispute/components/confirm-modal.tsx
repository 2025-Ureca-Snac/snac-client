'use client';

import { useState } from 'react';
import { useDisputeStore } from '@/app/(shared)/stores/use-dispute-store';
import ModalPortal from '@/app/(shared)/components/modal-portal';

export function ConfirmModal() {
  const {
    isConfirmModalOpen,
    closeConfirmModal,
    confirmTitle,
    confirmMessage,
    confirmAction,
  } = useDisputeStore();
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    if (confirmAction) {
      setIsLoading(true);
      await confirmAction();
      setIsLoading(false);
    }
    closeConfirmModal();
  };

  return (
    <ModalPortal isOpen={isConfirmModalOpen} onClose={closeConfirmModal}>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
        onClick={closeConfirmModal}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-xs md:max-w-md overflow-hidden rounded-lg bg-card shadow-light"
          role="alertdialog"
          aria-modal="true"
          aria-labelledby="confirm-modal-title"
          aria-describedby="confirm-modal-description"
        >
          <div className="border-b border-border p-5">
            <h2
              id="confirm-modal-title"
              className="text-heading-sm font-semibold text-card-foreground"
            >
              {confirmTitle}
            </h2>
          </div>

          <div className="p-6">
            <p
              id="confirm-modal-description"
              className="text-regular-sm text-foreground"
            >
              {confirmMessage}
            </p>
          </div>

          <div className="flex justify-end space-x-3 border-t border-border bg-muted /50 px-6 py-4">
            <button
              type="button"
              onClick={closeConfirmModal}
              className="rounded-md bg-card px-4 py-2 text-regular-sm font-medium text-muted-foreground shadow-light ring-1 ring-inset ring-gray-300 hover:bg-secondary transition-colors"
            >
              취소
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              disabled={isLoading}
              className="inline-flex justify-center rounded-md bg-muted px-4 py-2 text-regular-sm font-medium text-primary-foreground shadow-light transition-colors hover:bg-card disabled:opacity-50"
            >
              {isLoading ? '처리 중...' : '확인'}
            </button>
          </div>
        </div>
      </div>
    </ModalPortal>
  );
}
