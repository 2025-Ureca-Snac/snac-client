'use client';

import React from 'react';

interface TradingHeaderProps {
  timeLeft: number;
  currentStep: string;
  userRole?: 'buyer' | 'seller' | null;
}

// 구매자용 스텝 라벨
const BUYER_STEP_LABELS = {
  confirmation: '거래 확인',
  payment: '결제 진행',
  transfer: '이체 확인',
  verification: '거래 완료',
};

// 판매자용 스텝 라벨
const SELLER_STEP_LABELS = {
  confirmation: '거래 확인',
  waiting_payment: '결제 대기 중',
  show_phone: '연락처 공개',
  upload_data: '데이터 전송',
  verification: '거래 완료',
};

export default function TradingHeader({
  timeLeft,
  currentStep,
  userRole,
}: TradingHeaderProps) {
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // userRole에 따라 적절한 라벨 선택
  const STEP_LABELS =
    userRole === 'seller' ? SELLER_STEP_LABELS : BUYER_STEP_LABELS;
  const currentStepLabel =
    STEP_LABELS[currentStep as keyof typeof STEP_LABELS] || '거래 진행';

  return (
    <div className="relative  text-primary-foreground py-8 px-4 overflow-hidden">
      {/* 배경 그라데이션 효과 */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black"></div>

      {/* 형광 녹색 글로우 효과 */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-green-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-green-300 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse delay-1000"></div>

      <div className="relative max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="text-green-400 text-sm font-medium mb-2 tracking-wider uppercase">
              실시간 매칭 진행중
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-green-300 bg-clip-text text-transparent">
              {currentStepLabel}
            </h1>
          </div>

          <div className="text-right">
            <div className="text-green-400 text-sm font-medium mb-2 tracking-wider">
              평균 거래 완료 시간
            </div>
            <div className="relative">
              <div className="text-4xl font-mono font-bold text-primary-foreground drop-shadow-lg">
                {formatTime(timeLeft)}
              </div>
              <div className="absolute -inset-1 bg-green-400 rounded-lg blur opacity-20"></div>
            </div>
            <div className="text-xs text-muted-foreground mt-1">분 : 초</div>
          </div>
        </div>

        {/* 진행 바 */}
        <div className="mb-4">
          <div className="w-full bg-card rounded-full h-2 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-green-400 to-green-300 rounded-full shadow-lg transition-all duration-300"
              style={{
                width: `${Math.max(10, ((300 - timeLeft) / 300) * 100)}%`,
                boxShadow: '0 0 10px rgba(34, 197, 94, 0.5)',
              }}
            ></div>
          </div>
        </div>

        {timeLeft < 60 && (
          <div className="relative bg-gradient-to-r from-red-900/30 to-orange-900/30 border border-red-400/30 rounded-xl p-4 backdrop-blur-sm">
            <div className="absolute inset-0 bg-red-500/5 rounded-xl animate-pulse"></div>
            <div className="relative flex items-center space-x-3">
              <div className="w-8 h-8 bg-red-500/20 rounded-full flex items-center justify-center">
                <span className="text-red-400 text-lg">⚠️</span>
              </div>
              <div>
                <div className="text-red-300 font-medium">긴급 알림</div>
                <div className="text-red-200 text-sm">
                  지금 접속중인 유저와 바로 거래하세요!
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 하단 안내 텍스트 */}
        <div className="mt-6 text-center">
          <div className="text-muted-foreground text-sm">
            1GB부터, 실시간으로 판매자-구매자와 연결됩니다.
          </div>
          <div className="text-green-400 text-xs mt-1">
            놓치지 마세요 - 타이밍이 곧 기회입니다.
          </div>
        </div>
      </div>
    </div>
  );
}
