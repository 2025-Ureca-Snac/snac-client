'use client';

import { DataItemCard } from '../(shared)/components/DataItemCard';
import { isToday } from '@/app/(shared)/utils/';
import { PriceUnit } from '@/app/(shared)/types';

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
}

interface HomeSectionProps {
  cards: DataItem[];
  unit: PriceUnit;
}

const getCarrierImageUrl = (carrier: string): string => {
  switch (carrier) {
    case 'SKT':
      return '/SKT.png';
    case 'KT':
      return '/KT.png';
    case 'LGU+':
    case 'LG':
      return '/LG.png';
    default:
      return '/SKT.png';
  }
};

const formatCarrierName = (carrier: string): string => {
  if (carrier === 'LG') {
    return 'LGU+';
  }
  return carrier;
};

export default function HomeSection({ cards, unit }: HomeSectionProps) {
  const handleBuy = (meta: { email: string; createdAt: string }) => {
    console.log(
      `구매하기 클릭됨!\n판매자 이메일: ${meta.email}\n작성 시간: ${meta.createdAt}`
    );
  };

  const formatDataAmount = (amountInMB: number): string => {
    if (amountInMB >= 1024 && amountInMB % 1024 === 0) {
      return `${amountInMB / 1024}GB`;
    }
    return `${amountInMB}MB`;
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 md:w-[765px]">
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
          onClickBuy={handleBuy}
        />
      ))}
    </div>
  );
}
