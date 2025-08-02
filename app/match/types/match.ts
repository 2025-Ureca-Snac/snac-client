export interface MatchingRequest {
  id: string;
  userId: string;
  filters: {
    carrier: string[];
    dataAmount: string[];
    price: string[];
  };
  timestamp: string;
}

export interface MatchingResponse {
  id: string;
  partnerId: string;
  partnerName: string;
  status: 'matched' | 'waiting' | 'cancelled';
  estimatedTime?: number;
  timestamp: string;
}

export interface TransactionData {
  id: string;
  buyerId: string;
  sellerId: string;
  dataAmount: number;
  price: number;
  status: 'pending' | 'confirmed' | 'transferring' | 'completed' | 'failed';
  createdAt: string;
  updatedAt: string;
}

export interface PaymentData {
  transactionId: string;
  amount: number;
  method: 'card' | 'bank_transfer' | 'digital_wallet';
  status: 'pending' | 'completed' | 'failed';
  processedAt?: string;
}

export interface TransferStatus {
  transactionId: string;
  dataTransferred: number;
  totalData: number;
  status: 'started' | 'in_progress' | 'completed' | 'failed';
  estimatedCompletion?: string;
}

export interface RatingData {
  transactionId: string;
  raterId: string;
  ratedUserId: string;
  rating: number;
  comment?: string;
  createdAt: string;
}

// TradeRequest 타입 추가 (공통 사용)
export interface TradeRequest {
  tradeId: number;
  sellerId: number;
  seller: string;
  buyer: string;
  sellerNickName: string;
  buyerId: number;
  buyerNickName: string;
  sellerRatingScore: number;
  buyerRatingScore: number;
  cardId: number;
  buyerName: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
  ratingData?: number; // 판매자 평점
}

// User 인터페이스에 rating과 transactionCount 추가된 버전
export interface User {
  tradeId: number;
  cardId: number;
  type: 'buyer' | 'seller';
  name: string;
  carrier: string;
  data: number;
  price: number;
  rating?: number; // 서버에서 제공되지 않을 수 있음
  transactionCount?: number; // 서버에서 제공되지 않을 수 있음
  email?: string; // 이메일
  phone?: string; // 핸드폰번호
}
