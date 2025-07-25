export interface Card {
  id: number;
  cardCategory: 'BUY' | 'SELL';
  carrier: 'SKT' | 'KT' | 'LGU+';
  dataAmount: number;
  price: number;
  updatedAt: string;
  createdAt: string;
  email: string;
  name: string;
  sellStatus: string;
  ratingScore: number;
}
