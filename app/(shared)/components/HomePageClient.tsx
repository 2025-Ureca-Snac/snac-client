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

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
      {cards.map((item, index) => (
        <DataItemCard
          key={item.id || index}
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
