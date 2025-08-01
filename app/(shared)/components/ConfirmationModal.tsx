'use client';

import React from 'react';
import { useDisputeStore } from '@/app/(shared)/stores/use-dispute-store';

export function ConfirmationModal() {
  const {
    isConfirmModalOpen,
    confirmMessage,
    confirmAction,
    closeConfirmModal,
  } = useDisputeStore();

  if (!isConfirmModalOpen) {
    return null;
  }

  const handleConfirm = () => {
    if (confirmAction) {
      confirmAction();
    }
    closeConfirmModal();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-sm">
        <h3 className="text-lg font-bold mb-4">확인</h3>
        <p className="mb-6">{confirmMessage}</p>
        <div className="flex justify-end gap-4">
          <button
            onClick={closeConfirmModal}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
          >
            취소
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
}
