import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// User 타입 정의 추가
export interface User {
  tradeId: number;
  cardId: number;
  type: 'buyer' | 'seller';
  name: string;
  carrier: string;
  data: number;
  price: number;
  rating?: number;
  transactionCount?: number;
  email?: string;
  phone?: string;
}

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
  userRole: 'buyer' | 'seller' | null; // 사용자 역할 추가

  // 거래 진행 상태
  tradingStep: TradingStep;
  timeLeft: number;
  transactionId: string | null;

  // 판매자 카드 ID
  currentCardId: number | null;

  // 활성 판매자 목록
  activeSellers: User[];

  // WebSocket 함수들
  sendPayment?: (tradeId: number, money: number, point: number) => boolean;
  sendTradeConfirm?: (tradeId: number) => boolean;

  // 액션
  setFilters: (filters: MatchFilters) => void;
  setUserRole: (role: 'buyer' | 'seller' | null) => void; // userRole 설정 액션 추가
  setCurrentCardId: (cardId: number | null) => void; // currentCardId 설정 액션 추가
  setActiveSellers: (sellers: User[] | ((prev: User[]) => User[])) => void; // activeSellers 설정 액션 추가
  startMatching: () => void;
  foundMatch: (partner: MatchPartner) => void;
  updatePartner: (updates: Partial<MatchPartner>) => void; // partner 업데이트 함수 추가
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
      userRole: null,
      tradingStep: 'confirmation',
      timeLeft: 300, // 5분
      transactionId: null,
      currentCardId: null,
      activeSellers: [],

      // 액션들
      setFilters: (filters) => set({ filters }),
      setUserRole: (role) => set({ userRole: role }),
      setCurrentCardId: (cardId) => set({ currentCardId: cardId }),
      setActiveSellers: (sellers) =>
        set((state) => ({
          activeSellers:
            typeof sellers === 'function'
              ? sellers(state.activeSellers)
              : sellers,
        })),

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

      updatePartner: (updates) =>
        set((state) => ({
          partner: state.partner ? { ...state.partner, ...updates } : null,
        })),

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
          userRole: null,
          tradingStep: 'confirmation',
          timeLeft: 300,
          transactionId: null,
          currentCardId: null,
          activeSellers: [],
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
