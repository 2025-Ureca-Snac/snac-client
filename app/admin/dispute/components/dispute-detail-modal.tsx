'use client';

import React, { useState } from 'react';
import ModalPortal from '@/app/(shared)/components/modal-portal';
import { Dispute } from '@/app/(shared)/stores/use-dispute-store';

interface DisputeDetailModalProps {
  open: boolean;
  onClose: () => void;
  dispute: Dispute;
}

const TYPE_LABELS: Record<string, string> = {
  PAYMENT: '결제 관련',
  ACCOUNT: '계정 관련',
  TECHNICAL_PROBLEM: '기술적 문제',
  QNA_OTHER: '기타 문의',
  DATA_NONE: '데이터 없음',
  DATA_PARTIAL: '데이터 일부',
  REPORT_OTHER: '기타 신고',
};

const STATUS_LABELS: Record<string, string> = {
  IN_PROGRESS: '처리중',
  NEED_MORE: '자료요청',
  ANSWERED: '답변완료',
  REJECTED: '반려',
};

export default function DisputeDetailModal({
  open,
  onClose,
  dispute,
}: DisputeDetailModalProps) {
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  if (!open) return null;

  const openImageModal = (index: number) => {
    setSelectedImageIndex(index);
    setImageModalOpen(true);
  };

  return (
    <>
      <ModalPortal isOpen={open} onClose={onClose}>
        <div
          className="fixed inset-0 bg-black/60 dark:bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-2 md:p-4"
          onClick={onClose}
        >
          <div
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-light w-full max-w-xs md:max-w-2xl max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 헤더 */}
            <div className="flex items-center justify-between px-4 md:px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-heading-md font-bold text-gray-900 dark:text-white">
                문의/신고 상세 정보
              </h2>
              <button
                onClick={onClose}
                className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* 본문 */}
            <div className="p-4 md:p-6 space-y-6 overflow-y-auto">
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-heading-sm font-semibold text-gray-900 dark:text-gray-100 break-all">
                    {dispute.title}
                  </h3>
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 whitespace-nowrap">
                    {STATUS_LABELS[dispute.status] ?? dispute.status}
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-regular-sm text-gray-600 dark:text-gray-400">
                  <span>
                    카테고리: {TYPE_LABELS[dispute.type] ?? dispute.type}
                  </span>
                  <span>
                    작성일:{' '}
                    {new Date(dispute.createdAt).toLocaleDateString('ko-KR')}
                  </span>
                </div>

                <div className="bg-gray-50 dark:bg-gray-900/70 rounded-lg p-3 md:p-4 shadow-light">
                  <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-2 text-regular-md">
                    내용
                  </h4>
                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap text-regular-sm break-words">
                    {dispute.description}
                  </p>
                  {dispute.attachmentUrls &&
                    dispute.attachmentUrls.length > 0 && (
                      <div className="mt-4">
                        <h5 className="font-medium text-gray-800 dark:text-gray-200 mb-2 text-regular-sm">
                          첨부 이미지
                        </h5>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                          {dispute.attachmentUrls.map((imageUrl, index) => (
                            <img
                              key={index}
                              src={imageUrl}
                              alt={`첨부 이미지 ${index + 1}`}
                              className="w-full h-20 md:h-24 object-cover rounded-md border border-gray-300 dark:border-gray-600 cursor-pointer hover:opacity-80 transition-opacity"
                              onClick={() => openImageModal(index)}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                </div>
              </div>

              {/* 답변 영역 */}
              {dispute.answer && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-gray-800 dark:text-gray-200 text-regular-md">
                      답변
                    </h4>
                    {dispute.answerAt && (
                      <span className="text-regular-xs text-gray-500 dark:text-gray-400">
                        {new Date(dispute.answerAt).toLocaleDateString('ko-KR')}
                      </span>
                    )}
                  </div>
                  <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 border-l-4 border-gray-400 dark:border-gray-500 shadow-light">
                    <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap text-regular-sm break-words">
                      {dispute.answer}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* 푸터 */}
            <div className="flex justify-end px-4 md:px-6 py-4 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-white rounded-md hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors text-regular-sm"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      </ModalPortal>

      {/* 이미지 확대 모달 */}
      {imageModalOpen && dispute.attachmentUrls && (
        <ModalPortal
          isOpen={imageModalOpen}
          onClose={() => setImageModalOpen(false)}
        >
          <div
            className="fixed inset-0 bg-black/90 flex items-center justify-center z-[60] p-2"
            onClick={() => setImageModalOpen(false)}
          >
            <img
              src={dispute.attachmentUrls[selectedImageIndex]}
              alt="확대 이미지"
              className="max-w-[90vw] max-h-[90vh] object-contain shadow-light"
            />
          </div>
        </ModalPortal>
      )}
    </>
  );
}
