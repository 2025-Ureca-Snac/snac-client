'use client';

import { useState } from 'react';
import Image from 'next/image';
import type { HistoryDetailModalProps } from '../types/history-detail-modal';
import api from '../utils/api';
import {
  getHistoryStatusText,
  getHistoryStatusColor,
} from '../utils/history-status';
import { getCarrierImageUrl } from '../utils/carrier-utils';

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

  if (!open || !item) return null;

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
      console.log('전송완료 버튼 클릭됨:', item);

      const formData = new FormData();
      formData.append('file', uploadedFile);

      const response = await api.patch(
        `/trades/${item.id}/send-data`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      console.log('데이터 전송 완료 처리됨', response);
      setUploadedFile(null); // 전송 완료 후 파일 정보 초기화

      // 성공 시 페이지 새로고침
      window.location.reload();
    } catch (error) {
      console.error('데이터 전송 완료 처리 실패:', error);
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

  // 전송실패 핸들러
  const handleDataFail = async () => {
    try {
      console.log('전송실패 버튼 클릭됨:', item);

      // 판매자/구매자에 따라 다른 reason 설정
      const reason =
        type === 'sales'
          ? 'SELLER_FORCED_TERMINATION'
          : 'BUYER_FORCED_TERMINATION';

      const response = await api.patch(`/trades/${item.id}/cancel/request`, {
        reason: reason,
      });

      console.log('전송실패 처리 완료:', response);

      // 성공 시 페이지 새로고침
      window.location.reload();
    } catch (error) {
      console.error('전송실패 처리 실패:', error);
    }
  };

  // 상태별 진행 단계 계산
  const getCurrentStep = () => {
    switch (item.status) {
      case 'BUY_REQUESTED':
      case 'SELL_REQUESTED':
        return 1;
      case 'ACCEPTED':
        return 2;
      case 'PAYMENT_CONFIRMED':
        return 3;
      case 'DATA_SENT':
        return 4;
      case 'COMPLETED':
      case 'AUTO_REFUND':
      case 'AUTO_PAYOUT':
        return 5;
      case 'CANCELED':
        return 0; // 취소된 경우
      default:
        return 1;
    }
  };

  const currentStep = getCurrentStep();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
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
                  className={`text-white text-xs px-2 py-1 rounded ${getHistoryStatusColor(type, item.status)}`}
                >
                  {getHistoryStatusText(type, item.status)}
                </span>
                <span className="text-gray-900">
                  {item.price.toLocaleString()}원
                </span>
              </div>
            </div>
          </div>

          {/* 거래 정보 */}
          <div className="bg-gray-50 rounded-lg p-3 space-y-2">
            <div className="text-sm text-gray-600">
              거래번호: {item.transactionNumber || '#0123_45678'}
            </div>
            <div className="text-sm text-gray-600">
              거래금액: {item.price.toLocaleString()}원
            </div>
          </div>

          {/* 진행 단계 */}
          <div className="space-y-3">
            <h3 className="font-medium text-gray-900">진행 단계</h3>
            <div className="flex items-center justify-between">
              {/* 1단계: 구매요청/판매요청 */}
              <div className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                    currentStep >= 1
                      ? 'bg-black text-white'
                      : 'bg-gray-300 text-gray-600'
                  }`}
                >
                  1
                </div>
                <div
                  className={`text-xs text-center whitespace-nowrap mt-1 ${
                    currentStep >= 1
                      ? 'text-black font-medium underline'
                      : 'text-gray-500'
                  }`}
                >
                  구매글 등록
                </div>
              </div>
              <div
                className={`w-full h-0.5 ${currentStep >= 2 ? 'bg-black' : 'bg-gray-300'}`}
              />

              {/* 2단계: 수락 */}
              <div className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                    currentStep >= 2
                      ? 'bg-black text-white'
                      : 'bg-gray-300 text-gray-600'
                  }`}
                >
                  2
                </div>
                <div
                  className={`text-center whitespace-nowrap text-xs mt-1 ${
                    currentStep >= 2
                      ? 'text-black font-medium underline'
                      : 'text-gray-500'
                  }`}
                >
                  결제완료
                </div>
              </div>
              <div
                className={`w-full h-0.5 ${currentStep >= 3 ? 'bg-black' : 'bg-gray-300'}`}
              />

              {/* 3단계: 결제완료 */}
              <div className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                    currentStep >= 3
                      ? 'bg-black text-white'
                      : 'bg-gray-300 text-gray-600'
                  }`}
                >
                  3
                </div>
                <div
                  className={`text-center whitespace-nowrap text-xs mt-1 ${
                    currentStep >= 3
                      ? 'text-black font-medium  underline'
                      : 'text-gray-500'
                  }`}
                >
                  {type === 'purchase' ? '판매자 매칭' : '구매자 매칭'}
                </div>
              </div>
              <div
                className={`w-full h-0.5 ${currentStep >= 4 ? 'bg-black' : 'bg-gray-300'}`}
              />

              {/* 4단계: 데이터 송신완료 */}
              <div className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                    currentStep >= 4
                      ? 'bg-black text-white'
                      : 'bg-gray-300 text-gray-600'
                  }`}
                >
                  4
                </div>
                <div
                  className={`text-center whitespace-nowrap text-xs mt-1 ${
                    currentStep >= 4
                      ? 'text-black font-medium underline'
                      : 'text-gray-500'
                  }`}
                >
                  판매자 데이터 송신
                </div>
              </div>
              <div
                className={`w-full h-0.5 ${currentStep >= 5 ? 'bg-black' : 'bg-gray-300'}`}
              />

              {/* 5단계: 거래완료 */}
              <div className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                    currentStep >= 5
                      ? 'bg-black text-white'
                      : 'bg-gray-300 text-gray-600'
                  }`}
                >
                  5
                </div>
                <div
                  className={`text-center whitespace-nowrap text-xs mt-1 ${
                    currentStep >= 5
                      ? 'text-black font-medium underline'
                      : 'text-gray-500'
                  }`}
                >
                  거래완료
                </div>
              </div>
            </div>
          </div>
          {/* 상태에 따라 메시지 조건부 표시 */}
          {item.status !== 'DATA_SENT' &&
            item.status !== 'COMPLETED' &&
            item.status !== 'CANCELED' && (
              <div className="text-green-600 text-sm">
                {type === 'sales'
                  ? '판매요청이 접수되었습니다.'
                  : '구매글이 등록 되었습니다.'}
              </div>
            )}

          {/* DATA_SENT 상태일 때 판매자/구매자별 다른 UI */}
          {item.status === 'DATA_SENT' && (
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

          {/* 진행 중인 거래인 경우에만 추가 정보 표시 (DATA_SENT 상태가 아닐 때만) */}
          {type === 'sales' &&
            currentStep >= 1 &&
            currentStep < 5 &&
            item.status !== 'DATA_SENT' && (
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

                {/* 액션 버튼 */}
                <div className="flex gap-2">
                  <label className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors cursor-pointer text-center">
                    파일 업로드
                    <input
                      type="file"
                      onChange={handleFileUpload}
                      className="hidden"
                      accept=".txt,.pdf,.doc,.docx,.jpg,.jpeg,.png"
                    />
                  </label>
                  <button
                    onClick={handleDataSent}
                    disabled={!uploadedFile}
                    className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                      uploadedFile
                        ? 'bg-green-500 text-white hover:bg-green-600'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    전송완료
                  </button>
                  <button
                    onClick={handleDataFail}
                    className="flex-1 bg-red-500 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-red-600 transition-colors"
                  >
                    전송실패
                  </button>
                </div>
              </div>
            )}
        </div>

        {/* 하단 버튼 */}
        <div className="p-4 border-t">
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
