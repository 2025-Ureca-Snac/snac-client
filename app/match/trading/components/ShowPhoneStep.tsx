'use client';

import React from 'react';
import { MatchPartner } from '@/app/(shared)/stores/match-store';

interface ShowPhoneStepProps {
  partner: MatchPartner;
  buyerPhone?: string;
  onNext: () => void;
}

export default function ShowPhoneStep({
  partner,
  buyerPhone,
  onNext,
}: ShowPhoneStepProps) {
  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
      <div className="text-center">
        {/* 성공 아이콘 */}
        <div className="mb-6">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto">
            <span className="text-2xl">💰</span>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          결제가 완료되었습니다!
        </h2>

        <p className="text-lg text-gray-600 mb-6">
          구매자의 핸드폰번호를 확인하고 데이터를 전송해주세요
        </p>

        {/* 거래 정보 */}
        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <div className="grid grid-cols-2 gap-4 text-sm mb-4">
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

          {/* 구매자 핸드폰번호 */}
          <div className="border-t pt-4">
            <div className="text-center">
              <span className="text-gray-600 text-sm">구매자 핸드폰번호:</span>
              <div className="mt-2">
                <span className="text-xl font-bold text-blue-600">
                  {buyerPhone || '010-****-****'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 안내 메시지 */}
        <div className="text-sm text-gray-500 space-y-1 mb-6">
          <p>*위 번호로 데이터를 전송해주세요</p>
          <p>*전송 완료 후 스크린샷을 업로드해주세요</p>
        </div>

        {/* 다음 단계 버튼 */}
        <button
          onClick={onNext}
          className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg font-medium transition-colors"
        >
          데이터 전송하기
        </button>
      </div>
    </div>
  );
}
