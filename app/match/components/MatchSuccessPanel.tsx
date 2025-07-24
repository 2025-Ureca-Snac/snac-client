'use client';

import React from 'react';

interface MatchSuccessPanelProps {
  isVisible: boolean;
}

export default function MatchSuccessPanel({
  isVisible,
}: MatchSuccessPanelProps) {
  if (!isVisible) return null;

  return (
    <div className="px-4 py-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
          <div className="animate-bounce mb-4">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto">
              <span className="text-2xl">🎉</span>
            </div>
          </div>
          <h3 className="text-lg font-bold text-green-800 mb-2">매칭 완료!</h3>
          <p className="text-green-700">거래 페이지로 이동합니다...</p>
        </div>
      </div>
    </div>
  );
}
