'use client';

import React from 'react';

interface TradingHeaderProps {
  timeLeft: number;
  currentStep: string;
}

const STEP_LABELS = {
  confirmation: '거래 확인',
  payment: '결제',
  transfer: '이체',
  verification: '인증',
};

export default function TradingHeader({
  timeLeft,
  currentStep,
}: TradingHeaderProps) {
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-6 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">
            {STEP_LABELS[currentStep as keyof typeof STEP_LABELS] ||
              '거래 진행'}
          </h1>
          <div className="text-right">
            <div className="text-sm opacity-75">남은 시간</div>
            <div className="text-2xl font-mono font-bold">
              {formatTime(timeLeft)}
            </div>
          </div>
        </div>

        {timeLeft < 60 && (
          <div className="bg-red-500 bg-opacity-20 border border-red-300 rounded-lg p-3">
            <div className="flex items-center space-x-2">
              <span className="text-red-200">⚠️</span>
              <span className="text-sm">시간이 얼마 남지 않았습니다!</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
