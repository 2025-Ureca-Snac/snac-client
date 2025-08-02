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
      await Promise.resolve(confirmAction());
      setIsLoading(false);
    }
    closeConfirmModal();
  };

  return (
    <ModalPortal isOpen={isConfirmModalOpen} onClose={closeConfirmModal}>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 dark:bg-black/70 p-4 backdrop-blur-sm"
        onClick={closeConfirmModal}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-xs md:max-w-md overflow-hidden rounded-lg bg-white dark:bg-gray-800 shadow-light"
          role="alertdialog"
          aria-modal="true"
          aria-labelledby="confirm-modal-title"
          aria-describedby="confirm-modal-description"
        >
          <div className="border-b border-gray-200 dark:border-gray-700 p-5">
            <h2
              id="confirm-modal-title"
              className="text-heading-sm font-semibold text-gray-900 dark:text-white"
            >
              {confirmTitle}
            </h2>
          </div>

          <div className="p-6">
            <p
              id="confirm-modal-description"
              className="text-regular-sm text-gray-700 dark:text-gray-300"
            >
              {confirmMessage}
            </p>
          </div>

          <div className="flex justify-end space-x-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 px-6 py-4">
            <button
              type="button"
              onClick={closeConfirmModal}
              className="rounded-md bg-white dark:bg-gray-700 px-4 py-2 text-regular-sm font-medium text-gray-700 dark:text-gray-200 shadow-light ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
            >
              취소
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              disabled={isLoading}
              className="inline-flex justify-center rounded-md bg-gray-700 dark:bg-gray-600 px-4 py-2 text-regular-sm font-medium text-white shadow-light transition-colors hover:bg-gray-800 dark:hover:bg-gray-500 disabled:opacity-50"
            >
              {isLoading ? '처리 중...' : '확인'}
            </button>
          </div>
        </div>
      </div>
    </ModalPortal>
  );
}
