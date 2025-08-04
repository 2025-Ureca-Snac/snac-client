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
    const response = await api.get(`/cards/${cardId}`);
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
    notFound();
  }
}
