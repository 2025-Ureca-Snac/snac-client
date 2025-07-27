// match.ts에서 공통 타입들을 import
export type { User, TradeRequest } from './match';

export interface Filters {
  transactionType: string[];
  carrier: string[];
  dataAmount: string[];
  price: string[];
}

export interface CategoryOption {
  id: string;
  label: string;
}
