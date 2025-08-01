'use client';

import React from 'react';
import ModalPortal from './modal-portal';

interface InquiryDetail {
  id: number;
  title: string;
  content: string;
  category: string;
  status: 'pending' | 'answered';
  createdAt: string;
  answer?: {
    content: string;
    answeredAt: string;
  };
}

interface InquiryDetailModalProps {
  open: boolean;
  onClose: () => void;
  inquiry: InquiryDetail | null;
}

const STATUS_LABELS = {
  pending: '답변 대기',
  answered: '답변 완료',
};

const STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-800',
  answered: 'bg-green-100 text-green-800',
};

export default function InquiryDetailModal({
  open,
  onClose,
  inquiry,
}: InquiryDetailModalProps) {
  if (!inquiry) return null;

  return (
    <ModalPortal isOpen={open} onClose={onClose}>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          {/* 헤더 */}
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-xl font-bold text-gray-900">문의 상세</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
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
                <h3 className="text-lg font-semibold text-gray-900">
                  {inquiry.title}
                </h3>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[inquiry.status]}`}
                >
                  {STATUS_LABELS[inquiry.status]}
                </span>
              </div>

              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span>카테고리: {inquiry.category}</span>
                <span>
                  작성일:{' '}
                  {new Date(inquiry.createdAt).toLocaleDateString('ko-KR')}
                </span>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">문의 내용</h4>
                <p className="text-gray-700 whitespace-pre-wrap">
                  {inquiry.content}
                </p>
              </div>
            </div>

            {/* 답변 */}
            {inquiry.answer && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <h4 className="font-medium text-gray-900">답변</h4>
                  <span className="text-sm text-gray-500">
                    {new Date(inquiry.answer.answeredAt).toLocaleDateString(
                      'ko-KR'
                    )}
                  </span>
                </div>
                <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-500">
                  <p className="text-gray-700 whitespace-pre-wrap">
                    {inquiry.answer.content}
                  </p>
                </div>
              </div>
            )}

            {/* 답변 대기 중인 경우 */}
            {!inquiry.answer && inquiry.status === 'pending' && (
              <div className="bg-yellow-50 rounded-lg p-4 border-l-4 border-yellow-500">
                <p className="text-yellow-800">
                  답변을 준비 중입니다. 조금만 기다려주세요.
                </p>
              </div>
            )}
          </div>

          {/* 하단 버튼 */}
          <div className="flex justify-end p-6 border-t">
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
  );
}
