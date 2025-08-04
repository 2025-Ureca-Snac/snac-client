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
    <div className="max-w-3xl mx-auto px-4">
      {/* 메인 카드 - 투명 배경 */}
      <div className="relative bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700/50 shadow-2xl overflow-hidden">
        {/* 서브틀한 글로우 효과 */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-400/5 via-transparent to-green-300/3"></div>

        <div className="relative p-8">
          <div className="text-center">
            {/* 로딩 애니메이션 - 더 화려하게 */}
            <div className="mb-8 relative">
              <div className="relative mx-auto w-20 h-20">
                {/* 외부 링 */}
                <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-green-400 border-r-green-300"></div>
                {/* 내부 링 */}
                <div
                  className="absolute inset-2 animate-spin rounded-full border-3 border-transparent border-b-green-500 border-l-green-400"
                  style={{
                    animationDirection: 'reverse',
                    animationDuration: '1.5s',
                  }}
                ></div>
                {/* 중앙 아이콘 */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-8 h-8 bg-green-400/20 rounded-full flex items-center justify-center animate-pulse">
                    <span className="text-green-400 text-lg">💳</span>
                  </div>
                </div>
              </div>
              {/* 글로우 효과 */}
              <div className="absolute inset-0 mx-auto w-20 h-20 bg-green-400 rounded-full blur-xl opacity-20 animate-pulse"></div>
            </div>

            {/* 상태 배지 */}
            <div className="inline-flex items-center space-x-2 bg-green-400/10 px-4 py-2 rounded-full mb-6 border border-green-400/20">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-green-400 text-sm font-medium tracking-wider">
                PAYMENT IN PROGRESS
              </span>
            </div>

            <h2 className="text-3xl font-bold bg-gradient-to-r from-white via-green-300 to-white bg-clip-text text-transparent mb-4">
              구매자가 결제를 진행중입니다
            </h2>

            <p className="text-lg text-gray-300 mb-8">잠시만 기다려주세요</p>

            {/* 거래 정보 카드들 */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-400/20 rounded-full flex items-center justify-center">
                    <span className="text-blue-400 text-lg">👤</span>
                  </div>
                  <div className="text-left">
                    <div className="text-gray-400 text-sm">구매자</div>
                    <div className="text-white font-semibold">
                      {partner.buyerNickname}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-purple-400/20 rounded-full flex items-center justify-center">
                    <span className="text-purple-400 text-lg">📡</span>
                  </div>
                  <div className="text-left">
                    <div className="text-gray-400 text-sm">통신사</div>
                    <div className="text-white font-semibold">
                      {partner.carrier}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-cyan-400/20 rounded-full flex items-center justify-center">
                    <span className="text-cyan-400 text-lg">📊</span>
                  </div>
                  <div className="text-left">
                    <div className="text-gray-400 text-sm">데이터량</div>
                    <div className="text-white font-semibold">
                      {partner.dataAmount}GB
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-400/20 rounded-full flex items-center justify-center">
                    <span className="text-green-400 text-lg">💰</span>
                  </div>
                  <div className="text-left">
                    <div className="text-gray-400 text-sm">거래금액</div>
                    <div className="text-green-400 font-bold">
                      {partner.priceGb.toLocaleString()}원
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 주의사항 */}
            <div className="relative bg-gradient-to-r from-yellow-900/20 to-orange-900/20 rounded-xl p-6 mb-8 border border-yellow-400/20">
              <div className="absolute inset-0 bg-yellow-500/5 rounded-xl"></div>
              <div className="relative">
                <div className="flex items-center justify-center space-x-2 mb-3">
                  <span className="text-yellow-400 text-lg">⏱️</span>
                  <span className="text-yellow-300 font-medium">거래 안내</span>
                </div>
                <div className="text-sm text-yellow-200/80 space-y-2">
                  <p>
                    • 상대방의 응답을 실시간으로 기다리며 거래시간은 약{' '}
                    <span className="text-yellow-300 font-medium">3~5분</span>
                    입니다
                  </p>
                  <p>
                    • 거래 중간에 이탈할 경우{' '}
                    <span className="text-yellow-300 font-medium">제재</span>를
                    받을 수 있습니다
                  </p>
                </div>
              </div>
            </div>

            {/* 대기 버튼 */}
            <button
              disabled
              className="w-full bg-gradient-to-r from-gray-600 to-gray-700 text-gray-300 py-4 px-6 rounded-xl font-semibold cursor-not-allowed border border-gray-600 relative overflow-hidden"
            >
              <span className="relative z-10 flex items-center justify-center space-x-2">
                <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                <span>결제 대기 중...</span>
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
