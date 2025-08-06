'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/app/(shared)/utils/api';
import { ApiResponse } from '@/app/(shared)/types/api';
import { CardData } from '@/app/(shared)/types/card';
import { toast } from 'sonner';
import { useAuthStore } from '@/app/(shared)/stores/auth-store';
import { AuthState } from '@/app/(shared)/types/auth-store';

import ActionButtons from './components/action-buttons';
import { ConfirmationModal } from '@/app/(shared)/components/ConfirmationModal';

interface TradePageClientProps {
  cardData: CardData;
}

export default function TradePageClient({ cardData }: TradePageClientProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const loggedInUser = useAuthStore((state: AuthState) => state.user);

  const handleConfirm = async () => {
    // 로그인 상태 확인
    if (!loggedInUser) {
      toast.error('로그인 후 이용이 가능합니다.');
      router.push('/login');
      return;
    }

    if (cardData.cardCategory === 'SELL') {
      setError(null);
      setIsProcessing(true);

      try {
        //.log('구매 거래 요청 시작:', cardData);
        // 구매 거래 요청 생성
        const response = await api.get<ApiResponse<{ sellStatus: string }>>(
          `/cards/${cardData.id}`
        );

        //.log('구매 거래 요청 성공:', response.data);

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
        //.error('구매 거래 요청 실패:', error);

        // 에러 코드에 따른 메시지 설정
        const status = (error as { response?: { status: number } })?.response
          ?.status;
        let errorMessage = '구매 거래 요청에 실패했습니다. 다시 시도해주세요.';

        switch (status) {
          case 400:
            errorMessage = '입력값이 올바르지 않습니다.';
            break;
          case 401:
            errorMessage = '로그인 후 이용이 가능합니다.';
            toast.error('로그인 후 이용이 가능합니다.');
            router.push('/login');
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
      setShowConfirmModal(true);
    }
  };

  const handleConfirmSale = async () => {
    setShowConfirmModal(false);
    setError(null);
    setIsProcessing(true);

    try {
      //.log('판매 확정 요청 시작:', cardData);
      // 판매 확정 API 요청
      const response = await api.post(`/trades/buy/accept`, {
        cardId: cardData.id,
      });

      //.log('판매 확정 응답:', response.data);

      // 성공 시 판매 내역 페이지로 이동
      const responseData = response.data as { data: { tradeId?: string } };
      //.log('판매 확정 응답:', responseData);
      if (responseData && responseData.data.tradeId) {
        router.push(`/mypage/sales-history/${responseData.data.tradeId}`);
      } else {
        setError('거래 ID를 받지 못했습니다.');
      }
    } catch (error) {
      //.error('판매 확정 요청 실패:', error);

      const status = (error as { response?: { status: number } })?.response
        ?.status;

      if (status === 401) {
        toast.error('로그인 후 이용이 가능합니다.');
        router.push('/login');
        return;
      }

      const errorMessage = (
        error as { response?: { data: { message: string } } }
      )?.response?.data.message;

      setError(errorMessage || '판매 확정에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancelSale = () => {
    setShowConfirmModal(false);
  };

  const handleCancel = () => {
    router.push('/cards');
  };

  return (
    <>
      <ActionButtons
        cardInfo={cardData}
        isProcessing={isProcessing}
        error={error}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
      <ConfirmationModal
        isOpen={showConfirmModal}
        title="판매 확정"
        message="판매하시겠습니까?"
        confirmText="판매"
        cancelText="취소"
        onConfirm={handleConfirmSale}
        onCancel={handleCancelSale}
      />
    </>
  );
}
