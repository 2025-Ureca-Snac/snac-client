'use client';

import React from 'react';

interface TradingStepsProps {
  currentStep: string;
}

const STEPS = [
  { id: 'confirmation', label: '거래 확인', icon: '📋' },
  { id: 'payment', label: '결제', icon: '💳' },
  { id: 'transfer', label: '이체', icon: '📱' },
  { id: 'verification', label: '인증', icon: '✅' },
];

export default function TradingSteps({ currentStep }: TradingStepsProps) {
  const currentStepIndex = STEPS.findIndex((step) => step.id === currentStep);

  return (
    <div className="bg-white py-6 px-4 border-b">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between">
          {STEPS.map((step, index) => {
            const isCompleted = index < currentStepIndex;
            const isCurrent = index === currentStepIndex;

            return (
              <React.Fragment key={step.id}>
                <div className="flex flex-col items-center">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-medium ${
                      isCompleted
                        ? 'bg-green-500 text-white'
                        : isCurrent
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {isCompleted ? '✓' : step.icon}
                  </div>
                  <div
                    className={`mt-2 text-sm font-medium ${
                      isCompleted
                        ? 'text-green-600'
                        : isCurrent
                          ? 'text-blue-600'
                          : 'text-gray-500'
                    }`}
                  >
                    {step.label}
                  </div>
                </div>

                {index < STEPS.length - 1 && (
                  <div
                    className={`flex-1 h-1 mx-4 ${
                      isCompleted ? 'bg-green-500' : 'bg-gray-200'
                    }`}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
}
