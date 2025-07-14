'use client';

import { DataItemCard } from './DataItemCard';

interface DataItem {
  id: number;
  name: string;
  sellStatus: string;
  cardCategory: string;
  carrier: string;
  dataAmount: number;
  price: number;
  updatedAt: string;
}

interface HomePageClientProps {
  cards: DataItem[];
}

// carrier에 따른 이미지 URL 매핑
const getCarrierImageUrl = (carrier: string): string => {
  switch (carrier) {
    case 'SKT':
      return '/SKT.svg';
    case 'KT':
      return '/KT.svg';
    case 'LGU+':
      return '/LGU+.svg';
    default:
      return '/SKT.svg'; // 기본값
  }
};

// alert 임시
export const HomePageClient = ({ cards }: HomePageClientProps) => {
  const handleBuy = (title: string) => {
    alert(`"${title}" 구매하기 클릭됨!`);
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
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
      {cards.map((item) => (
        <DataItemCard
          key={item.id}
          title={`${item.carrier} 데이터 ${item.dataAmount}MB`}
          imageUrl={getCarrierImageUrl(item.carrier)}
          price={item.price}
          isNew={item.sellStatus === 'SELLING'}
          onClickBuy={() =>
            handleBuy(`${item.carrier} 데이터 ${item.dataAmount}MB`)
          }
        />
      ))}
    </div>
  );
};
