'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ModalPortal from './modal-portal';
import { PriceUnit } from '../types';
import { api } from '../utils/api';
import { CardData } from '../types/card';

interface TradeConfirmationModalProps {
  modalItem: CardData | null;
  onClose: () => void;
  unit: PriceUnit;
}

const formatCarrierName = (carrier: string): string =>
  carrier === 'LG' ? 'LGU+' : carrier;

const formatDataAmount = (amountInMB: number): string =>
  amountInMB >= 1024 && amountInMB % 1024 === 0
    ? `${amountInMB / 1024}GB`
    : `${amountInMB}MB`;

export default function TradeConfirmationModal({
  modalItem,
  onClose,
  unit,
}: TradeConfirmationModalProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // 모달이 열릴 때 에러 상태 초기화
  useEffect(() => {
    if (modalItem) {
      setError(null);
      setIsLoading(false);
    }
  }, [modalItem]);

  const handleConfirm = async () => {
    if (!modalItem) return;

    if (modalItem.cardCategory === 'SELL') {
      setError(null);
      setIsLoading(true);

      try {
        console.log('구매 거래 요청 시작:', modalItem);
        // 구매 거래 요청 생성
        const response = await api.get(`/cards/${modalItem.id}`);

        console.log('구매 거래 요청 성공:', response.data);

        // sellStatus 확인
        if (
          (response.data as { data: { sellStatus: string } }).data
            .sellStatus === 'SELLING'
        ) {
          const queryParams = new URLSearchParams({
            id: modalItem.id.toString(),
            pay: 'buy',
          });

          router.push(`/payment?${queryParams.toString()}`);
          onClose(); // 성공 시에만 모달 닫기
        } else {
          // 이미 판매된 경우
          setError('이미 다른 사용자가 구매한 카드입니다.');
        }
      } catch (error) {
        console.error('구매 거래 요청 실패:', error);

        // 에러 코드에 따른 메시지 설정
        const status = (error as { response?: { status: number } })?.response
          ?.status;
        let errorMessage = '구매 거래 요청에 실패했습니다. 다시 시도해주세요.';

        switch (status) {
          case 400:
            errorMessage = '입력값이 올바르지 않습니다.';
            break;
          case 401:
            errorMessage = '인증되지 않은 사용자입니다.';
            break;
          case 403:
            errorMessage = '타인의 글만 요청 가능합니다.';
            break;
          case 404:
            errorMessage = '카드가 존재하지 않습니다.';
            break;
          default:
            errorMessage = '구매 거래 요청에 실패했습니다. 다시 시도해주세요.';
        }

        setError(errorMessage);
        // 에러 시에는 모달을 닫지 않음
      } finally {
        setIsLoading(false);
      }
    } else {
      const confirmed = window.confirm('판매하시겠습니까?');
      if (confirmed) {
        console.log('판매 확정:', modalItem);
        // TODO: 구매자 로직 추가
      }
      onClose(); // 판매 로직에서는 모달 닫기
    }
  };

  return (
    <ModalPortal
      isOpen={!!modalItem}
      onClose={onClose}
      className="bg-black bg-opacity-50 flex items-center justify-center"
    >
      {modalItem && (
        <div className="bg-white rounded-lg p-6 w-10/12 max-w-sm max-h-[60vh] overflow-y-auto">
          <h3 className="text-regular-md font-bold text-left mb-1">
            {modalItem.cardCategory === 'BUY' ? '판매하기' : '구매하기'}
          </h3>

          <p className="text-left text-regular-sm text-gray-600 mb-4">
            아래 정보를 확인해주세요
          </p>
          <h2 className="text-heading-2xl font-bold text-center mb-2">
            {formatCarrierName(modalItem.carrier)} 데이터{' '}
            {formatDataAmount(modalItem.dataAmount)}{' '}
          </h2>

          <p className="text-center mb-6">
            {modalItem.price.toLocaleString()}
            {unit === 'snack' ? '스낵' : '₩'}에{' '}
            {modalItem.cardCategory === 'BUY' ? '판매합니다' : '구매합니다'}.
          </p>

          {/* 에러 메시지 표시 */}
          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red rounded-lg">
              <p className="text-red text-sm">{error}</p>
            </div>
          )}

          <div className="mt-6 flex flex-col space-y-2">
            <button
              onClick={handleConfirm}
              disabled={isLoading || !!error}
              className={`w-full py-2 rounded ${
                modalItem.cardCategory === 'SELL'
                  ? 'bg-midnight-black text-white'
                  : 'bg-candy-pink text-white'
              } ${isLoading || error ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isLoading
                ? '처리중...'
                : modalItem.cardCategory === 'SELL'
                  ? '구매하기'
                  : '판매하기'}
            </button>

            <button
              onClick={onClose}
              disabled={isLoading}
              className={`w-full py-2 rounded border ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              취소하기
            </button>
          </div>
        </div>
      )}
    </ModalPortal>
  );
}
