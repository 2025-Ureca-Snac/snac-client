import { create } from 'zustand';
import { api } from '../utils/api';
import { ApiResponse } from '../types/api';
import { BalanceResponse } from '../types/point-history';

interface BalanceState {
  balance: BalanceResponse | null;
  isLoading: boolean;
  error: string | null;
  fetchBalance: () => Promise<void>;
}

export const useBalanceStore = create<BalanceState>((set) => ({
  balance: null,
  isLoading: false,
  error: null,
  fetchBalance: async () => {
    set({ isLoading: true, error: null });
    try {
      const response =
        await api.get<ApiResponse<BalanceResponse>>('/wallets/summary');
      set({ balance: response.data.data, isLoading: false });
    } catch {
      set({ error: '잔액 조회 실패', isLoading: false });
    }
  },
}));
