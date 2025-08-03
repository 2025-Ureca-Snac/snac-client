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
    <div className="max-w-2xl mx-auto px-4">
      {/* 메인 카드 - 투명 배경 */}
      <div className="relative bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700/50 shadow-2xl overflow-hidden">
        {/* 서브틀한 글로우 효과 */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-400/5 via-transparent to-green-300/3"></div>

        <div className="relative p-8">
          <div className="text-center">
            {/* 성공 아이콘 */}
            <div className="mb-6">
              <div className="relative w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto">
                <span className="text-2xl">💰</span>
                <div className="absolute -inset-2 bg-green-400 rounded-full blur-lg opacity-30 animate-pulse"></div>
              </div>
            </div>

            <h2 className="text-2xl font-bold bg-gradient-to-r from-white via-green-300 to-white bg-clip-text text-transparent mb-4">
              결제가 완료되었습니다!
            </h2>

            <p className="text-lg text-gray-300 mb-6">
              구매자의 핸드폰번호를 확인하고 데이터를 전송해주세요
            </p>

            {/* 거래 정보 */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 mb-6 border border-gray-700/50">
              <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                <div>
                  <span className="text-gray-400">구매자:</span>
                  <span className="ml-2 font-medium text-white">
                    {partner.buyer}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400">통신사:</span>
                  <span className="ml-2 font-medium text-white">
                    {partner.carrier}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400">데이터:</span>
                  <span className="ml-2 font-medium text-white">
                    {partner.dataAmount}GB
                  </span>
                </div>
                <div>
                  <span className="text-gray-400">가격:</span>
                  <span className="ml-2 font-medium text-green-400">
                    {partner.priceGb.toLocaleString()}원
                  </span>
                </div>
              </div>

              {/* 구매자 핸드폰번호 */}
              <div className="border-t border-gray-700 pt-4">
                <div className="text-center">
                  <span className="text-gray-400 text-sm">
                    구매자 핸드폰번호:
                  </span>
                  <div className="mt-2">
                    <span className="text-xl font-bold text-green-400">
                      {buyerPhone || '010-****-****'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* 안내 메시지 */}
            <div className="text-sm text-gray-400 space-y-1 mb-6">
              <p>*위 번호로 데이터를 전송해주세요</p>
              <p>*전송 완료 후 스크린샷을 업로드해주세요</p>
            </div>

            {/* 다음 단계 버튼 */}
            <button
              onClick={onNext}
              className="w-full bg-gradient-to-r from-green-400 to-green-500 text-black py-4 px-6 rounded-xl font-bold hover:from-green-300 hover:to-green-400 transition-all duration-300 shadow-lg hover:shadow-green-400/25 relative overflow-hidden group"
            >
              <span className="relative z-10">데이터 전송하기</span>
              <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12"></div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
