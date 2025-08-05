'use client';

import React, { useState } from 'react';
import ModalPortal from '@/app/(shared)/components/modal-portal';
import Image from 'next/image';
import { Dispute } from '@/app/(shared)/stores/use-dispute-store';
import { StatusBadge } from '@/app/admin/dispute/components/StatusBadge';

interface ExtendedDispute extends Dispute {
  tradeSummary?: {
    tradeId: number;

    priceGb: number;
    dataAmount: number;
    carrier: string;
    myRole: string | null;
    counterpartyId: number | null;
  };
}

interface DisputeDetailModalProps {
  open: boolean;
  onClose: () => void;
  dispute: ExtendedDispute;
}

const TYPE_LABELS: Record<string, string> = {
  PAYMENT: '결제 관련',
  ACCOUNT: '계정 관련',
  TECHNICAL_PROBLEM: '기술적 문제',
  QNA_OTHER: '기타 문의',
  DATA_NONE: '데이터 없음',
  DATA_PARTIAL: '데이터 일부',
  REPORT_OTHER: '기타 신고',
  QNA: '문의',
  REPORT: '신고',
};

export default function DisputeDetailModal({
  open,
  onClose,
  dispute,
}: DisputeDetailModalProps) {
  const [imageModalOpen, setImageModalOpen] = useState(false);

  if (!open) return null;

  const openImageModal = () => {
    // 이미지가 있을 때만 모달을 엽니다.
    if (dispute.attachmentUrls && dispute.attachmentUrls.length > 0) {
      setImageModalOpen(true);
    }
  };

  return (
    <>
      <ModalPortal isOpen={open} onClose={onClose}>
        <div
          className="fixed inset-0 bg-black/40 dark:bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-2"
          onClick={onClose}
        >
          <div
            className="
              bg-white dark:bg-midnight-black rounded-2xl shadow-2xl 
              w-full max-w-md md:max-w-2xl 
              max-h-[90vh] flex flex-col overflow-hidden
              ring-1 ring-black/10 dark:ring-white/5
              relative
              animate-fadeIn
            "
            onClick={(e) => e.stopPropagation()}
          >
            {/* 헤더 */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-700 sticky top-0 bg-white dark:bg-midnight-black z-10">
              <h2 className="text-lg font-bold tracking-tight text-gray-900 dark:text-white">
                상세 정보
              </h2>
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-full transition hover:bg-gray-100 dark:hover:bg-white/10 group"
                aria-label="닫기"
              >
                <svg
                  className="w-5 h-5 text-gray-500 group-hover:text-teal-500"
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
            <div className="flex-1 px-6 py-5 space-y-6 overflow-y-auto bg-gray-50 dark:bg-gray-900">
              {/* 타이틀 & 상태 */}
              <div className="flex items-center justify-between gap-2 mb-2">
                <h3 className="text-base font-semibold text-gray-900 dark:text-white break-all">
                  {dispute.title}
                </h3>
                {/* 상태 뱃지 */}
                <StatusBadge status={dispute.status} />
              </div>
              {/* 작성자, 상대방 */}
              <div className="flex flex-wrap gap-3 text-sm text-gray-600 dark:text-gray-400 mb-1">
                <span>
                  <span className="font-medium text-gray-700 dark:text-gray-200">
                    작성자
                  </span>{' '}
                  {dispute.reporterNickname}
                </span>
                {dispute.opponentNickname && (
                  <span>
                    <span className="font-medium text-gray-700 dark:text-gray-200">
                      신고대상
                    </span>{' '}
                    {dispute.opponentNickname}
                  </span>
                )}
              </div>
              {/* 카테고리 & 작성일 */}
              <div className="flex flex-wrap gap-3 text-xs text-gray-500 dark:text-gray-400 mb-1">
                <span>
                  <span className="font-medium text-gray-600 dark:text-gray-300">
                    카테고리
                  </span>
                  : {TYPE_LABELS[dispute.type] ?? dispute.type}
                </span>
                <span>
                  <span className="font-medium text-gray-600 dark:text-gray-300">
                    작성일
                  </span>
                  : {new Date(dispute.createdAt).toLocaleDateString('ko-KR')}
                </span>
              </div>

              {/*  거래 정보 */}
              {dispute.tradeSummary && (
                <section className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-3 text-[1rem]">
                    거래 정보
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600 dark:text-gray-300">
                        거래 ID
                      </span>
                      <span className="text-gray-800 dark:text-gray-100">
                        {dispute.tradeSummary.tradeId}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600 dark:text-gray-300">
                        통신사
                      </span>
                      <span className="text-gray-800 dark:text-gray-100">
                        {dispute.tradeSummary.carrier}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600 dark:text-gray-300">
                        데이터
                      </span>
                      <span className="text-gray-800 dark:text-gray-100">
                        {dispute.tradeSummary.dataAmount}GB
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600 dark:text-gray-300">
                        GB당 가격
                      </span>
                      <span className="text-gray-800 dark:text-gray-100">
                        {dispute.tradeSummary.priceGb.toLocaleString('ko-KR')}원
                      </span>
                    </div>
                  </div>
                </section>
              )}

              {/* 내용 */}
              <section className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2 text-[1rem]">
                  내용
                </h4>
                <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap text-sm leading-relaxed break-words min-h-[48px]">
                  {dispute.description}
                </p>
                {dispute.attachmentUrls &&
                  dispute.attachmentUrls.length > 0 && (
                    <div className="mt-4">
                      <h5 className="font-medium text-gray-900 dark:text-gray-200 mb-2 text-xs">
                        첨부 이미지
                      </h5>
                      <div className="flex gap-2 flex-wrap">
                        {dispute.attachmentUrls[0] && (
                          <Image
                            src={dispute.attachmentUrls[0]}
                            alt="첨부 이미지"
                            width={64}
                            height={64}
                            className="w-16 h-16 rounded-lg border border-gray-200 dark:border-gray-700 object-cover cursor-pointer hover:scale-105 hover:ring-2 hover:ring-teal-400/40 transition"
                            onClick={openImageModal}
                          />
                        )}
                      </div>
                    </div>
                  )}
              </section>

              {/* 답변 영역 */}
              {dispute.answer && (
                <section>
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-teal-700 dark:text-teal-300 text-base">
                      답변
                    </h4>
                    {dispute.answerAt && (
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(dispute.answerAt).toLocaleDateString('ko-KR')}
                      </span>
                    )}
                  </div>
                  <div className="bg-teal-50/60 dark:bg-teal-900/20 rounded-xl p-4 shadow-sm border border-teal-100 dark:border-teal-800">
                    <p className="text-gray-800 dark:text-gray-100 text-sm whitespace-pre-wrap break-words">
                      {dispute.answer}
                    </p>
                  </div>
                </section>
              )}
            </div>

            {/* 푸터 */}
            <div className="flex justify-end items-center px-6 py-4 border-t border-gray-100 dark:border-gray-700 bg-white dark:bg-midnight-black sticky bottom-0">
              <button
                onClick={onClose}
                className="px-5 py-2 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600 shadow transition text-sm font-semibold"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      </ModalPortal>

      {/* 이미지 확대 모달 */}
      {imageModalOpen && dispute.attachmentUrls?.[0] && (
        <ModalPortal
          isOpen={imageModalOpen}
          onClose={() => setImageModalOpen(false)}
        >
          <div
            className="fixed inset-0 bg-black/90 flex items-center justify-center z-[60] p-2"
            onClick={() => setImageModalOpen(false)}
          >
            <Image
              src={dispute.attachmentUrls[0]}
              alt="확대 이미지"
              width={1200}
              height={800}
              sizes="80vw"
              className="max-w-[80vw] max-h-[80vh] w-auto h-auto object-contain shadow-2xl rounded-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </ModalPortal>
      )}
    </>
  );
}
