'use client';

import React from 'react';
import { MatchPartner } from '@/app/(shared)/stores/match-store';
import { useGlobalWebSocket } from '@/app/(shared)/hooks/useGlobalWebSocket';

interface ConfirmationStepProps {
  partner: MatchPartner;
  onNext: () => void;
  onCancel: () => void;
}

export default function ConfirmationStep({
  partner,
  onNext,
  onCancel,
}: ConfirmationStepProps) {
  useGlobalWebSocket();
  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-6">
          거래 정보를 확인해주세요
        </h2>

        <div className="space-y-4 mb-6">
          <div className="flex justify-between items-center py-3 border-b">
            <span className="text-gray-600">거래 상대방</span>
            <span className="font-medium">
              {partner.type === 'seller' ? partner.buyer : partner.seller}
            </span>
          </div>

          <div className="flex justify-between items-center py-3 border-b">
            <span className="text-gray-600">통신사</span>
            <span className="font-medium">{partner.carrier}</span>
          </div>

          <div className="flex justify-between items-center py-3 border-b">
            <span className="text-gray-600">데이터량</span>
            <span className="font-medium">{partner.dataAmount}GB</span>
          </div>

          <div className="flex justify-between items-center py-3 border-b">
            <span className="text-gray-600">거래 금액</span>
            <span className="font-medium text-blue-600 text-lg">
              {partner.priceGb.toLocaleString()}원
            </span>
          </div>

          <div className="flex justify-between items-center py-3">
            <span className="text-gray-600">상대방 평점</span>
            <div className="flex items-center space-x-2">
              <span className="text-yellow-500">⭐</span>
              <span className="font-medium">{partner.sellerRatingScore}</span>
              <span className="text-sm text-gray-500">(거래 완료)</span>
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <div className="flex items-start space-x-2">
            <span className="text-yellow-600 text-lg">⚠️</span>
            <div>
              <div className="font-medium text-yellow-800">주의사항</div>
              <div className="text-sm text-yellow-700 mt-1">
                거래 시작 후 5분 내에 모든 과정을 완료해야 합니다.
                <br />
                중간에 취소할 경우 패널티가 부과될 수 있습니다.
              </div>
            </div>
          </div>
        </div>

        <div className="flex space-x-3">
          <button
            onClick={onCancel}
            className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            취소
          </button>
          <button
            onClick={onNext}
            className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            거래 시작
          </button>
        </div>
      </div>
    </div>
  );
}
