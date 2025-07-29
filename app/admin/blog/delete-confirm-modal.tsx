import React from 'react';
import { useBlogStore } from '@/app/(shared)/stores/use-blog-store';
import NewReportIcon from '@/public/newReport.svg';
import ModalPortal from '@/app/(shared)/components/modal-portal';

export function DeleteConfirmModal() {
  const { isDeleteModalOpen, closeDeleteModal, deleteBlog } = useBlogStore();

  return (
    <ModalPortal
      isOpen={isDeleteModalOpen}
      onClose={closeDeleteModal}
      className="bg-black bg-opacity-50 flex items-center justify-center"
    >
      <div className="bg-white p-8 rounded-2xl shadow-xl text-center w-full max-w-md mx-4">
        <div className="flex justify-center mb-4">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
            <NewReportIcon className="h-6 w-6 text-red-600" />
          </div>
        </div>
        <h2 className="text-xl font-bold mb-2">게시글을 삭제하시겠습니까?</h2>
        <p className="text-gray-600 mb-6">이 작업은 되돌릴 수 없습니다.</p>
        <div className="flex justify-center space-x-4">
          <button
            onClick={closeDeleteModal}
            className="px-6 py-2 border rounded-lg hover:bg-gray-100 transition-colors font-semibold"
          >
            취소
          </button>
          <button
            onClick={deleteBlog}
            className="px-6 py-2 bg-red text-white rounded-lg  transition-colors font-semibold"
          >
            삭제 확인
          </button>
        </div>
      </div>
    </ModalPortal>
  );
}
