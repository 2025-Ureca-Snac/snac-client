'use client';

import React from 'react';

interface EarningsDisplayProps {
  pointsEarned: number;
  experienceGained: number;
  bonusPoints?: number;
}

export default function EarningsDisplay({
  pointsEarned,
  experienceGained,
  bonusPoints = 0,
}: EarningsDisplayProps) {
  const totalPoints = pointsEarned + bonusPoints;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-6">획득한 보상</h2>

      <div className="space-y-4">
        {/* 기본 포인트 */}
        <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white text-lg">💰</span>
            </div>
            <div>
              <div className="font-medium text-blue-800">거래 포인트</div>
              <div className="text-sm text-blue-600">기본 거래 완료 보상</div>
            </div>
          </div>
          <div className="text-2xl font-bold text-blue-600">
            +{pointsEarned}
          </div>
        </div>

        {/* 보너스 포인트 */}
        {bonusPoints > 0 && (
          <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center">
                <span className="text-white text-lg">⭐</span>
              </div>
              <div>
                <div className="font-medium text-yellow-800">보너스 포인트</div>
                <div className="text-sm text-yellow-600">
                  첫 거래 완료 보너스
                </div>
              </div>
            </div>
            <div className="text-2xl font-bold text-yellow-600">
              +{bonusPoints}
            </div>
          </div>
        )}

        {/* 경험치 */}
        <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
              <span className="text-white text-lg">🎯</span>
            </div>
            <div>
              <div className="font-medium text-purple-800">경험치</div>
              <div className="text-sm text-purple-600">레벨업에 기여</div>
            </div>
          </div>
          <div className="text-2xl font-bold text-purple-600">
            +{experienceGained}
          </div>
        </div>
      </div>

      {/* 총 합계 */}
      <div className="border-t pt-4 mt-6">
        <div className="flex items-center justify-between">
          <span className="text-lg font-semibold text-gray-700">총 포인트</span>
          <span className="text-3xl font-bold text-green-600">
            +{totalPoints}
          </span>
        </div>
      </div>
    </div>
  );
}
