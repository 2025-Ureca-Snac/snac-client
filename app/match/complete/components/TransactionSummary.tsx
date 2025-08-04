'use client';

import React from 'react';

interface TransactionSummaryProps {
  partner: {
    name: string;
    data: number;
    price: number;
    rating: number;
    carrier: string;
    tradeId: number;
  };
  tradeId: number;
  completedAt: string;
}

export default function TransactionSummary({
  partner,
  tradeId,
  completedAt,
}: TransactionSummaryProps) {
  return (
    <div className="relative bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700/50 shadow-2xl overflow-hidden">
      {/* 서브틀한 글로우 효과 */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-400/5 via-transparent to-green-300/3"></div>

      <div className="relative p-8">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-white via-blue-300 to-white bg-clip-text text-transparent mb-8">
          거래 요약
        </h2>

        <div className="space-y-6">
          <div className="flex justify-between items-center py-4 border-b border-gray-700/50">
            <span className="text-gray-400">거래 ID</span>
            <span className="font-mono text-lg text-white bg-gray-700/50 px-3 py-1 rounded-lg">
              #{tradeId}
            </span>
          </div>

          <div className="flex justify-between items-center py-4 border-b border-gray-700/50">
            <span className="text-gray-400">상대방 닉네임</span>
            <span className="font-medium text-white">{partner.name}</span>
          </div>

          <div className="flex justify-between items-center py-4 border-b border-gray-700/50">
            <span className="text-gray-400">통신사</span>
            <span className="font-medium text-white">{partner.carrier}</span>
          </div>

          <div className="flex justify-between items-center py-4 border-b border-gray-700/50">
            <span className="text-gray-400">전송량</span>
            <span className="font-medium text-white">{partner.data}GB</span>
          </div>

          <div className="flex justify-between items-center py-4 border-b border-gray-700/50">
            <span className="text-gray-400">거래 금액</span>
            <span className="font-bold text-green-400 text-xl bg-green-900/20 px-4 py-2 rounded-lg border border-green-400/30">
              {partner.price.toLocaleString()}원
            </span>
          </div>

          <div className="flex justify-between items-center py-4">
            <span className="text-gray-400">완료 시간</span>
            <span className="font-medium text-white">{completedAt}</span>
          </div>
        </div>

        {/* 성공 상태 카드 */}
        <div className="bg-green-900/20 border border-green-400/30 rounded-xl p-6 mt-8 backdrop-blur-sm">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-green-500 rounded-full flex items-center justify-center shadow-lg shadow-green-400/25">
              <span className="text-black font-bold">✓</span>
            </div>
            <span className="text-green-200 font-medium">
              데이터 전송이 성공적으로 완료되었습니다.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
