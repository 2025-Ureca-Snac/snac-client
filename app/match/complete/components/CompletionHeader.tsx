'use client';

import React from 'react';

export default function CompletionHeader() {
  return (
    <div className="relative bg-gradient-to-r from-gray-900 via-black to-gray-900 text-white py-12 px-4 overflow-hidden">
      {/* 배경 글로우 효과 */}
      <div className="absolute inset-0 bg-gradient-to-r from-green-400/10 via-transparent to-green-300/5"></div>
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-96 h-32 bg-green-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        {/* 성공 아이콘 - 글로잉 효과 */}
        <div className="relative w-24 h-24 mx-auto mb-6">
          <div className="absolute inset-0 bg-gradient-to-r from-green-300 to-green-400 rounded-full animate-bounce flex items-center justify-center">
            <span className="text-4xl animate-pulse">🎉</span>
          </div>
          {/* 외곽 링 애니메이션 */}
          <div className="absolute -inset-2 border-2 border-green-400/30 rounded-full animate-ping"></div>
        </div>

        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-white via-green-300 to-white bg-clip-text text-transparent">
          거래 완료!
        </h1>
        <p className="text-green-200 text-xl font-light">
          성공적으로 거래가 완료되었습니다.
        </p>

        {/* 장식적 요소 */}
        <div className="flex justify-center items-center space-x-4 mt-6">
          <div className="w-12 h-0.5 bg-gradient-to-r from-transparent to-green-400"></div>
          <span className="text-green-400 text-2xl">✨</span>
          <div className="w-12 h-0.5 bg-gradient-to-l from-transparent to-green-400"></div>
        </div>
      </div>
    </div>
  );
}
