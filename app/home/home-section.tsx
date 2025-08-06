'use client';

import React from 'react';

import { CardData } from '../(shared)/types/card';
import { PriceUnit } from '@/app/(shared)/types';
import { DataItemCard } from '../(shared)/components/DataItemCard';
import {
  getCarrierImageUrl,
  formatCarrierName,
} from '../(shared)/utils/carrier-utils';
import { isToday } from '@/app/(shared)/utils/';
import { useRouter } from 'next/navigation';

interface HomeSectionProps {
  cards: CardData[];
  unit: PriceUnit;
}
export default function HomeSection({ cards, unit }: HomeSectionProps) {
  const router = useRouter();

  const handleBuyClick = (item: CardData) => {
    // 거래 페이지로 이동
    router.push(`/trade/${item.id}`);
  };
  return (
    <>
      {/* 카드 그리드 */}
      <div className="grid w-full grid-cols-2 sm:grid-cols-4 gap-3 justify-items-center md:grid-cols-2 xl:grid-cols-4 lg:grid-cols-3 md:gap-4">
        {cards.map((item) => (
          <DataItemCard
            key={item.id}
            title={`${formatCarrierName(item.carrier)} 데이터 ${item.dataAmount}GB`}
            imageUrl={getCarrierImageUrl(item.carrier)}
            price={item.price}
            isNew={isToday(item.updatedAt)}
            unit={unit}
            email={item.email}
            cardCategory={item.cardCategory}
            createdAt={item.createdAt}
            ratingScore={item.ratingScore}
            sellStatus={item.sellStatus}
            cardId={item.id}
            carrier={item.carrier}
            dataAmount={item.dataAmount}
            onClickBuy={() => handleBuyClick(item)}
          />
        ))}
      </div>
    </>
  );
}
