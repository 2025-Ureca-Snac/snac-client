'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { DataItemCard } from '@/app/(shared)/components/DataItemCard';
import { isToday } from '@/app/(shared)/utils/';
import { PriceUnit } from '@/app/(shared)/types';

interface CardsSectionProps {
  cards: CardData[];
  unit: PriceUnit;
}

import {
  getCarrierImageUrl,
  formatCarrierName,
} from '@/app/(shared)/utils/carrier-utils';
import { CardData } from '@/app/(shared)/types/card';

export default function CardsSection({ cards, unit }: CardsSectionProps) {
  const router = useRouter();

  const handleBuyClick = (item: CardData) => {
    // 거래 페이지로 이동
    router.push(`/trade/${item.id}`);
  };

  return (
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
  );
}
