'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/app/(shared)/utils/api';
import { ApiResponse } from '@/app/(shared)/types/api';
import { CardData } from '@/app/(shared)/types/card';
import ActionButtons from './components/action-buttons';

interface TradePageClientProps {
  cardData: CardData;
}

export default function TradePageClient({ cardData }: TradePageClientProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleConfirm = async () => {
    if (cardData.cardCategory === 'SELL') {
      setError(null);
      setIsProcessing(true);

      try {
        console.log('구매 거래 요청 시작:', cardData);
        // 구매 거래 요청 생성
        const response = await api.get<ApiResponse<{ sellStatus: string }>>(
          `/cards/${cardData.id}`
        );

        console.log('구매 거래 요청 성공:', response.data);

        // sellStatus 확인
        if (response.data.data.sellStatus === 'SELLING') {
          const queryParams = new URLSearchParams({
            id: cardData.id.toString(),
            pay: 'buy',
          });

          router.push(`/payment?${queryParams.toString()}`);
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
      } finally {
        setIsProcessing(false);
      }
    } else {
      const confirmed = window.confirm('판매하시겠습니까?');
      if (confirmed) {
        setError(null);
        setIsProcessing(true);

        try {
          console.log('판매 확정 요청 시작:', cardData);
          // 판매 확정 API 요청
          const response = await api.post(`/trades/buy/accept`, {
            cardId: cardData.id,
          });

          console.log('판매 확정 응답:', response.data);

          // 성공 시 판매 내역 페이지로 이동
          const responseData = response.data as { data: { tradeId?: string } };
          console.log('판매 확정 응답:', responseData);
          if (responseData && responseData.data.tradeId) {
            router.push(`/mypage/sales-history/${responseData.data.tradeId}`);
          } else {
            setError('거래 ID를 받지 못했습니다.');
          }
        } catch (error) {
          console.error('판매 확정 요청 실패:', error);

          const errorMessage = (
            error as { response?: { data: { message: string } } }
          )?.response?.data.message;

          setError(
            errorMessage || '판매 확정에 실패했습니다. 다시 시도해주세요.'
          );
        } finally {
          setIsProcessing(false);
        }
      }
    }
  };

  const handleCancel = () => {
    router.push('/cards');
  };

  return (
    <ActionButtons
      cardInfo={cardData}
      isProcessing={isProcessing}
      error={error}
      onConfirm={handleConfirm}
      onCancel={handleCancel}
    />
  );
}
