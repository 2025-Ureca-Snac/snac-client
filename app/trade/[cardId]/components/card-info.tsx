'use client';

import React from 'react';
import Image from 'next/image';
import { CardData } from '@/app/(shared)/types/card';
import { getCarrierImageUrl } from '@/app/(shared)/utils/carrier-utils';
import { PriceUnit } from '@/app/(shared)/types';

const formatCarrierName = (carrier: string): string =>
  carrier === 'LG' ? 'LGU+' : carrier;

const formatDataAmount = (amountInGB: number): string => {
  return `${amountInGB}GB`;
};

interface CardInfoProps {
  cardInfo: CardData;
  unit: PriceUnit;
  children?: React.ReactNode;
}

export default function CardInfo({ cardInfo, unit, children }: CardInfoProps) {
  return (
    <div className="flex flex-col md:flex-row gap-8">
      {/* 왼쪽: 상품 이미지 */}
      <div className="flex-1">
        <div className="bg-secondary rounded-lg p-8 flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="w-32 h-32 bg-card rounded-lg flex items-center justify-center mb-4 mx-auto shadow-sm">
              <Image
                src={getCarrierImageUrl(cardInfo.carrier)}
                alt={`${formatCarrierName(cardInfo.carrier)} 로고`}
                width={80}
                height={80}
                className="object-contain"
              />
            </div>
            <h3 className="text-lg font-semibold text-foreground text-muted-foreground">
              {formatCarrierName(cardInfo.carrier)} 데이터
            </h3>
            <p className="text-muted-foreground">
              {formatDataAmount(cardInfo.dataAmount)}
            </p>
          </div>
        </div>
      </div>

      {/* 오른쪽: 상품 정보 및 액션 */}
      <div className="flex-1">
        <div className="space-y-6">
          {/* 상품 제목 */}
          <div>
            <h1 className="text-2xl font-bold text-card-foreground mb-2">
              {formatCarrierName(cardInfo.carrier)} 데이터{' '}
              {formatDataAmount(cardInfo.dataAmount)}
            </h1>
            <p className="text-muted-foreground">
              {cardInfo.cardCategory === 'SELL' ? '판매글' : '구매글'}
            </p>
          </div>

          {/* 가격 */}
          <div>
            <div className="text-3xl font-bold text-card-foreground flex items-center">
              {(cardInfo.price || 0).toLocaleString()}
              {unit === 'snack' ? (
                <Image
                  src="/snac-price.svg"
                  alt="스낵"
                  width={24}
                  height={24}
                  className="ml-2"
                />
              ) : (
                <span className="text-lg font-normal text-muted-foreground ml-1">
                  원
                </span>
              )}
            </div>
          </div>

          {/* 구분선 */}
          <hr className="border-border" />

          {/* 상품 정보 */}
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground text-muted-foreground">통신사</span>
              <span className="font-medium text-muted-foreground">
                {formatCarrierName(cardInfo.carrier)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground text-muted-foreground">데이터량</span>
              <span className="font-medium text-muted-foreground">
                {formatDataAmount(cardInfo.dataAmount)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground text-muted-foreground">
                스낵스코어
              </span>
              <span className="font-medium text-muted-foreground">
                {cardInfo.ratingScore}
              </span>
            </div>
          </div>

          {/* 액션 버튼 영역 */}
          {children && <div className="mt-6">{children}</div>}
        </div>
      </div>
    </div>
  );
}
