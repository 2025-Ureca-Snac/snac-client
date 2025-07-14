'use client';

import { DataItemCard } from './DataItemCard';

interface DataItem {
  id: number;
  title: string;
  imageUrl: string;
  price: number;
  isNew?: boolean;
}

interface HomePageClientProps {
  cards: DataItem[];
}

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
          title={item.title}
          imageUrl={item.imageUrl}
          price={item.price}
          isNew={item.isNew}
          onClickBuy={() => handleBuy(item.title)}
        />
      ))}
    </div>
  );
};
