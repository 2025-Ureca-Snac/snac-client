'use client';

import Image from 'next/image';
import React from 'react';

interface EarningsDisplayProps {
  pointsEarned?: number;
  experienceGained: number;
  bonusPoints?: number;
}

export default function EarningsDisplay({
  experienceGained,
  bonusPoints = 0,
}: EarningsDisplayProps) {
  return (
    <div className="relative bg-card/30 backdrop-blur-sm rounded-2xl border border-border/50 shadow-2xl overflow-hidden">
      {/* 서브틀한 글로우 효과 */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-400/5 via-transparent to-yellow-300/3"></div>

      <div className="relative p-8">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-white via-purple-300 to-white bg-clip-text text-transparent mb-8">
          획득한 보상
        </h2>

        <div className="space-y-6">
          {/* 기본 포인트 */}
          {/* <div className="flex items-center justify-between p-6 bg-blue-900/20 border border-blue-400/30 rounded-xl backdrop-blur-sm">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full flex items-center justify-center shadow-lg shadow-blue-400/25">
                <span className="text-card-foreground text-xl">💰</span>
              </div>
              <div>
                <div className="font-bold text-blue-300">거래 포인트</div>
                <div className="text-sm text-blue-200">기본 거래 완료 보상</div>
              </div>
            </div>
            <div className="text-3xl font-bold text-blue-400 animate-pulse">
              +{pointsEarned}
            </div>
          </div> */}

          {/* 보너스 포인트 */}
          {bonusPoints > 0 && (
            <div className="flex items-center justify-between p-6 bg-yellow-900/20 border border-yellow-400/30 rounded-xl backdrop-blur-sm">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center shadow-lg shadow-yellow-400/25">
                  <span className="text-card-foreground text-xl">⭐</span>
                </div>
                <div>
                  <div className="font-bold text-yellow-300">보너스 포인트</div>
                  <div className="text-sm text-yellow-200">
                    첫 거래 완료 보너스
                  </div>
                </div>
              </div>
              <div className="text-3xl font-bold text-yellow-400 animate-pulse">
                +{bonusPoints}
              </div>
            </div>
          )}

          {/* 경험치 */}
          <div className="flex items-center justify-between p-6 bg-purple-900/20 border border-purple-400/30 rounded-xl backdrop-blur-sm">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-purple-500 rounded-full flex items-center justify-center shadow-lg shadow-purple-400/25">
                <Image
                  src="/logo_mini.png"
                  alt="Snac Logo"
                  width={28}
                  height={28}
                  className="w-7 h-7 object-contain"
                />
              </div>
              <div>
                <div className="font-bold text-purple-300">스낵 포인트</div>
                <div className="text-sm text-purple-200">거래 완료 시 획득</div>
              </div>
            </div>
            <div className="text-3xl font-bold text-purple-400 animate-pulse">
              +{experienceGained}
            </div>
          </div>
        </div>

        {/* 총 합계 - 특별한 강조 */}
      </div>
    </div>
  );
}
