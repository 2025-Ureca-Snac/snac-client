export interface User {
  id: number;
  type: 'buyer' | 'seller';
  name: string;
  carrier: string;
  data: number;
  price: number;
  rating?: number;
  transactionCount?: number;
}

export interface Filters {
  transactionType: string[];
  carrier: string[];
  dataAmount: string[];
  price: string[];
}

export interface MatchingRequest {
  userId: string;
  filters: Filters;
  maxWaitTime?: number; // 최대 대기 시간 (초)
}

export interface MatchingResponse {
  matchId: string;
  partner: User;
  estimatedTime: number;
}

export interface TransactionData {
  id: string;
  matchId: string;
  buyer: User;
  seller: User;
  amount: number;
  dataSize: number;
  status:
    | 'pending'
    | 'paid'
    | 'transferring'
    | 'completed'
    | 'failed'
    | 'cancelled';
  createdAt: string;
  updatedAt: string;
  timeLimit: number; // 거래 제한 시간 (초)
}

export interface PaymentData {
  method: 'card' | 'bank' | 'point';
  amount: number;
  fee: number;
  total: number;
}

export interface TransferStatus {
  status: 'waiting' | 'transferring' | 'completed' | 'failed';
  progress: number; // 0-100
  dataTransferred: number; // 실제 전송된 데이터량 (GB)
  startTime?: string;
  completeTime?: string;
  errorMessage?: string;
}

export interface RatingData {
  transactionId: string;
  rating: number; // 1-5
  comment?: string;
  tags?: string[]; // 평가 태그들
}
