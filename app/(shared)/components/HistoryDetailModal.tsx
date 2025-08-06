'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { API_STATUS, UPLOAD_ERROR_MESSAGE } from '../constants/api-status';
import { REASON_MAP } from '../constants/cancel-reasons';
import type { SendDataResponse } from '../types/api';
import type { HistoryDetailModalProps } from '../types/history-detail-modal';
import api from '../utils/api';
import { getCarrierImageUrl } from '../utils/carrier-utils';
import {
  getHistoryStatusText,
  getHistoryStatusColor,
} from '../utils/history-status';
import { getProgressSteps } from '../utils/progress-steps-utils';
import ProgressStepsDetail from './progress-steps-detail';

// 첨부 이미지 URL 응답 타입 정의
interface AttachmentUrlResponse {
  data: string;
  code: string;
  status: string;
  message: string;
  timestamp: string;
}
import { DataUploadSection } from './DataUploadSection';
// 취소 사유를 한글로 변환하는 함수
const getCancelReasonText = (reason: string): string => {
  return REASON_MAP[reason] || reason || '없음';
};

/**
 * @author 이승우
 * @description 거래 내역 상세 모달 컴포넌트{@link HistoryDetailModalProps(open, onClose, item, type)}
 * @param {boolean} open 모달 열림 상태
 * @param {Function} onClose 모달 닫기 함수
 * @param {HistoryItem} item 거래 내역 데이터
 * @param {string} type 거래 유형 (구매/판매)
 */
