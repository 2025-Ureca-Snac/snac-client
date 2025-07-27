'use client';

import React from 'react';
import { MatchPartner } from '@/app/(shared)/stores/match-store';

interface WaitingPaymentStepProps {
  partner: MatchPartner;
}

export default function WaitingPaymentStep({
  partner,
}: WaitingPaymentStepProps) {
  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
      <div className="text-center">
        {/* 로딩 애니메이션 */}
        <div className="mb-6">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-500 mx-auto"></div>
        </div>

        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          구매자가 결제를 진행중입니다
        </h2>

        <p className="text-lg text-gray-600 mb-6">잠시만 기다려주세요</p>

        {/* 거래 정보 */}
        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">구매자:</span>
              <span className="ml-2 font-medium">{partner.buyer}</span>
            </div>
            <div>
              <span className="text-gray-600">통신사:</span>
              <span className="ml-2 font-medium">{partner.carrier}</span>
            </div>
            <div>
              <span className="text-gray-600">데이터:</span>
              <span className="ml-2 font-medium">{partner.dataAmount}GB</span>
            </div>
            <div>
              <span className="text-gray-600">가격:</span>
              <span className="ml-2 font-medium text-green-600">
                {partner.priceGb.toLocaleString()}원
              </span>
            </div>
          </div>
        </div>

        {/* 주의사항 */}
        <div className="text-sm text-gray-500 space-y-1">
          <p>*상대방의 응답을 실시간으로 기다리며 거래시간은 약 3~5분입니다.</p>
          <p>*거래중간에 이탈할 경우 제재를 받을 수 있습니다.</p>
        </div>

        {/* 대기 버튼 */}
        <button
          disabled
          className="w-full mt-6 bg-pink-500 text-white py-3 px-6 rounded-lg font-medium cursor-not-allowed opacity-75"
        >
          대기 중
        </button>
      </div>
    </div>
  );
}
