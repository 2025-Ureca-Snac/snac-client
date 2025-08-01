'use client';

import React, { useState } from 'react';
import { DataItemCard } from '../(shared)/components/DataItemCard';
import { isToday } from '@/app/(shared)/utils/';
import { PriceUnit } from '@/app/(shared)/types';
import TradeConfirmationModal from '../(shared)/components/TradeConfirmationModal';

interface HomeSectionProps {
  cards: CardData[];
  unit: PriceUnit;
}

import {
  getCarrierImageUrl,
  formatCarrierName,
} from '../(shared)/utils/carrier-utils';
import { CardData } from '../(shared)/types/card';

// const formatDataAmount = (amountInMB: number): string =>
//   amountInMB >= 1024 && amountInMB % 1024 === 0
//     ? `${amountInMB / 1024}GB`
//     : `${amountInMB}MB`;

export default function HomeSection({ cards, unit }: HomeSectionProps) {
  const [modalItem, setModalItem] = useState<CardData | null>(null);

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
            onClickBuy={() => setModalItem(item)}
          />
        ))}
      </div>

      <TradeConfirmationModal
        modalItem={modalItem}
        onClose={() => setModalItem(null)}
        unit={unit}
      />
    </>
  );
}