export default function HistoryDetailModal({
  open,
  onClose,
  item,
  type,
}: HistoryDetailModalProps) {
  const router = useRouter();
  const [showCancelReason, setShowCancelReason] = useState(false);
  const [selectedCancelReason, setSelectedCancelReason] = useState<string>('');
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoadingFavorite, setIsLoadingFavorite] = useState(false);
  const [attachmentImageUrl, setAttachmentImageUrl] = useState<string>('');

  // 단골 상태 초기화
  useEffect(() => {
    if (item?.partnerId) {
      setIsFavorite(item.partnerFavorite);
    }
  }, [item?.partnerId, item?.partnerFavorite]);

  // 첨부 이미지 URL 가져오기
  useEffect(() => {
    const fetchAttachmentImage = async () => {
      // 데이터 수신완료 상태일 때만 이미지 가져오기
      if (item?.status === 'DATA_SENT' || item?.status === 'COMPLETED') {
        try {
          const response = await api.get<AttachmentUrlResponse>(
            `/trades/${item.id}/attachment-url`
          );

          if (response.data.status === 'OK' && response.data.data) {
            setAttachmentImageUrl(response.data.data);
          }
        } catch {
          // 첨부 이미지 URL 가져오기 실패 처리
        } finally {
        }
      }
    };

    if (open && item) {
      fetchAttachmentImage();
    }
  }, [open, item]);

  if (!open || !item) return null;

  // 단골 등록
  const handleAddFavorite = async () => {
    if (!item?.partnerId) return;

    try {
      setIsLoadingFavorite(true);
      await api.post('/favorites', { toMemberId: item.partnerId });
      setIsFavorite(true);
    } catch {
      // 단골 등록 실패 처리
    } finally {
      setIsLoadingFavorite(false);
    }
  };

  // 신고하기 버튼 클릭
  const handleReportClick = () => {
    const tradeId = item.id;
    const tradeType = type === 'sales' ? 'SALE' : 'PURCHASE';
    router.push(
      `/mypage/report-history?report=true&tradeId=${tradeId}&tradeType=${tradeType}`
    );
  };

  // 거래 취소 버튼 표시 여부 결정
  const shouldShowCancelButton = () => {
    if (!item) return false;

    const { status, cancelRequestStatus } = item;

    if (type === 'sales') {
      return (
        status !== 'COMPLETED' &&
        status !== 'DATA_SENT' &&
        status !== 'REPORTED' &&
        status !== 'CANCELED' &&
        cancelRequestStatus !== 'REQUESTED' &&
        cancelRequestStatus !== 'ACCEPTED'
      );
    }

    if (type === 'purchase') {
      const isNotCancelledByPartner =
        cancelRequestStatus !== 'ACCEPTED' &&
        cancelRequestStatus !== 'REJECTED';
      const isCancellableStatus =
        status !== 'CANCELED' &&
        status !== 'COMPLETED' &&
        status !== 'DATA_SENT';
      return isNotCancelledByPartner && isCancellableStatus;
    }

    return false;
  };

  // 단골 삭제
  const handleRemoveFavorite = async () => {
    if (!item?.partnerId) return;

    try {
      setIsLoadingFavorite(true);
      await api.delete(`/favorites/${item.partnerId}`);
      setIsFavorite(false);
    } catch {
      // 단골 삭제 실패 처리
    } finally {
      setIsLoadingFavorite(false);
    }
  };

  // 전송완료 핸들러
  const handleDataSent = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await api.patch<SendDataResponse>(
        `/trades/${item.id}/send-data`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      // 응답 상태에 따른 처리
      if (response.data.status === API_STATUS.OK) {
        // 성공 시 페이지 새로고침
        window.location.reload();
        return;
      }

      let errorMessage: string = UPLOAD_ERROR_MESSAGE.DEFAULT;
      switch (response.data.status) {
        case API_STATUS.BAD_REQUEST:
          errorMessage = response.data.data || UPLOAD_ERROR_MESSAGE.BAD_IMAGE;
          break;
        case API_STATUS.GATEWAY_TIMEOUT:
          errorMessage = UPLOAD_ERROR_MESSAGE.TIMEOUT;
          break;
      }
      throw new Error(errorMessage);
    } catch (error) {
      throw error;
    }
  };

  // 데이터 수신 확인 핸들러
  const handleDataConfirm = async () => {
    try {
      await api.patch(`/trades/${item.id}/confirm`);

      // 성공 시 페이지 새로고침
      window.location.reload();
    } catch {
      // 데이터 수신 확인 실패 처리
    }
  };

  // 거래 취소 사유 토글
  const handleTradeCancelClick = () => {
    setShowCancelReason(!showCancelReason);
    if (!showCancelReason) {
      // 기본값 설정
      setSelectedCancelReason(
        type === 'sales'
          ? 'SELLER_FORCED_TERMINATION'
          : 'BUYER_FORCED_TERMINATION'
      );
    }
  };

  // 거래 취소 실행 핸들러
  const handleTradeCancelConfirm = async () => {
    try {
      await api.patch(`/trades/${item.id}/cancel/request`, {
        reason: selectedCancelReason,
      });

      // 성공 시 페이지 새로고침
      window.location.reload();
    } catch {
      // 거래 취소 처리 실패 처리
    }
  };

  // 거래 취소 거절 핸들러
  const handleCancelReject = async () => {
    try {
      await api.patch(`/trades/${item.id}/cancel/reject`);

      // 성공 시 페이지 새로고침
      window.location.reload();
    } catch {
      // 거래 취소 거절 처리 실패 처리
    }
  };

  // 거래 취소 승낙 핸들러
  const handleCancelAccept = async () => {
    try {
      await api.patch(`/trades/${item.id}/cancel/accept`);

      // 성공 시 페이지 새로고침
      window.location.reload();
    } catch {
      // 거래 취소 승낙 처리 실패 처리
    }
  };

  // 진행 단계 생성
  const progressSteps = getProgressSteps(type, item.status);
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-300">
        {/* 헤더 */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {type === 'purchase' ? '구매' : '판매'} 상세 정보
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
        <div className="p-4 space-y-4">
          {/* 기본 정보 */}
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
              <Image
                src={getCarrierImageUrl(item.carrier || 'SKT')}
                alt={item.carrier || 'SKT'}
                width={48}
                height={48}
                className="w-[80%] h-[80%] object-contain"
              />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                  {item.date}
                </div>

                <button
                  onClick={handleReportClick}
                  className="px-3 py-1 rounded-lg text-xs font-medium bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/30 transition-colors"
                >
                  신고하기
                </button>
              </div>
              <div className="font-semibold text-gray-900 dark:text-white mb-1">
                {item.title}
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={`text-white text-xs px-2 py-1 rounded ${
                    item.cancelRequestStatus === 'REQUESTED'
                      ? 'bg-red-500'
                      : getHistoryStatusColor(type, item.status)
                  }`}
                >
                  {item.cancelRequestStatus === 'REQUESTED'
                    ? '취소 접수'
                    : getHistoryStatusText(type, item.status)}
                </span>
                <span className="text-gray-900 dark:text-white">
                  {item.price.toLocaleString()}원
                </span>
              </div>
            </div>
          </div>

          {/* 파트너 정보 */}
          {item.partnerId && item.partnerNickname && (
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 dark:text-blue-400 text-sm">
                      👤
                    </span>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      거래자: {item.partnerNickname}
                    </div>
                    <div
                      className={`text-xs font-medium ${
                        isFavorite
                          ? 'text-blue-700 dark:text-blue-400'
                          : 'text-gray-500 dark:text-gray-400'
                      }`}
                    >
                      {isFavorite ? '단골 거래자' : '일반 거래자'}
                    </div>
                  </div>
                </div>

                <button
                  onClick={
                    isFavorite ? handleRemoveFavorite : handleAddFavorite
                  }
                  disabled={isLoadingFavorite}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                    isFavorite
                      ? 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/30'
                      : 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/30'
                  } ${isLoadingFavorite ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {isLoadingFavorite ? (
                    <span className="flex items-center gap-1">
                      <div className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin"></div>
                      처리중
                    </span>
                  ) : isFavorite ? (
                    '단골 해제'
                  ) : (
                    '단골 등록'
                  )}
                </button>
              </div>
            </div>
          )}
          {/* 거래 정보 */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 space-y-2">
            <div className="text-sm text-gray-600 dark:text-gray-300">
              거래번호: {item.transactionNumber || '#0123_45678'}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              거래금액: {item.price.toLocaleString()}원
            </div>
            {item.cancelReason && (
              <div className="text-sm text-gray-600 dark:text-gray-300">
                취소 사유: {getCancelReasonText(item.cancelReason)}
              </div>
            )}
          </div>

          {/* 진행 단계 */}
          <ProgressStepsDetail
            steps={progressSteps}
            currentStep={progressSteps.filter((step) => step.isActive).length}
            type={type}
            cancelRequestedStatus={item.cancelRequestStatus ?? undefined}
          />

          {/* 거래 취소 요청 상태일 때 빨간색 화면 표시 */}
          {item.cancelRequestStatus === 'REQUESTED' && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg p-4 mb-3">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                  <span className="text-red-600 dark:text-red-400 text-xs">
                    ⚠️
                  </span>
                </div>
                <div className="text-red-800 dark:text-red-300 text-sm font-medium">
                  거래 취소가 접수되었습니다.
                </div>
              </div>
              {item.cancelRequestReason && (
                <div className="text-red-700 dark:text-red-300 text-sm">
                  취소 사유: {getCancelReasonText(item.cancelRequestReason)}
                </div>
              )}
            </div>
          )}

          {/* 첨부 이미지 표시 */}
          {type === 'purchase' &&
            item.status === 'DATA_SENT' &&
            attachmentImageUrl && (
              <div className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-4 mb-3">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 bg-gray-100 dark:bg-gray-600 rounded-full flex items-center justify-center">
                    <span className="text-gray-600 dark:text-gray-400 text-xs">
                      📷
                    </span>
                  </div>
                  <div className="text-gray-800 dark:text-gray-200 text-sm font-medium">
                    전송된 데이터 확인
                  </div>
                </div>
                <a
                  href={attachmentImageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full bg-white dark:bg-gray-800 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-600 hover:shadow-lg transition-shadow cursor-pointer"
                >
                  <div className="relative w-full h-80 bg-white dark:bg-gray-800">
                    <Image
                      src={attachmentImageUrl}
                      alt="전송된 데이터"
                      fill
                      className="object-contain hover:scale-105 transition-transform duration-200"
                      sizes="(max-width: 768px) 100vw, 600px"
                    />
                  </div>
                </a>
              </div>
            )}

          {/* DATA_SENT 상태일 때 판매자/구매자별 다른 UI */}
          {item.status === 'DATA_SENT' &&
            item.cancelRequestStatus !== 'REQUESTED' && (
              <>
                {/* 판매자일 때 대기 메시지 */}
                {type === 'sales' && (
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg p-4 mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center">
                        <span className="text-yellow-600 dark:text-yellow-400 text-xs">
                          ⏳
                        </span>
                      </div>
                      <div className="text-yellow-800 dark:text-yellow-300 text-sm">
                        구매자 데이터 수신 확인을 기다리고 있습니다.
                      </div>
                    </div>
                    <div className="text-red-600 dark:text-red-400 text-xs mt-2">
                      구매자 24시간 이내 수신확인 하지 않을 시, 거래 완료
                      처리됩니다.
                    </div>
                  </div>
                )}

                {/* 구매자일 때 데이터 수신 확인 버튼 */}
                {type === 'purchase' && (
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-4 mb-3">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 dark:text-blue-400 text-xs">
                          📥
                        </span>
                      </div>
                      <div className="text-blue-800 dark:text-blue-300 text-sm">
                        판매자가 데이터를 전송했습니다. 수신 확인해주세요.
                      </div>
                    </div>
                    <button
                      onClick={handleDataConfirm}
                      className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors"
                    >
                      데이터 수신 완료
                    </button>
                  </div>
                )}
              </>
            )}
          {item.status !== 'COMPLETED' &&
            item.cancelRequestStatus === 'REJECTED' &&
            type === 'purchase' && (
              <div className="text-red-700 dark:text-red-400 text-sm">
                판매자가 거래 취소를 거절했습니다.
              </div>
            )}
          {type === 'sales' &&
            progressSteps.filter((step) => step.isActive).length >= 1 &&
            progressSteps.filter((step) => step.isActive).length < 5 &&
            item.status !== 'DATA_SENT' &&
            item.cancelRequestStatus !== 'REQUESTED' &&
            item.cancelRequestStatus !== 'ACCEPTED' && (
              <DataUploadSection item={item} onDataSent={handleDataSent} />
            )}
        </div>

        {/* 하단 버튼 */}
        <div className="flex-col p-4 border-t border-gray-200 dark:border-gray-700 flex gap-2">
          {/* 거래 취소 접수 상태일 때 승낙/거절 버튼 */}
          {item.cancelRequestStatus === 'REQUESTED' && type === 'sales' && (
            <div className="flex gap-2 w-full">
              <button
                onClick={handleCancelAccept}
                className="flex-1 bg-green-500 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-green-600 transition-colors"
              >
                승낙
              </button>
              <button
                onClick={handleCancelReject}
                className="flex-1 bg-red-500 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-red-600 transition-colors"
              >
                거절
              </button>
            </div>
          )}

          {/* 거래 취소 버튼 */}
          {shouldShowCancelButton() && (
            <div className="flex w-full">
              <button
                onClick={handleTradeCancelClick}
                className="flex-1 bg-gray-400 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-gray-500 transition-colors"
              >
                거래 취소
              </button>
            </div>
          )}

          {/* 거래 취소 사유 선택 */}
          {showCancelReason && (
            <div className="space-y-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  취소 사유 선택
                </label>
                <select
                  value={selectedCancelReason}
                  onChange={(e) => setSelectedCancelReason(e.target.value)}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400"
                >
                  {type === 'sales' ? (
                    <>
                      <option value="SELLER_CHANGE_MIND">
                        판매자 단순 변심
                      </option>
                      <option value="SELLER_LIMIT_EXCEEDED">
                        판매자 기다리다가 포기
                      </option>
                    </>
                  ) : (
                    <>
                      <option value="BUYER_CHANGE_MIND">
                        구매자 단순 변심
                      </option>
                      <option value="BUYER_LIMIT_EXCEEDED">
                        구매자 기다리다가 포기
                      </option>
                    </>
                  )}
                </select>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleTradeCancelConfirm}
                  className="flex-1 bg-red-500 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-red-600 transition-colors"
                >
                  취소 확인
                </button>
                <button
                  onClick={() => setShowCancelReason(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg text-sm font-medium hover:bg-gray-400 transition-colors"
                >
                  취소
                </button>
              </div>
            </div>
          )}
          <button
            onClick={onClose}
            className="w-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-2 px-4 rounded-lg text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}
