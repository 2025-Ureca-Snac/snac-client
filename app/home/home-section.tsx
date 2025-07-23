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
  cardCategory: string;
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
      return '/LGU+.png';
    default:
      return '/SKT.png';
  }
};

export default function HomeSection({ cards, unit }: HomeSectionProps) {
  const handleBuy = (meta: { email: string; createdAt: string }) => {
    console.log(
      `구매하기 클릭됨!\n판매자 이메일: ${meta.email}\n작성 시간: ${meta.createdAt}`
    );
  };

  if (!cards || cards.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="text-gray-500 text-lg font-medium">카드가 없습니다</div>
        <div className="text-gray-400 text-sm mt-2">
          현재 표시할 카드가 없습니다.
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 md:w-[765px]">
      {cards.map((item) => (
        <DataItemCard
          key={item.id}
          title={`${item.carrier} 데이터 ${item.dataAmount}MB`}
          imageUrl={getCarrierImageUrl(item.carrier)}
          price={item.price}
          isNew={isToday(item.updatedAt)}
          unit={unit}
          email={item.email}
          createdAt={item.createdAt}
          onClickBuy={handleBuy}
        />
      ))}
    </div>
  );
}
