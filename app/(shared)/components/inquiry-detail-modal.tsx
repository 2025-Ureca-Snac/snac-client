'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import ModalPortal from './modal-portal';
import { InquiryDetailModalProps } from '../types/inquiry-detail-modal';
import { DisputeType } from '../types/inquiry';

/**
 * @author 이승우
 * @description 문의 상세보기 모달 컴포넌트
 * @param props - 모달 props
 * @returns 문의 상세 내용과 이미지 뷰어를 포함한 모달
 */
export default function InquiryDetailModal({
  open,
  onClose,
  inquiry,
}: InquiryDetailModalProps) {
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  /**
   * @author 이승우
   * @description 문의 카테고리를 한글로 변환
   * @param type 문의 타입
   * @returns 한글 카테고리명
   */
  const getCategoryName = (type: string): string => {
    switch (type) {
      case DisputeType.DATA_NONE:
        return '데이터 안옴';
      case DisputeType.DATA_PARTIAL:
        return '일부만 수신';
      case DisputeType.PAYMENT:
        return '결제 관련';
      case DisputeType.ACCOUNT:
        return '계정 관련';
      case DisputeType.TECHNICAL_PROBLEM:
        return '기술적 문제';
      case DisputeType.QNA_OTHER:
      case DisputeType.REPORT_OTHER:
        return '기타';
      default:
        return type;
    }
  };

  if (!inquiry) {
    return null;
  }

  const openImageModal = (index: number) => {
    setSelectedImageIndex(index);
    setImageModalOpen(true);
  };

  const closeImageModal = () => {
    setImageModalOpen(false);
  };

  const goToPreviousImage = () => {
    if (!inquiry.attachmentUrls) return;
    setSelectedImageIndex((prev) =>
      prev === 0 ? inquiry.attachmentUrls!.length - 1 : prev - 1
    );
  };

  const goToNextImage = () => {
    if (!inquiry.attachmentUrls) return;
    setSelectedImageIndex((prev) =>
      prev === inquiry.attachmentUrls!.length - 1 ? 0 : prev + 1
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    e.stopPropagation();
    if (e.key === 'Escape') {
      closeImageModal();
    } else if (e.key === 'ArrowLeft') {
      goToPreviousImage();
    } else if (e.key === 'ArrowRight') {
      goToNextImage();
    }
  };

  return (
    <>
      <ModalPortal isOpen={open} onClose={onClose}>
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* 헤더 */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {inquiry.category === 'REPORT' ? '신고 상세' : '문의 상세'}
              </h2>
              <button
                onClick={onClose}
                className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
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

            {/* 내용 */}
            <div className="p-6 space-y-6">
              {/* 문의 정보 */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {inquiry.title}
                  </h3>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      inquiry.status === 'IN_PROGRESS'
                        ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'
                        : 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                    }`}
                  >
                    {inquiry.status === 'IN_PROGRESS'
                      ? '답변 대기'
                      : '답변 완료'}
                  </span>
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                  <span>카테고리: {getCategoryName(inquiry.type)}</span>
                  <span>
                    작성일:{' '}
                    {new Date(inquiry.createdAt).toLocaleDateString('ko-KR')}
                  </span>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                    문의 내용
                  </h4>
                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                    {inquiry.description}
                  </p>

                  {/* 첨부 이미지 */}
                  {inquiry.attachmentUrls &&
                    inquiry.attachmentUrls.length > 0 && (
                      <div className="mt-4">
                        <h5 className="font-medium text-gray-900 dark:text-white mb-2">
                          첨부 이미지
                        </h5>
                        <div className="grid grid-cols-2 gap-2">
                          {inquiry.attachmentUrls.map(
                            (imageUrl: string, index: number) => (
                              <div key={index} className="relative">
                                <Image
                                  src={imageUrl}
                                  alt={`첨부 이미지 ${index + 1}`}
                                  width={96}
                                  height={96}
                                  className="w-full h-24 object-cover rounded-md border border-gray-200 dark:border-gray-600 cursor-pointer hover:opacity-80 transition-opacity"
                                  onClick={() => openImageModal(index)}
                                />
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    )}
                </div>
              </div>

              {/* 답변 */}
              {inquiry.answer && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      답변
                    </h4>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {inquiry.answerAt &&
                        new Date(inquiry.answerAt).toLocaleDateString('ko-KR')}
                    </span>
                  </div>
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border-l-4 border-blue-500">
                    <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                      {inquiry.answer}
                    </p>
                  </div>
                </div>
              )}

              {/* 답변 대기 중인 경우 */}
              {!inquiry.answer && inquiry.status === 'IN_PROGRESS' && (
                <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 border-l-4 border-yellow-500">
                  <p className="text-yellow-800 dark:text-yellow-200">
                    답변을 준비 중입니다. 조금만 기다려주세요.
                  </p>
                </div>
              )}
            </div>

            {/* 하단 버튼 */}
            <div className="flex justify-end p-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      </ModalPortal>

      {/* 이미지 상세보기 모달 */}
      {imageModalOpen && inquiry.attachmentUrls && (
        <ModalPortal isOpen={imageModalOpen} onClose={closeImageModal}>
          <div
            className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-[60] p-4"
            onKeyDown={handleKeyDown}
            onClick={(e) => e.stopPropagation()}
            tabIndex={0}
          >
            {/* 닫기 버튼 */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                closeImageModal();
              }}
              className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10"
            >
              <svg
                className="w-8 h-8"
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

            {/* 이전 버튼 */}
            {inquiry.attachmentUrls.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goToPreviousImage();
                }}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 transition-colors z-10"
              >
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
            )}

            {/* 이미지 */}
            <div className="relative max-w-full max-h-full">
              <Image
                src={inquiry.attachmentUrls[selectedImageIndex]}
                alt={`이미지 ${selectedImageIndex + 1}`}
                width={800}
                height={600}
                className="max-w-full max-h-[80vh] object-contain"
              />

              {/* 이미지 인디케이터 */}
              {inquiry.attachmentUrls.length > 1 && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                  {inquiry.attachmentUrls.map((_: string, index: number) => (
                    <button
                      key={index}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedImageIndex(index);
                      }}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        index === selectedImageIndex
                          ? 'bg-white'
                          : 'bg-white bg-opacity-50 hover:bg-opacity-75'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* 다음 버튼 */}
            {inquiry.attachmentUrls.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goToNextImage();
                }}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 transition-colors z-10"
              >
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            )}

            {/* 이미지 정보 */}
            <div className="absolute bottom-4 left-4 text-white text-sm">
              {selectedImageIndex + 1} / {inquiry.attachmentUrls.length}
            </div>
          </div>
        </ModalPortal>
      )}
    </>
  );
}
