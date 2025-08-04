'use client';

import React from 'react';

import { useMatchStore } from '../../(shared)/stores/match-store';
import CompletionHeader from './components/CompletionHeader';
import TransactionSummary from './components/TransactionSummary';
import EarningsDisplay from './components/EarningsDisplay';
import ActionButtons from './components/ActionButtons';
export default function CompletePage() {
  const { partner, userRole } = useMatchStore();

  // 거래 상대방 정보 (store에서 가져오거나 기본값)
  const partnerInfo = partner
    ? {
        ...partner,
        // userRole에 따라 상대방 정보 결정
        name:
          userRole === 'seller'
            ? partner.buyerNickname
            : partner.sellerNickName, // seller면 buyer 정보, buyer면 seller 정보
        data: partner.dataAmount, // dataAmount를 data로 매핑
        price: partner.priceGb, // priceGb를 price로 매핑
        rating:
          userRole === 'seller'
            ? partner.buyerRatingScore
            : partner.sellerRatingScore,
      }
    : {
        tradeId: 789,
        buyer: 'buyer@example.com',
        seller: 'seller@example.com',
        sellerId: 1,
        sellerNickName: 'seller',
        buyerId: 2,
        buyerNickname: 'buyer',
        buyerRatingScore: 4.9,
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
      };

  const completedAt = new Date().toLocaleString();

  // 보상 정보
  const POINTS_EARNED = 0;
  const BONUS_POINTS = 0; // 첫 거래 보너스
  const EXPERIENCE_GAINED = 10;

  return (
    <div className="min-h-screen flex flex-col bg-black">
      {/* 완료 헤더 */}
      <CompletionHeader />

      {/* 메인 콘텐츠 - 형광 블랙 배경 */}
      <main className="relative flex-1 px-4 py-8 bg-gradient-to-br from-gray-900 via-black to-gray-900 overflow-hidden">
        {/* 배경 글로우 효과 */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-400/5 via-transparent to-purple-300/3"></div>
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-green-400 rounded-full mix-blend-multiply filter blur-3xl opacity-5 animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-5 animate-pulse delay-1000"></div>

        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* 왼쪽 컬럼 */}
            <div className="space-y-6">
              <TransactionSummary
                partner={partnerInfo}
                tradeId={partnerInfo.tradeId}
                completedAt={completedAt}
              />

              <EarningsDisplay
                pointsEarned={POINTS_EARNED}
                bonusPoints={BONUS_POINTS}
                experienceGained={EXPERIENCE_GAINED}
              />
            </div>

            {/* 오른쪽 컬럼 */}
            <div className="space-y-6">
              <ActionButtons partner={partnerInfo} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
