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
  const { partner } = useMatchStore();

  // 거래 상대방 정보 (store에서 가져오거나 기본값)
  const partnerInfo = partner
    ? {
        ...partner,
        name: partner.type === 'seller' ? partner.buyer : partner.seller, // 상대방 이름
        data: partner.dataAmount, // dataAmount를 data로 매핑
        price: partner.priceGb, // priceGb를 price로 매핑
        rating: partner.sellerRatingScore,
        transactionCount: partner.id.toString(),
      }
    : {
        id: 789,
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
        name: 'user07',
        data: 2,
        price: 2000,
        rating: 4.9,
        transactionCount: '156',
      };

  // 거래 정보
  const transactionId = 'TXN-' + Date.now();
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
                transactionId={transactionId}
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

              {/* 고객 지원 */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">
                  고객 지원
                </h2>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <span className="text-2xl">📞</span>
                    <div>
                      <div className="font-medium text-gray-700">고객센터</div>
                      <div className="text-sm text-gray-600">
                        1588-0000 (24시간)
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <span className="text-2xl">💬</span>
                    <div>
                      <div className="font-medium text-gray-700">
                        실시간 채팅
                      </div>
                      <div className="text-sm text-gray-600">
                        즉시 문의 가능
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <span className="text-2xl">📧</span>
                    <div>
                      <div className="font-medium text-gray-700">
                        이메일 문의
                      </div>
                      <div className="text-sm text-gray-600">
                        support@snac.com
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
