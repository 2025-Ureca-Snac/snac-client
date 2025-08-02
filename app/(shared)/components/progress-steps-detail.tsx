'use client';

import React from 'react';

interface ProgressStep {
  id: number;
  label: string;
  isActive: boolean;
}

interface ProgressStepsDetailProps {
  steps: ProgressStep[];
  currentStep?: number;
  type?: 'purchase' | 'sales';
  cancelRequested?: boolean;
}

export default function ProgressStepsDetail({
  steps,
  cancelRequested,
}: ProgressStepsDetailProps) {
  return (
    <div className="space-y-3">
      <h3 className="font-medium text-gray-900">진행 단계</h3>
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            {/* 단계 원형 */}
            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                  step.isActive
                    ? cancelRequested
                      ? 'bg-red-500 text-white'
                      : 'bg-black text-white'
                    : 'bg-gray-300 text-gray-600'
                }`}
              >
                {step.id}
              </div>
              <div
                className={`text-center whitespace-nowrap text-xs mt-1 ${
                  step.isActive
                    ? cancelRequested
                      ? 'text-red-500 font-medium underline'
                      : 'text-black font-medium underline'
                    : 'text-gray-500'
                }`}
              >
                {step.label}
              </div>
            </div>

            {/* 연결선 (마지막 단계가 아닌 경우에만) */}
            {index < steps.length - 1 && (
              <div
                className={`w-full h-0.5 ${
                  steps[index + 1].isActive
                    ? cancelRequested
                      ? 'bg-red-500'
                      : 'bg-black'
                    : 'bg-gray-300'
                }`}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
