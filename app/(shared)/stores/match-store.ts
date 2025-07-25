import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface MatchFilters {
  transactionType: string[];
  carrier: string[];
  dataAmount: string[];
  price: string[];
}

export interface MatchPartner {
  tradeId: number;
  buyer: string;
  seller: string;
  cardId: number;
  carrier: string;
  dataAmount: number;
  phone: string;
  point: number;
  priceGb: number;
  sellerRatingScore: number;
  status: string;
  cancelReason: string | null;
  type: 'buyer' | 'seller';
}

export type MatchStatus =
  | 'idle'
  | 'searching'
  | 'found'
  | 'trading'
  | 'completed'
  | 'cancelled';
export type TradingStep =
  | 'confirmation'
  | 'payment'
  | 'transfer'
  | 'verification';

interface MatchState {
  // 매칭 상태
  status: MatchStatus;
  filters: MatchFilters;
  partner: MatchPartner | null;

  // 거래 진행 상태
  tradingStep: TradingStep;
  timeLeft: number;
  transactionId: string | null;

  // WebSocket 함수들
  sendPayment?: (tradeId: number, money: number, point: number) => boolean;
  sendTradeConfirm?: (tradeId: number) => boolean;

  // 액션
  setFilters: (filters: MatchFilters) => void;
  startMatching: () => void;
  foundMatch: (partner: MatchPartner) => void;
  startTrading: () => void;
  setTradingStep: (step: TradingStep) => void;
  setTimeLeft: (time: number) => void;
  completeTransaction: () => void;
  cancelTransaction: () => void;
  setWebSocketFunctions: (functions: {
    sendPayment: (tradeId: number, money: number, point: number) => boolean;
    sendTradeConfirm: (tradeId: number) => boolean;
  }) => void;
  reset: () => void;
}

const initialFilters: MatchFilters = {
  transactionType: [],
  carrier: [],
  dataAmount: [],
  price: [],
};

export const useMatchStore = create<MatchState>()(
  persist(
    (set) => ({
      // 초기 상태
      status: 'idle',
      filters: initialFilters,
      partner: null,
      tradingStep: 'confirmation',
      timeLeft: 300, // 5분
      transactionId: null,

      // 액션들
      setFilters: (filters) => set({ filters }),

      startMatching: () =>
        set({
          status: 'searching',
          partner: null,
          transactionId: `tx_${crypto.randomUUID()}`,
        }),

      foundMatch: (partner) =>
        set({
          status: 'found',
          partner,
          tradingStep: 'confirmation',
          timeLeft: 300,
        }),

      startTrading: () => set({ status: 'trading' }),

      setTradingStep: (step) => set({ tradingStep: step }),

      setTimeLeft: (time) => set({ timeLeft: time }),

      completeTransaction: () =>
        set({
          status: 'completed',
          tradingStep: 'verification',
        }),

      cancelTransaction: () =>
        set({
          status: 'cancelled',
          partner: null,
          transactionId: null,
          tradingStep: 'confirmation',
          timeLeft: 300,
        }),

      setWebSocketFunctions: (functions) =>
        set({
          sendPayment: functions.sendPayment,
          sendTradeConfirm: functions.sendTradeConfirm,
        }),

      reset: () =>
        set({
          status: 'idle',
          filters: initialFilters,
          partner: null,
          tradingStep: 'confirmation',
          timeLeft: 300,
          transactionId: null,
        }),
    }),
    {
      name: 'match-store',
      // 민감한 정보는 저장하지 않음
      partialize: (state) => ({
        filters: state.filters,
        status: state.status === 'searching' ? 'idle' : state.status, // 새로고침 시 검색 상태 초기화
      }),
    }
  )
);
