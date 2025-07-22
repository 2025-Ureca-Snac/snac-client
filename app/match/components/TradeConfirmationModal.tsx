'use client';

import React from 'react';
import { User } from '../types/match';

interface TradeConfirmationModalProps {
  isOpen: boolean;
  seller: User | null;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function TradeConfirmationModal({
  isOpen,
  seller,
  onConfirm,
  onCancel,
}: TradeConfirmationModalProps) {
  if (!isOpen || !seller) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* 배경 오버레이 */}
      <div className="absolute inset-0 bg-black/50" onClick={onCancel} />

      {/* 모달 컨텐츠 */}
      <div className="relative bg-gradient-to-b from-green-900 to-black text-white rounded-lg p-8 mx-4 max-w-md w-full">
        {/* 뒤로가기 버튼 */}
        <button
          onClick={onCancel}
          className="absolute top-4 left-4 text-white/70 hover:text-white flex items-center space-x-2"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          <span>뒤로가기</span>
        </button>

        {/* 메인 컨텐츠 */}
        <div className="text-center mt-8">
          <h2 className="text-2xl font-bold mb-6">
            {seller.carrier} / {seller.data}GB / {seller.price.toLocaleString()}
            원을 구매합니다.
          </h2>

          <p className="text-lg mb-8">
            {seller.name}님과 실시간 거래를 시작합니다.
          </p>

          {/* 주의사항 */}
          <div className="text-sm text-gray-300 mb-8 space-y-1">
            <p>
              *상대방의 응답을 실시간으로 기다리며 거래 시간은 약 3-5분입니다.
            </p>
            <p>*거래 중에 이탈할 경우 제재를 받을 수 있습니다.</p>
          </div>

          {/* 시작하기 버튼 */}
          <button
            onClick={onConfirm}
            className="w-full bg-green-500 hover:bg-green-600 text-white py-3 px-6 rounded-lg font-medium transition-colors"
          >
            시작하기
          </button>
        </div>
      </div>
    </div>
  );
}
