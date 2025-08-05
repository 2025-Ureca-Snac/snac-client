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
    <div className="bg-gray-900 px-4 py-6">
      <div className="max-w-4xl mx-auto">
        <div
          className="relative border border-orange-400/30 rounded-lg p-6 overflow-hidden"
          style={{ backgroundColor: '#111827' }}
        >
          {/* 배경 글로우 효과 */}
          <div className="absolute inset-0 bg-gradient-to-r from-orange-400/5 via-transparent to-orange-400/5"></div>

          {/* 상단 글로우 라인 */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-400 to-transparent opacity-60"></div>

          <div className="relative z-10">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
              <h3 className="text-lg font-bold text-orange-400">
                📩 거래 요청 ({requests.length}개)
              </h3>
              <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse delay-500"></div>
            </div>

            <div className="space-y-3">
              {requests.map((request, index) => (
                <RequestCard
                  key={request.tradeId}
                  request={request}
                  sellerInfo={sellerInfo}
                  onRequestResponse={onRequestResponse}
                  index={index}
                />
              ))}
            </div>
          </div>

          {/* 하단 글로우 라인 */}
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-400 to-transparent opacity-40"></div>
        </div>
      </div>

      {/* 카드 생성 애니메이션 스타일 */}
      <style jsx>{`
        @keyframes slideIn {
          0% {
            opacity: 0;
            transform: translateX(-100%);
            filter: blur(10px);
          }
          50% {
            opacity: 0.7;
            filter: blur(5px);
          }
          100% {
            opacity: 1;
            transform: translateX(0);
            filter: blur(0);
          }
        }

        .animate-slideIn {
          animation: slideIn 0.8s ease-out forwards;
        }
      `}</style>
    </div>
  );
}

// 개별 거래 요청 카드
function RequestCard({
  request,
  sellerInfo,
  onRequestResponse,
  index,
}: {
  request: TradeRequest;
  sellerInfo: SellerRegistrationInfo;
  onRequestResponse: (requestId: number, accept: boolean) => void;
  index: number;
}) {
  return (
    <div
      className={`relative border border-orange-400/40 rounded-lg p-4 overflow-hidden group hover:border-orange-400/60 transition-all duration-500 cursor-pointer animate-slideIn`}
      style={{
        backgroundColor: '#1f2937',
        animationDelay: `${index * 200}ms`,
        animationFillMode: 'both',
      }}
    >
      {/* 카드 생성 시 글로우 효과 */}
      <div className="absolute inset-0 bg-gradient-to-r from-orange-400/0 via-orange-400/10 to-orange-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

      {/* 사이드 글로우 라인 */}
      <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-transparent via-orange-400 to-transparent opacity-60"></div>

      <div className="relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
              <p className="font-medium text-white">
                <span className="text-orange-400">{request.buyerNickname}</span>
                님의 거래 요청
              </p>
            </div>

            {/* 거래 상세 정보 */}
            <div
              className="rounded-lg p-3 mb-3 border border-gray-600/50"
              style={{ backgroundColor: '#374151' }}
            >
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-400">통신사:</span>
                  <span className="ml-2 font-medium text-cyan-400">
                    {sellerInfo.carrier}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400">데이터:</span>
                  <span className="ml-2 font-medium text-green-400">
                    {sellerInfo.dataAmount >= 1
                      ? `${sellerInfo.dataAmount}GB`
                      : `${sellerInfo.dataAmount * 1000}MB`}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400">가격:</span>
                  <span className="ml-2 font-medium text-yellow-400">
                    {sellerInfo.price.toLocaleString()}원
                  </span>
                </div>
                <div>
                  <span className="text-gray-400">요청시간:</span>
                  <span className="ml-2 text-gray-300">
                    {new Date(request.createdAt).toLocaleTimeString()}
                  </span>
                </div>
              </div>
            </div>

            {/* 거래 ID */}
            <p className="text-xs text-gray-500">
              거래 ID:{' '}
              <span className="text-orange-400">{request.tradeId}</span>
            </p>
          </div>

          {/* 액션 버튼 */}
          <div className="flex flex-col space-y-2 ml-4">
            <button
              onClick={() => onRequestResponse(request.tradeId, true)}
              className="relative bg-green-500/20 border border-green-400/50 text-green-400 px-6 py-2 rounded-lg hover:bg-green-500/30 hover:border-green-400/70 transition-all duration-300 font-medium group/btn"
            >
              {/* 버튼 글로우 효과 */}
              <div className="absolute inset-0 bg-green-400/10 rounded-lg opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
              <span className="relative z-10">✅ 수락</span>
            </button>
            <button
              onClick={() => onRequestResponse(request.tradeId, false)}
              className="relative bg-red-500/20 border border-red-400/50 text-red-400 px-6 py-2 rounded-lg hover:bg-red-500/30 hover:border-red-400/70 transition-all duration-300 font-medium group/btn"
            >
              {/* 버튼 글로우 효과 */}
              <div className="absolute inset-0 bg-red-400/10 rounded-lg opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
              <span className="relative z-10">❌ 거부</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
