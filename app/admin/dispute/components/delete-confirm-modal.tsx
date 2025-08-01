'use client';

import React from 'react';

import { useDisputeStore } from '@/app/(shared)/stores/use-dispute-store';

export function DeleteConfirmModal() {
  const {
    isDeleteModalOpen,
    closeDeleteModal,
    selectedDisputeId,
    deleteDispute,
  } = useDisputeStore();

  const handleDelete = () => {
    if (selectedDisputeId) {
      deleteDispute(selectedDisputeId);
    }
  };

  if (!isDeleteModalOpen || !selectedDisputeId) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-sm w-full">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          정말로 삭제하시겠습니까?
        </h3>
        <p className="text-sm text-gray-600 mb-6">
          이 작업을 되돌릴 수 없습니다. 신중하게 결정해주세요.
        </p>
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={closeDeleteModal}
            className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            취소
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700"
          >
            삭제
          </button>
        </div>
      </div>
    </div>
  );
}
