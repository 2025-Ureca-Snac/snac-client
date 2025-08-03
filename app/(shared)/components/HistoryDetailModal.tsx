'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import type { HistoryDetailModalProps } from '../types/history-detail-modal';
import api from '../utils/api';

// API 응답 타입 정의
interface SendDataResponse {
  data: string;
  code: string;
  status: string;
  message: string;
  timestamp: string;
}

// 첨부 이미지 URL 응답 타입 정의
interface AttachmentUrlResponse {
  data: string;
  code: string;
  status: string;
  message: string;
  timestamp: string;
}
import {
  getHistoryStatusText,
  getHistoryStatusColor,
} from '../utils/history-status';
import { getCarrierImageUrl } from '../utils/carrier-utils';
import ProgressStepsDetail from './progress-steps-detail';
import { getProgressSteps } from '../utils/progress-steps-utils';
import { REASON_MAP } from '../constants/cancel-reasons';
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
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [showCancelReason, setShowCancelReason] = useState(false);
  const [selectedCancelReason, setSelectedCancelReason] = useState<string>('');
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoadingFavorite, setIsLoadingFavorite] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState<string>('');
  const [uploadMessageType, setUploadMessageType] = useState<
    'success' | 'error' | ''
  >('');
  const [attachmentImageUrl, setAttachmentImageUrl] = useState<string>('');
  const [isLoadingImage, setIsLoadingImage] = useState(false);

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
          setIsLoadingImage(true);
          const response = await api.get<AttachmentUrlResponse>(
            `/trades/${item.id}/attachment-url`
          );

          if (response.data.status === 'OK' && response.data.data) {
            setAttachmentImageUrl(response.data.data);
          }
        } catch (error) {
          console.error('첨부 이미지 URL 가져오기 실패:', error);
        } finally {
          setIsLoadingImage(false);
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
    } catch (error) {
      console.error('단골 등록 실패:', error);
    } finally {
      setIsLoadingFavorite(false);
    }
  };

  // 단골 삭제
  const handleRemoveFavorite = async () => {
    if (!item?.partnerId) return;

    try {
      setIsLoadingFavorite(true);
      await api.delete(`/favorites/${item.partnerId}`);
      setIsFavorite(false);
    } catch (error) {
      console.error('단골 삭제 실패:', error);
    } finally {
      setIsLoadingFavorite(false);
    }
  };

  // 파일 업로드 핸들러
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    console.log('파일 선택됨:', file.name);
    setUploadedFile(file);
  };
  // 전송완료 핸들러
  const handleDataSent = async () => {
    if (!uploadedFile) {
      console.log('업로드된 파일이 없습니다.');
      return;
    }

    try {
      setIsUploading(true);
      setUploadMessage('');
      setUploadMessageType('');

      console.log('전송완료 버튼 클릭됨:', item);

      const formData = new FormData();
      formData.append('file', uploadedFile);

      const response = await api.patch<SendDataResponse>(
        `/trades/${item.id}/send-data`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      console.log('데이터 전송 완료 처리됨', response);

      // 응답 상태에 따른 처리
      if (response.data.status === 'OK') {
        // 성공 시 페이지 새로고침
        window.location.reload();
      } else if (response.data.status === 'BAD_REQUEST') {
        // 이미지 기준 미충족 시 안내 메시지 표시
        setUploadMessage(response.data.data || '다른 사진을 보내주세요.');
        setUploadMessageType('error');
      } else if (response.data.status === 'GATEWAY_TIMEOUT') {
        // 타임아웃 시 안내 메시지 표시
        setUploadMessage(
          '이미지 검증 중에 문제가 발생했습니다. 잠시후 다시시도해주세요.'
        );
        setUploadMessageType('error');
      } else {
        // 기타 오류 시 기본 메시지
        setUploadMessage(
          '이미지 업로드 중 오류가 발생했습니다. 다시 시도해주세요.'
        );
        setUploadMessageType('error');
      }

      setUploadedFile(null); // 전송 완료 후 파일 정보 초기화
    } catch (error) {
      console.error('데이터 전송 완료 처리 실패:', error);
      setUploadMessage(
        '이미지 업로드 중 오류가 발생했습니다. 다시 시도해주세요.'
      );
      setUploadMessageType('error');
    } finally {
      setIsUploading(false);
    }
  };

  // 데이터 수신 확인 핸들러
  const handleDataConfirm = async () => {
    try {
      console.log('데이터 수신 확인 버튼 클릭됨:', item);

      const response = await api.patch(`/trades/${item.id}/confirm`);

      console.log('데이터 수신 확인 완료:', response);

      // 성공 시 페이지 새로고침
      window.location.reload();
    } catch (error) {
      console.error('데이터 수신 확인 실패:', error);
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
      console.log('거래 취소 확인 버튼 클릭됨:', item);

      const response = await api.patch(`/trades/${item.id}/cancel/request`, {
        reason: selectedCancelReason,
      });

      console.log('거래 취소 처리 완료:', response);

      // 성공 시 페이지 새로고침
      window.location.reload();
    } catch (error) {
      console.error('거래 취소 처리 실패:', error);
    }
  };

  // 거래 취소 거절 핸들러
  const handleCancelReject = async () => {
    try {
      console.log('거래 취소 거절 버튼 클릭됨:', item);

      const response = await api.patch(`/trades/${item.id}/cancel/reject`);

      console.log('거래 취소 거절 처리 완료:', response);

      // 성공 시 페이지 새로고침
      window.location.reload();
    } catch (error) {
      console.error('거래 취소 거절 처리 실패:', error);
    }
  };

  // 거래 취소 승낙 핸들러
  const handleCancelAccept = async () => {
    try {
      console.log('거래 취소 승낙 버튼 클릭됨:', item);

      const response = await api.patch(`/trades/${item.id}/cancel/accept`);

      console.log('거래 취소 승낙 처리 완료:', response);

      // 성공 시 페이지 새로고침
      window.location.reload();
    } catch (error) {
      console.error('거래 취소 승낙 처리 실패:', error);
    }
  };

  // 진행 단계 생성
  const progressSteps = getProgressSteps(type, item.status);
  console.log('test:', item);
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-300">
        {/* 헤더 */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">
            {type === 'purchase' ? '구매' : '판매'} 상세 정보
          </h2>
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
              <div className="text-sm text-gray-500 mb-1">{item.date}</div>
              <div className="font-semibold text-gray-900 mb-1">
                {item.title}
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`text-white text-xs px-2 py-1 rounded ${
                    item.cancelRequested
                      ? 'bg-red-500'
                      : getHistoryStatusColor(type, item.status)
                  }`}
                >
                  {item.cancelRequested
                    ? '취소 접수'
                    : getHistoryStatusText(type, item.status)}
                </span>
                <span className="text-gray-900">
                  {item.price.toLocaleString()}원
                </span>
              </div>
            </div>
          </div>

          {/* 파트너 정보 */}
          {item.partnerId && item.partnerNickname && (
            <div className="bg-blue-50 rounded-lg p-3 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 text-sm">👤</span>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      거래자: {item.partnerNickname}
                    </div>
                    <div
                      className={`text-xs font-medium ${
                        isFavorite ? 'text-blue-700' : 'text-gray-500'
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
                      ? 'bg-red-100 text-red-700 hover:bg-red-200'
                      : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
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
          <div className="bg-gray-50 rounded-lg p-3 space-y-2">
            <div className="text-sm text-gray-600">
              거래번호: {item.transactionNumber || '#0123_45678'}
            </div>
            <div className="text-sm text-gray-600">
              거래금액: {item.price.toLocaleString()}원
            </div>
            {item.cancelReason && (
              <div className="text-sm text-gray-600">
                취소 사유: {getCancelReasonText(item.cancelReason)}
              </div>
            )}
          </div>

          {/* 진행 단계 */}
          <ProgressStepsDetail
            steps={progressSteps}
            currentStep={progressSteps.filter((step) => step.isActive).length}
            type={type}
            cancelRequested={item.cancelRequested}
          />

          {/* 거래 취소 요청 상태일 때 빨간색 화면 표시 */}
          {item.cancelRequested && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-3">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center">
                  <span className="text-red-600 text-xs">⚠️</span>
                </div>
                <div className="text-red-800 text-sm font-medium">
                  거래 취소가 접수되었습니다.
                </div>
              </div>
              {item.cancelRequestReason && (
                <div className="text-red-700 text-sm">
                  취소 사유: {getCancelReasonText(item.cancelRequestReason)}
                </div>
              )}
            </div>
          )}

          {/* 상태에 따라 메시지 조건부 표시 */}
          {item.status !== 'DATA_SENT' &&
            item.status !== 'COMPLETED' &&
            item.status !== 'CANCELED' &&
            !item.cancelRequested && (
              <div className="text-green-600 text-sm">
                {type === 'sales'
                  ? '판매요청이 접수되었습니다.'
                  : '구매글이 등록 되었습니다.'}
              </div>
            )}

          {/* 첨부 이미지 표시 */}
          {(item.status === 'DATA_SENT' || item.status === 'COMPLETED') &&
            attachmentImageUrl && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-3">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center">
                    <span className="text-gray-600 text-xs">📷</span>
                  </div>
                  <div className="text-gray-800 text-sm font-medium">
                    전송된 데이터 확인
                  </div>
                </div>
                <a
                  href={attachmentImageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full bg-white rounded-lg overflow-hidden border hover:shadow-lg transition-shadow cursor-pointer"
                >
                  <div className="relative w-full h-80 bg-white">
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

          {/* 이미지 로딩 중 표시 */}
          {(item.status === 'DATA_SENT' || item.status === 'COMPLETED') &&
            isLoadingImage && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-3">
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-gray-600 text-sm">
                    이미지 로딩 중...
                  </span>
                </div>
              </div>
            )}

          {/* DATA_SENT 상태일 때 판매자/구매자별 다른 UI */}
          {item.status === 'DATA_SENT' && !item.cancelRequested && (
            <>
              {/* 판매자일 때 대기 메시지 */}
              {type === 'sales' && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center">
                      <span className="text-yellow-600 text-xs">⏳</span>
                    </div>
                    <div className="text-yellow-800 text-sm">
                      구매자 데이터 수신 확인을 기다리고 있습니다.
                    </div>
                  </div>
                  <div className="text-red text-xs mt-2">
                    구매자 24시간 이내 수신확인 하지 않을 시, 거래 완료
                    처리됩니다.
                  </div>
                </div>
              )}

              {/* 구매자일 때 데이터 수신 확인 버튼 */}
              {type === 'purchase' && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-3">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 text-xs">📥</span>
                    </div>
                    <div className="text-blue-800 text-sm">
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

          {type === 'sales' &&
            progressSteps.filter((step) => step.isActive).length >= 1 &&
            progressSteps.filter((step) => step.isActive).length < 5 &&
            item.status !== 'DATA_SENT' &&
            !item.cancelRequested && (
              <div className="space-y-3">
                <div className="text-gray-700 text-sm">
                  아래 번호로{' '}
                  <a
                    href={
                      item.carrier === 'SKT'
                        ? 'https://www.tworld.co.kr/web/myt-data/giftdata?menuNm=T+끼리+데이터+선물'
                        : item.carrier === 'KT'
                          ? 'https://www.kt.com/mypage/benefit/data-gift'
                          : item.carrier === 'LGU+'
                            ? 'https://www.lguplus.co.kr/mypage/benefit/data-gift'
                            : 'https://www.tworld.co.kr/web/myt-data/giftdata?menuNm=T+끼리+데이터+선물'
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 underline"
                  >
                    {item.carrier || 'SKT'}
                  </a>
                  통신사의 데이터{item.dataAmount || '2GB'}를 전송해주세요
                </div>

                {/* 전화번호 표시 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    전화번호
                  </label>
                  <div className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-base font-semibold text-gray-900">
                    {item.phoneNumber || '010-0000-0000'}
                  </div>
                </div>

                {/* 업로드된 파일 정보 */}
                {uploadedFile && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 text-xs">📎</span>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-blue-900">
                            {uploadedFile.name}
                          </div>
                          <div className="text-xs text-blue-600">
                            {(uploadedFile.size / 1024).toFixed(1)} KB
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => setUploadedFile(null)}
                        className="text-blue-500 hover:text-blue-700 text-sm"
                      >
                        삭제
                      </button>
                    </div>
                  </div>
                )}

                {/* 업로드 메시지 표시 */}
                {uploadMessage && (
                  <div
                    className={`p-3 rounded-lg text-sm ${
                      uploadMessageType === 'error'
                        ? 'bg-red-50 border border-red-200 text-red-800'
                        : 'bg-green-50 border border-green-200 text-green-800'
                    }`}
                  >
                    {uploadMessage}
                  </div>
                )}

                {/* 액션 버튼 */}
                <div className="flex gap-2">
                  <label className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors cursor-pointer text-center">
                    파일 업로드
                    <input
                      type="file"
                      onChange={handleFileUpload}
                      className="hidden"
                      accept=".webp,.jpg,.jpeg,.png"
                    />
                  </label>
                  <button
                    onClick={handleDataSent}
                    disabled={!uploadedFile || isUploading}
                    className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                      uploadedFile && !isUploading
                        ? 'bg-green-500 text-white hover:bg-green-600'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {isUploading ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        업로드 중입니다
                      </div>
                    ) : (
                      '전송완료'
                    )}
                  </button>
                </div>
              </div>
            )}
        </div>

        {/* 하단 버튼 */}
        <div className="flex-col p-4 border-t flex gap-2">
          {/* 거래 취소 접수 상태일 때 승낙/거절 버튼 */}
          {item.cancelRequested && type === 'sales' && (
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
          {item.status !== 'CANCELED' &&
            item.status !== 'COMPLETED' &&
            !item.cancelRequested && (
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
            <div className="space-y-3 p-3 bg-gray-50 rounded-lg">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  취소 사유 선택
                </label>
                <select
                  value={selectedCancelReason}
                  onChange={(e) => setSelectedCancelReason(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
            className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}
