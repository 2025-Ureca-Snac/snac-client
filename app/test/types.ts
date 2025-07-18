// 카드 관리 타입
export type CardCategory = 'SELL' | 'BUY';
export type Carrier = 'SKT' | 'KT' | 'LG';
export type PriceRange =
  | 'ALL'
  | 'P0_999'
  | 'P1000_1499'
  | 'P1500_1999'
  | 'P2000_2499'
  | 'P2500_PLUS';
export type SellStatus = 'ALL' | 'SELLING' | 'SOLD_OUT';

export interface CardData {
  cardCategory: CardCategory;
  carrier: Carrier;
  dataAmount: number;
  price: number;
}

export interface ScrollParams {
  cardCategory: CardCategory;
  priceRanges: PriceRange[];
  sellStatusFilter: SellStatus;
  carrier?: Carrier;
  highRatingFirst?: boolean;
  size?: number;
  lastCardId?: number;
  lastUpdatedAt?: string;
}

// 계좌 관리 타입
export interface AccountData {
  bankId: number;
  accountNumber: string;
}

export interface AccountUpdateData {
  accountId: number;
  bankId: number;
  accountNumber: string;
}

// 은행 관리 타입
export interface BankData {
  name: string;
}

export interface BankUpdateData {
  bankId: number;
  name: string;
}

// 거래 관리 타입
export interface TradeCreateData {
  cardId: number;
  money: number;
  point: number;
}

export interface TradeScrollParams {
  side: 'SELL' | 'BUY';
  size?: number;
  cursorId?: number;
}

// 공통 props 타입
export interface CommonProps {
  loading: boolean;
  setResponse: (response: string) => void;
}
