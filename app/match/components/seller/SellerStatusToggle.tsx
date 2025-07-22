'use client';

import React from 'react';
import { SellerRegistrationInfo } from '../FilterSection';

interface SellerStatusToggleProps {
  sellerInfo: SellerRegistrationInfo;
  onToggle: () => void;
}

export default function SellerStatusToggle({
  sellerInfo,
  onToggle,
}: SellerStatusToggleProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-lg font-medium text-white">판매 상태</h3>

      {/* 상태 토글 버튼 */}
      <button
        onClick={onToggle}
        className={`w-full px-6 py-4 rounded-lg font-medium transition-all duration-300 ${
          sellerInfo.isActive
            ? 'bg-green-600 text-white hover:bg-green-700 shadow-lg'
            : 'bg-gray-600 text-gray-200 hover:bg-gray-500'
        }`}
      >
        <div className="flex items-center justify-center space-x-3">
          <div
            className={`w-3 h-3 rounded-full ${sellerInfo.isActive ? 'bg-green-300' : 'bg-gray-400'}`}
          ></div>
          <span>
            {sellerInfo.isActive ? '판매 활성화됨' : '판매 비활성화됨'}
          </span>
        </div>
        <div className="text-sm opacity-75 mt-1">
          {sellerInfo.isActive
            ? '다른 사용자가 거래를 신청할 수 있습니다'
            : '거래 신청을 받지 않습니다'}
        </div>
      </button>

      {/* 등록 정보 요약 */}
      {sellerInfo.isActive && (
        <div className="bg-green-800 bg-opacity-50 p-4 rounded-lg border border-green-600">
          <h4 className="font-medium text-green-300 mb-2">등록된 판매 정보</h4>
          <div className="text-sm text-green-100 space-y-1">
            <p>📱 통신사: {sellerInfo.carrier}</p>
            <p>
              💾 데이터량:{' '}
              {sellerInfo.dataAmount >= 1
                ? `${sellerInfo.dataAmount}GB`
                : `${sellerInfo.dataAmount * 1000}MB`}
            </p>
            <p>💰 가격: {sellerInfo.price.toLocaleString()}원</p>
          </div>
        </div>
      )}
    </div>
  );
}
