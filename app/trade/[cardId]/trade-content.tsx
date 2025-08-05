import React from 'react';
import { CardData } from '@/app/(shared)/types/card';
import CardInfo from './components/card-info';
import { PriceUnit } from '@/app/(shared)/types';

interface TradeContentProps {
  cardData: CardData;
  children?: React.ReactNode;
}

export default function TradeContent({
  cardData,
  children,
}: TradeContentProps) {
  const unit: PriceUnit = 'snack';

  return (
    <CardInfo cardInfo={cardData} unit={unit}>
      {children}
    </CardInfo>
  );
}
