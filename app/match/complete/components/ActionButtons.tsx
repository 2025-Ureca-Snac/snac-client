'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

export default function ActionButtons() {
  const router = useRouter();

  const handleNewMatch = () => {
    router.push('/match');
  };

  const handleGoHome = () => {
    router.push('/');
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-6">다음 액션</h2>

      <div className="space-y-3">
        <button
          onClick={handleNewMatch}
          className="w-full bg-green-600 text-white py-4 px-6 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
        >
          <span>🔄</span>
          <span>새로운 매칭 시작</span>
        </button>

        <button
          onClick={handleGoHome}
          className="w-full border-2 border-gray-300 text-gray-700 py-4 px-6 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2"
        >
          <span>🏠</span>
          <span>홈으로 돌아가기</span>
        </button>
      </div>

      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-medium text-gray-700 mb-2">거래 히스토리</h3>
        <p className="text-sm text-gray-600">
          마이페이지에서 모든 거래 내역을 확인할 수 있습니다.
        </p>
        <button
          onClick={() => router.push('/myPage')}
          className="mt-3 text-sm text-blue-600 hover:text-blue-700 hover:underline"
        >
          거래 내역 보기 →
        </button>
      </div>
    </div>
  );
}
