'use client';

import React from 'react';

export default function CompletionHeader() {
  return (
    <div className="bg-gradient-to-r from-green-600 to-green-700 text-white py-8 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
          <span className="text-3xl">🎉</span>
        </div>
        <h1 className="text-3xl font-bold mb-2">거래 완료!</h1>
        <p className="text-green-100 text-lg">
          성공적으로 거래가 완료되었습니다.
        </p>
      </div>
    </div>
  );
}
