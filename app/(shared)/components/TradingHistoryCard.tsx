'use client';

import React from 'react';
import Image from 'next/image';
import { getHistoryStatusColor } from '../utils/history-status';

interface TradingHistoryItem {
  tradeId: number;
  buyer: string;
  seller: string;
  carrier: string;
  dataAmount: number;
  priceGb: number;
  status: string;
  tradeType: string;
  createdAt: string;
  phone: string | null;
  partnerId?: number;
  partnerFavorite: boolean;
  partnerNickname: string;
  cancelReason?: string;
  cancelRequested: boolean;
  cancelRequestReason: string | null;
  cancelRequestStatus: string | null;
}

interface TradingHistoryCardProps {
  item: TradingHistoryItem;
  isPurchase: boolean;
  theme: {
    focusRingColor: string;
  };
  onCardClick: (item: TradingHistoryItem) => void;
  onCardKeyDown: (e: React.KeyboardEvent, item: TradingHistoryItem) => void;
  getCarrierImageUrl: (carrier: string) => string;
  getStatusText: (status: string) => string;
  partnerNickname: string;
  partnerFavorite: boolean;
  isDragging?: boolean;
}

export const TradingHistoryCard: React.FC<TradingHistoryCardProps> = ({
  item,
  isPurchase,
  theme,
  onCardClick,
  onCardKeyDown,
  getCarrierImageUrl,
  getStatusText,
  partnerNickname,
  partnerFavorite,
  isDragging = false,
}) => {
  return (
    <div
      key={item.tradeId}
      role="listitem"
      tabIndex={0}
      className={`bg-muted rounded-lg p-4 flex items-start gap-3 cursor-pointer hover:bg-secondary focus:bg-secondary:bg-muted focus:outline-none focus:ring-2 focus:${theme.focusRingColor} focus:ring-offset-2 transition-colors`}
      onClick={() => {
        if (isDragging) return;
        onCardClick(item);
      }}
      onKeyDown={(e) => onCardKeyDown(e, item)}
      aria-label={`${item.carrier} ${item.dataAmount}GB ${isPurchase ? '구매' : '판매'} 내역 - ${new Date(item.createdAt).toLocaleDateString('ko-KR')} - ${item.priceGb.toLocaleString()}원 - ${getStatusText(item.status)}`}
    >
      {/* 아이콘 */}
      <div
        className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden"
        aria-hidden="true"
      >
        <Image
          src={getCarrierImageUrl(item.carrier)}
          alt={item.carrier}
          width={48}
          height={48}
          className="w-[80%] h-[80%] object-contain"
        />
      </div>

      {/* 내용 */}
      <div className="flex-1">
        <div className="text-sm text-muted-foreground mb-1">
          {new Date(item.createdAt).toLocaleDateString('ko-KR')}
        </div>
        <div className="font-semibold text-card-foreground mb-1">
          {item.carrier} {item.dataAmount}GB
        </div>
        <div className="flex items-center gap-2 mb-2">
          <span
            className={`text-xs px-2 py-1 rounded ${
              item.cancelRequestStatus === 'REQUESTED'
                ? 'bg-red-500 text-primary-foreground'
                : getHistoryStatusColor(
                    isPurchase ? 'purchase' : 'sales',
                    item.status
                  )
            }`}
            aria-label={`상태: ${
              item.cancelRequestStatus === 'REQUESTED'
                ? '취소 접수'
                : getStatusText(item.status)
            }`}
          >
            {item.cancelRequestStatus === 'REQUESTED'
              ? '취소 접수'
              : getStatusText(item.status)}
          </span>
          <span className="text-card-foreground">
            {item.priceGb.toLocaleString()}원
          </span>
        </div>

        {/* 거래자 정보 */}
        {partnerNickname && (
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <span className="text-xs text-muted-foreground">
                거래자:
              </span>
              <span className="text-xs font-medium text-foreground">
                {partnerNickname}
              </span>
            </div>
            {partnerFavorite && (
              <span className="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded font-medium">
                단골
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
