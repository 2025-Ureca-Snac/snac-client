'use client';

import React from 'react';
import { SellerRegistrationInfo } from './FilterSection';
import { TradeRequest } from '../types/match';

interface IncomingRequestsPanelProps {
  requests: TradeRequest[];
  sellerInfo: SellerRegistrationInfo;
  onRequestResponse: (requestId: number, accept: boolean) => void;
}

export default function IncomingRequestsPanel({
  requests,
  sellerInfo,
  onRequestResponse,
}: IncomingRequestsPanelProps) {
  if (requests.length === 0) return null;

  return (
    <div className="px-4 py-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="text-lg font-bold text-yellow-800 mb-4">
            📩 거래 요청 ({requests.length}개)
          </h3>
          <div className="space-y-3">
            {requests.map((request) => (
              <RequestCard
                key={request.tradeId}
                request={request}
                sellerInfo={sellerInfo}
                onRequestResponse={onRequestResponse}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// 개별 거래 요청 카드
function RequestCard({
  request,
  sellerInfo,
  onRequestResponse,
}: {
  request: TradeRequest;
  sellerInfo: SellerRegistrationInfo;
  onRequestResponse: (requestId: number, accept: boolean) => void;
}) {
  return (
    <div className="bg-white border border-yellow-200 rounded-lg p-4">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
            <p className="font-medium text-gray-800">
              {request.buyerName}님의 거래 요청
            </p>
          </div>

          {/* 거래 상세 정보 */}
          <div className="bg-gray-50 rounded-lg p-3 mb-3">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">통신사:</span>
                <span className="ml-2 font-medium">{sellerInfo.carrier}</span>
              </div>
              <div>
                <span className="text-gray-600">데이터:</span>
                <span className="ml-2 font-medium">
                  {sellerInfo.dataAmount >= 1
                    ? `${sellerInfo.dataAmount}GB`
                    : `${sellerInfo.dataAmount * 1000}MB`}
                </span>
              </div>
              <div>
                <span className="text-gray-600">가격:</span>
                <span className="ml-2 font-medium text-green-600">
                  {sellerInfo.price.toLocaleString()}원
                </span>
              </div>
              <div>
                <span className="text-gray-600">요청시간:</span>
                <span className="ml-2 text-gray-500">
                  {new Date(request.createdAt).toLocaleTimeString()}
                </span>
              </div>
            </div>
          </div>

          {/* 거래 ID */}
          <p className="text-xs text-gray-500">거래 ID: {request.tradeId}</p>
        </div>

        {/* 액션 버튼 */}
        <div className="flex flex-col space-y-2 ml-4">
          <button
            onClick={() => onRequestResponse(request.tradeId, true)}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium"
          >
            ✅ 수락
          </button>
          <button
            onClick={() => onRequestResponse(request.tradeId, false)}
            className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors font-medium"
          >
            ❌ 거부
          </button>
        </div>
      </div>
    </div>
  );
}
