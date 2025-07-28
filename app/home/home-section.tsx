'use client';

import React, { useState } from 'react';
import { DataItemCard } from '../(shared)/components/DataItemCard';
import { isToday } from '@/app/(shared)/utils/';
import { PriceUnit } from '@/app/(shared)/types';
import TradeConfirmationModal from '../(shared)/components/TradeConfirmationModal';

interface DataItem {
  id: number;
  name: string;
  createdAt: string;
  email: string;
  sellStatus: string;
  cardCategory: 'BUY' | 'SELL';
  carrier: string;
  dataAmount: number;
  price: number;
  updatedAt: string;
  ratingScore: number;
}

interface HomeSectionProps {
  cards: DataItem[];
  unit: PriceUnit;
}

import {
  getCarrierImageUrl,
  formatCarrierName,
} from '../(shared)/utils/carrier-utils';

const formatDataAmount = (amountInMB: number): string =>
  amountInMB >= 1024 && amountInMB % 1024 === 0
    ? `${amountInMB / 1024}GB`
    : `${amountInMB}MB`;

export default function HomeSection({ cards, unit }: HomeSectionProps) {
  const [modalItem, setModalItem] = useState<DataItem | null>(null);

  return (
    <>
      {/* 카드 그리드 */}
      <div className="grid w-full grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
        {cards.map((item) => (
          <DataItemCard
            key={item.id}
            title={`${formatCarrierName(item.carrier)} 데이터 ${formatDataAmount(item.dataAmount)}`}
            imageUrl={getCarrierImageUrl(item.carrier)}
            price={item.price}
            isNew={isToday(item.updatedAt)}
            unit={unit}
            email={item.email}
            cardCategory={item.cardCategory}
            createdAt={item.createdAt}
            ratingScore={item.ratingScore}
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
