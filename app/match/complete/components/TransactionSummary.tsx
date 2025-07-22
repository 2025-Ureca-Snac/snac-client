'use client';

import React from 'react';

interface Partner {
  id: string;
  name: string;
  carrier: string;
  data: number;
  price: number;
  rating: number;
  transactionCount: number;
}

interface TransactionSummaryProps {
  partner: Partner;
  transactionId: string;
  completedAt: string;
}

export default function TransactionSummary({
  partner,
  transactionId,
  completedAt,
}: TransactionSummaryProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-6">거래 요약</h2>

      <div className="space-y-4">
        <div className="flex justify-between items-center py-3 border-b">
          <span className="text-gray-600">거래 ID</span>
          <span className="font-mono text-sm text-gray-800">
            {transactionId}
          </span>
        </div>

        <div className="flex justify-between items-center py-3 border-b">
          <span className="text-gray-600">거래 상대방</span>
          <span className="font-medium">{partner.name}</span>
        </div>

        <div className="flex justify-between items-center py-3 border-b">
          <span className="text-gray-600">통신사</span>
          <span className="font-medium">{partner.carrier}</span>
        </div>

        <div className="flex justify-between items-center py-3 border-b">
          <span className="text-gray-600">전송량</span>
          <span className="font-medium">{partner.data}GB</span>
        </div>

        <div className="flex justify-between items-center py-3 border-b">
          <span className="text-gray-600">거래 금액</span>
          <span className="font-medium text-green-600 text-lg">
            {partner.price.toLocaleString()}원
          </span>
        </div>

        <div className="flex justify-between items-center py-3">
          <span className="text-gray-600">완료 시간</span>
          <span className="font-medium">{completedAt}</span>
        </div>
      </div>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-6">
        <div className="flex items-center space-x-2">
          <span className="text-green-600">✓</span>
          <span className="text-sm text-green-700 font-medium">
            데이터 전송이 성공적으로 완료되었습니다.
          </span>
        </div>
      </div>
    </div>
  );
}
