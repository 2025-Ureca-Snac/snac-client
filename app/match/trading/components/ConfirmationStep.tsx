'use client';

import React from 'react';
import { MatchPartner } from '@/app/(shared)/stores/match-store';
import { useGlobalWebSocket } from '@/app/(shared)/hooks/useGlobalWebSocket';

interface ConfirmationStepProps {
  partner: MatchPartner;
  onNext: () => void;
  onCancel?: () => void;
}

export default function ConfirmationStep({
  partner,
  onNext,
}: ConfirmationStepProps) {
  useGlobalWebSocket();
  return (
    <div className="max-w-3xl mx-auto px-4 ">
      {/* 메인 카드 */}
      <div className="relative  rounded-2xl overflow-hidden">
        {/* 배경 글로우 효과 */}

        <div className="relative p-8">
          {/* 헤더 */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-white via-green-300 to-white bg-clip-text text-transparent">
              거래 정보 확인
            </h2>
            <p className="text-gray-400 mt-2">
              모든 정보를 확인한 후 거래를 시작하세요
            </p>
          </div>

          {/* 거래 정보 카드들 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {/* 거래 상대방 */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-400/20 rounded-full flex items-center justify-center">
                  <span className="text-green-400 text-lg">👤</span>
                </div>
                <div>
                  <div className="text-gray-400 text-sm">상대방 닉네임</div>
                  <div className="text-white font-semibold">
                    {partner.type === 'seller'
                      ? partner.buyerNickname
                      : partner.sellerNickName}
                  </div>
                </div>
              </div>
            </div>

            {/* 통신사 */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-400/20 rounded-full flex items-center justify-center">
                  <span className="text-blue-400 text-lg">📡</span>
                </div>
                <div>
                  <div className="text-gray-400 text-sm">통신사</div>
                  <div className="text-white font-semibold">
                    {partner.carrier}
                  </div>
                </div>
              </div>
            </div>

            {/* 데이터량 */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-400/20 rounded-full flex items-center justify-center">
                  <span className="text-purple-400 text-lg">📊</span>
                </div>
                <div>
                  <div className="text-gray-400 text-sm">데이터량</div>
                  <div className="text-white font-semibold">
                    {partner.dataAmount}GB
                  </div>
                </div>
              </div>
            </div>

            {/* 상대방 평점 */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-yellow-400/20 rounded-full flex items-center justify-center">
                  <span className="text-yellow-400 text-lg">⭐</span>
                </div>
                <div>
                  <div className="text-gray-400 text-sm">
                    상대방 평점(바삭스코어)
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-white font-semibold">
                      {partner.type === 'seller'
                        ? partner.buyerRatingScore
                        : partner.sellerRatingScore}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 거래 금액 하이라이트 */}
          <div className="relative bg-gradient-to-r from-green-400/20 via-green-300/10 to-green-400/20 rounded-2xl p-6 mb-8 border border-green-400/30">
            <div className="absolute inset-0 bg-green-400/5 rounded-2xl animate-pulse"></div>
            <div className="relative text-center">
              <div className="text-green-400 text-sm font-medium mb-2 tracking-wider">
                TOTAL AMOUNT
              </div>
              <div className="text-4xl font-bold text-green-300 mb-2">
                {partner.priceGb.toLocaleString()}원
              </div>
              <div className="text-green-400/70 text-sm">
                {partner.dataAmount}GB 당{' '}
                {Math.round(
                  partner.priceGb / partner.dataAmount
                ).toLocaleString()}
                원
              </div>
            </div>
          </div>

          {/* 주의사항 */}
          <div className="relative bg-gradient-to-r from-orange-900/30 to-red-900/30 rounded-xl p-6 mb-8 border border-orange-400/30">
            <div className="absolute inset-0 bg-orange-500/5 rounded-xl"></div>
            <div className="relative flex items-start space-x-4">
              <div className="w-12 h-12 bg-orange-400/20 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-orange-400 text-xl">⚠️</span>
              </div>
              <div>
                <div className="text-orange-300 font-semibold mb-2">
                  거래 주의사항
                </div>
                <div className="text-orange-200/80 text-sm leading-relaxed">
                  • 거래 시작 후{' '}
                  <span className="text-orange-300 font-medium">5분 내</span>에
                  모든 과정을 완료해야 합니다
                  <br />• 중간에 취소할 경우{' '}
                  <span className="text-orange-300 font-medium">패널티</span>가
                  부과될 수 있습니다
                </div>
              </div>
            </div>
          </div>

          {/* 액션 버튼들 */}
          <div className="flex space-x-4">
            <button
              onClick={onNext}
              className="flex-1 px-8 py-4 bg-gradient-to-r from-green-400 to-green-500 text-black rounded-xl hover:from-green-300 hover:to-green-400 transition-all duration-300 font-bold shadow-lg hover:shadow-green-400/25 relative overflow-hidden group"
            >
              <span className="relative z-10">거래 시작</span>
              <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12"></div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
