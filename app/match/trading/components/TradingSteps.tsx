'use client';

import React from 'react';

interface TradingStepsProps {
  currentStep: string;
  userRole?: 'buyer' | 'seller' | null;
}

// 구매자용 스텝
const BUYER_STEPS = [
  { id: 'confirmation', label: '거래 확인', icon: '📋' },
  { id: 'payment', label: '결제', icon: '💳' },
  { id: 'transfer', label: '이체', icon: '📱' },
  { id: 'verification', label: '거래 완료', icon: '✅' },
];

// 판매자용 스텝
const SELLER_STEPS = [
  { id: 'confirmation', label: '거래 확인', icon: '📋' },
  { id: 'waiting_payment', label: '결제 대기', icon: '⏳' },
  { id: 'show_phone', label: '연락처 공개', icon: '📞' },
  { id: 'upload_data', label: '데이터 전송', icon: '📤' },
  { id: 'verification', label: '거래 완료', icon: '✅' },
];

export default function TradingSteps({
  currentStep,
  userRole,
}: TradingStepsProps) {
  // userRole에 따라 적절한 스텝 배열 선택
  const STEPS = userRole === 'seller' ? SELLER_STEPS : BUYER_STEPS;
  const currentStepIndex = STEPS.findIndex((step) => step.id === currentStep);

  return (
    <div className="relative bg-gradient-to-r from-gray-900 via-black to-gray-900 py-8 px-4 border-b border-gray-800">
      {/* 배경 글로우 효과 */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-green-400/5 to-transparent"></div>

      <div className="relative max-w-4xl mx-auto">
        <div className="flex items-center justify-between">
          {STEPS.map((step, index) => {
            const isCompleted = index < currentStepIndex;
            const isCurrent = index === currentStepIndex;

            return (
              <React.Fragment key={step.id}>
                <div className="flex flex-col items-center relative">
                  {/* 스텝 원형 아이콘 */}
                  <div className="relative">
                    <div
                      className={`w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold transition-all duration-500 ${
                        isCompleted
                          ? 'bg-gradient-to-br from-green-400 to-green-500 text-black shadow-lg'
                          : isCurrent
                            ? 'bg-gradient-to-br from-green-300 to-green-400 text-black shadow-lg animate-pulse'
                            : 'bg-gray-800 text-gray-500 border-2 border-gray-700'
                      }`}
                    >
                      {isCompleted ? (
                        <span className="text-2xl">✓</span>
                      ) : (
                        <span className={isCurrent ? 'animate-bounce' : ''}>
                          {step.icon}
                        </span>
                      )}
                    </div>

                    {/* 글로우 효과 */}
                    {(isCompleted || isCurrent) && (
                      <div className="absolute -inset-2 bg-green-400 rounded-full blur-lg opacity-30 animate-pulse"></div>
                    )}

                    {/* 현재 스텝 펄스 링 */}
                    {isCurrent && (
                      <div className="absolute -inset-3 border-2 border-green-400 rounded-full animate-ping opacity-50"></div>
                    )}
                  </div>

                  {/* 스텝 라벨 */}
                  <div
                    className={`mt-3 text-sm font-semibold transition-all duration-300 ${
                      isCompleted
                        ? 'text-green-400'
                        : isCurrent
                          ? 'text-green-300 animate-pulse'
                          : 'text-gray-500'
                    }`}
                  >
                    {step.label}
                  </div>

                  {/* 스텝 번호 */}
                  <div
                    className={`mt-1 text-xs ${
                      isCompleted || isCurrent
                        ? 'text-green-400/70'
                        : 'text-gray-600'
                    }`}
                  >
                    {index + 1}/{STEPS.length}
                  </div>
                </div>

                {/* 연결선 */}
                {index < STEPS.length - 1 && (
                  <div className="flex-1 mx-6 relative">
                    <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-700 ease-out ${
                          isCompleted
                            ? 'bg-gradient-to-r from-green-400 to-green-300 shadow-lg'
                            : 'bg-gray-700'
                        }`}
                        style={{
                          boxShadow: isCompleted
                            ? '0 0 8px rgba(34, 197, 94, 0.5)'
                            : 'none',
                        }}
                      />
                    </div>

                    {/* 진행 중인 연결선 애니메이션 */}
                    {isCurrent && (
                      <div className="absolute top-0 left-0 h-1 bg-gradient-to-r from-green-400 to-transparent rounded-full animate-pulse opacity-60"></div>
                    )}
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* 하단 진행률 표시 */}
        <div className="mt-8 text-center">
          <div className="text-gray-400 text-sm mb-2">거래 진행률</div>
          <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-green-400 to-green-300 rounded-full transition-all duration-1000 ease-out"
              style={{
                width: `${((currentStepIndex + 1) / STEPS.length) * 100}%`,
                boxShadow: '0 0 10px rgba(34, 197, 94, 0.5)',
              }}
            />
          </div>
          <div className="text-green-400 text-xs mt-2 font-mono">
            {Math.round(((currentStepIndex + 1) / STEPS.length) * 100)}% 완료
          </div>
        </div>
      </div>
    </div>
  );
}
