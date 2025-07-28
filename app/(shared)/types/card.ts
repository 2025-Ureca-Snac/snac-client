export interface CardData {
  id: number;
  name: string;
  email: string;
  cardCategory: 'BUY' | 'SELL';
  carrier: string;
  dataAmount: number;
  price: number;
  sellStatus: string;
  ratingScore: number;
  createdAt: string;
  updatedAt: string;
}
