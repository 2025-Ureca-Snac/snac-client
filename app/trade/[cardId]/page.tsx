import React from 'react';
import { notFound } from 'next/navigation';
import { api } from '@/app/(shared)/utils/api';
import { CardData } from '@/app/(shared)/types/card';
import TradeContent from './trade-content';
import TradePageClient from './trade-page-client';
import StructuredData from './components/structured-data';

interface TradePageProps {
  params: Promise<{
    cardId: string;
  }>;
}

export default async function TradePage({ params }: TradePageProps) {
  const { cardId } = await params;

  try {
    console.log('카드 정보 조회 시작:', cardId);
    const response = await api.get(`/cards/${cardId}`);
    console.log('카드 정보 조회 성공:', response.data);
    const responseData = response.data as { data: CardData };
    const cardData = responseData.data;

    return (
      <>
        <StructuredData cardData={cardData} />

        <div className="min-h-screen bg-white">
          <div className="max-w-4xl mx-auto p-4">
            {/* 서버 컴포넌트로 렌더링되는 거래 내용 */}
            <TradeContent cardData={cardData}>
              {/* 클라이언트 컴포넌트 - 인터랙션만 담당 */}
              <TradePageClient cardData={cardData} />
            </TradeContent>
          </div>
        </div>
      </>
    );
  } catch (error) {
    console.error('카드 정보 가져오기 실패:', error);
    console.error('에러 상세 정보:', {
      status: (error as { response?: { status: number } })?.response?.status,
      data: (error as { response?: { data: unknown } })?.response?.data,
      message: (error as { message?: string })?.message,
    });
    notFound();
  }
}
