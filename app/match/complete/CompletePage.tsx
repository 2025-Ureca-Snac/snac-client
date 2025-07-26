'use client';

import React from 'react';
import { Header } from '../../(shared)/components/Header';
import { Footer } from '../../(shared)/components/Footer';
import { useMatchStore } from '../../(shared)/stores/match-store';
import CompletionHeader from './components/CompletionHeader';
import TransactionSummary from './components/TransactionSummary';
import EarningsDisplay from './components/EarningsDisplay';
import ActionButtons from './components/ActionButtons';

export default function CompletePage() {
  const { partner, userRole } = useMatchStore();
  console.log('마지막보자:', partner);
  console.log('현재 사용자 역할:', userRole);

  // 거래 상대방 정보 (store에서 가져오거나 기본값)
  const partnerInfo = partner
    ? {
        ...partner,
        // userRole에 따라 상대방 정보 결정
        name: userRole === 'seller' ? partner.buyer : partner.seller, // seller면 buyer 정보, buyer면 seller 정보
        data: partner.dataAmount, // dataAmount를 data로 매핑
        price: partner.priceGb, // priceGb를 price로 매핑
        rating: partner.sellerRatingScore,
      }
    : {
        tradeId: 789,
        buyer: 'buyer@example.com',
        seller: 'seller@example.com',
        cardId: 789,
        carrier: 'KT',
        dataAmount: 2,
        phone: '010-0000-0000',
        point: 0,
        priceGb: 2000,
        sellerRatingScore: 4.9,
        status: 'COMPLETED',
        cancelReason: null,
        type: 'seller' as const,
        name:
          userRole === 'seller' ? 'buyer@example.com' : 'seller@example.com', // userRole에 따라 기본값도 설정
        data: 2,
        price: 2000,
        rating: 4.9,
        transactionCount: '156',
      };

  const completedAt = new Date().toLocaleString();

  // 보상 정보
  const pointsEarned = 100;
  const bonusPoints = 50; // 첫 거래 보너스
  const experienceGained = 25;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      {/* 완료 헤더 */}
      <CompletionHeader />

      {/* 메인 콘텐츠 */}
      <main className="flex-1 px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* 왼쪽 컬럼 */}
            <div className="space-y-6">
              <TransactionSummary
                partner={partnerInfo}
                tradeId={partnerInfo.tradeId}
                completedAt={completedAt}
              />

              <EarningsDisplay
                pointsEarned={pointsEarned}
                bonusPoints={bonusPoints}
                experienceGained={experienceGained}
              />
            </div>

            {/* 오른쪽 컬럼 */}
            <div className="space-y-6">
              <ActionButtons />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
