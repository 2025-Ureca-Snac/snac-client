'use client';

import React from 'react';
import { SellerRegistrationInfo } from './FilterSection';
import { TradeRequest } from '../types/match';

interface IncomingRequestsPanelProps {
  requests: TradeRequest[];
  sellerInfo: SellerRegistrationInfo;
  onRequestResponse: (requestId: string, accept: boolean) => void;
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
                key={request.id}
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
  onRequestResponse: (requestId: string, accept: boolean) => void;
}) {
  return (
    <div className="bg-white border border-yellow-200 rounded-lg p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-medium text-gray-800">
            {request.buyerName}님의 거래 요청
          </p>
          <p className="text-sm text-gray-600">
            {sellerInfo.dataAmount >= 1
              ? `${sellerInfo.dataAmount}GB`
              : `${sellerInfo.dataAmount * 1000}MB`}{' '}
            • {sellerInfo.price.toLocaleString()}원
          </p>
          <p className="text-xs text-gray-500">
            {new Date(request.createdAt).toLocaleString()}
          </p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => onRequestResponse(request.id, true)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            수락
          </button>
          <button
            onClick={() => onRequestResponse(request.id, false)}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            거부
          </button>
        </div>
      </div>
    </div>
  );
}
