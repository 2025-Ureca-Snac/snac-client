'use client';

import React from 'react';
import { CardData } from '@/app/(shared)/types/card';

interface ActionButtonsProps {
  cardInfo: CardData;
  isProcessing: boolean;
  error: string | null;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ActionButtons({
  cardInfo,
  isProcessing,
  error,
  onConfirm,
  onCancel,
}: ActionButtonsProps) {
  return (
    <div className="space-y-3">
      {/* 에러 메시지 */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      {/* 액션 버튼들 */}
      <div className="flex gap-3">
        <button
          onClick={onConfirm}
          disabled={isProcessing || !!error}
          className={`flex-[6] py-4 rounded-lg font-semibold text-white ${
            cardInfo.cardCategory === 'SELL' ? 'bg-black hover:bg-black/80' : ''
          } ${isProcessing || error ? 'opacity-50 cursor-not-allowed' : ''}`}
          style={
            cardInfo.cardCategory === 'BUY'
              ? { backgroundColor: '#FF66C4' }
              : undefined
          }
        >
          {isProcessing
            ? '처리중...'
            : cardInfo.cardCategory === 'SELL'
              ? '바로구매'
              : '판매하기'}
        </button>

        <button
          onClick={onCancel}
          disabled={isProcessing}
          className={`flex-[4] py-4 rounded-lg border border-border text-foreground hover:bg-muted ${
            isProcessing ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          취소
        </button>
      </div>
    </div>
  );
}
