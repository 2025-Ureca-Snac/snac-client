'use client';

import { create } from 'zustand';
import { api, handleApiError } from '@/app/(shared)/utils/api';
import { toast } from 'sonner';

// --- 타입 정의 ---

export type DisputeStatus = 'IN_PROGRESS' | 'ANSWERED' | 'NEED_MORE';

export type DisputeType =
  | 'DATA_NONE'
  | 'DATA_PARTIAL'
  | 'PAYMENT'
  | 'ACCOUNT'
  | 'TECHNICAL_PROBLEM'
  | 'REPORT_OTHER'
  | 'QNA_OTHER'
  | 'QNA'
  | 'REPORT';

export interface TradeSummary {
  tradeId: number;
  priceGb: number;
  dataAmount: number;
  carrier: string;
  myRole: string | null;
  counterpartyId: number | null;
}
export interface Dispute {
  id: string;
  status: DisputeStatus;
  type: DisputeType;
  reporter: string;
  title: string;
  description: string;
  answer?: string;
  answerAt?: string;
  createdAt: string;
  attachmentUrls?: string[];
  reporterNickname?: string;
  opponentNickname?: string;
  tradeSummary?: TradeSummary;
}

interface DisputeListResponse {
  content: Dispute[];
  last: boolean;
}

interface DisputeDetailResponse {
  data: Dispute;
}

interface DisputeFilters {
  type: DisputeType | 'ALL';
  status: DisputeStatus | 'ALL';
  category?: 'REPORT' | 'QNA';
  reporter?: string;
}

interface DisputeStore {
  disputes: Dispute[];
  pendingDisputes: Dispute[];
  loading: boolean;
  hasNext: boolean;
  currentPage: number;
  filters: DisputeFilters;

  setCurrentPage: (page: number) => void;
  setFilters: (newFilters: Partial<DisputeFilters>) => void;

  selectedDisputeId: string | null;
  isResolveModalOpen: boolean;
  openResolveModal: (id: string) => void;
  closeResolveModal: () => void;
  isConfirmModalOpen: boolean;
  confirmTitle: string;
  confirmMessage: string;
  confirmAction: (() => Promise<void>) | null;
  openConfirmModal: (
    title: string,
    message: string,
    onConfirm: () => Promise<void>
  ) => void;
  closeConfirmModal: () => void;

  resolveDispute: (
    id: string,
    result: DisputeStatus,
    answer: string
  ) => Promise<boolean>;
  fetchDisputes: (params?: { page?: number; size?: number }) => Promise<void>;
  fetchPendingDisputes: (params?: {
    page?: number;
    size?: number;
  }) => Promise<void>;
  fetchDisputeById: (id: string) => Promise<Dispute | null>;
  refundAndCancel: (id: string) => Promise<void>;
  penalizeSeller: (id: string) => Promise<void>;
  finalize: (id: string) => Promise<void>;
}

export const useDisputeStore = create<DisputeStore>((set, get) => ({
  disputes: [],
  pendingDisputes: [],
  loading: false,
  hasNext: false,
  currentPage: 0,
  filters: {
    type: 'ALL',
    status: 'ALL',
    category: undefined,
    reporter: undefined,
  },

  setCurrentPage: (page) => set({ currentPage: page }),
  setFilters: (newFilters) => {
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
      currentPage: 0,
    }));
  },

  selectedDisputeId: null,
  isResolveModalOpen: false,
  openResolveModal: (id) =>
    set({ isResolveModalOpen: true, selectedDisputeId: id }),
  closeResolveModal: () =>
    set({ isResolveModalOpen: false, selectedDisputeId: null }),
  isConfirmModalOpen: false,
  confirmTitle: '',
  confirmMessage: '',
  confirmAction: null,
  openConfirmModal: (title, message, onConfirm) =>
    set({
      isConfirmModalOpen: true,
      confirmTitle: title,
      confirmMessage: message,
      confirmAction: onConfirm,
    }),
  closeConfirmModal: () =>
    set({
      isConfirmModalOpen: false,
      confirmTitle: '',
      confirmMessage: '',
      confirmAction: null,
    }),

  // 전체 분쟁 목록 조회
  fetchDisputes: async (params = {}) => {
    set({ loading: true });
    const { filters, currentPage } = get();
    const apiParams = {
      category: filters.category,
      reporter: filters.reporter,
      type: filters.type === 'ALL' ? undefined : filters.type,
      status: filters.status === 'ALL' ? undefined : filters.status,
      page: params.page ?? currentPage,
      size: params.size ?? 20,
    };
    try {
      const res = await api.get<{ data: DisputeListResponse }>(
        '/admin/disputes',
        { params: apiParams }
      );
      set({
        disputes: res.data.data.content || [],
        hasNext: !res.data.data.last,
      });
    } catch (error) {
      toast.error(handleApiError(error));
    } finally {
      set({ loading: false });
    }
  },

  // 처리 대기중인 목록 조회
  fetchPendingDisputes: async (params = {}) => {
    set({ loading: true });
    const { currentPage } = get();
    const apiParams = {
      page: params.page ?? currentPage,
      size: params.size ?? 20,
    };
    try {
      const res = await api.get<{ data: DisputeListResponse }>(
        '/admin/disputes/pending',
        { params: apiParams }
      );
      set({
        pendingDisputes: res.data.data.content || [],
        hasNext: !res.data.data.last,
      });
    } catch (error) {
      toast.error(handleApiError(error));
    } finally {
      set({ loading: false });
    }
  },

  // 특정 건 상세 정보 조회
  fetchDisputeById: async (id) => {
    try {
      const res = await api.get<DisputeDetailResponse>(`/admin/disputes/${id}`);
      return res.data.data;
    } catch (error) {
      toast.error(handleApiError(error));
      return null;
    }
  },

  // 답변 및 상태 변경
  resolveDispute: async (id, result, answer) => {
    try {
      await api.patch(`/admin/disputes/${id}/resolve`, { result, answer });
      toast.success('답변/상태 변경이 완료되었습니다.');
      get().fetchDisputes();
      return true;
    } catch (error) {
      toast.error(handleApiError(error));
      return false;
    }
  },

  // 환불 및 거래 취소
  refundAndCancel: async (id: string) => {
    try {
      await api.post(`/admin/disputes/${id}/refund-and-cancel`);
      toast.success('환불 및 취소 처리가 완료되었습니다.');
      get().fetchDisputes();
    } catch (error) {
      toast.error(handleApiError(error));
    }
  },

  // 판매자 패널티 부여
  penalizeSeller: async (id: string) => {
    try {
      await api.post(`/admin/disputes/${id}/penalty-seller`);
      toast.success('판매자에게 패널티가 부여되었습니다.');
      get().fetchDisputes();
    } catch (error) {
      toast.error(handleApiError(error));
    }
  },

  // 거래 복구(최종 처리)
  finalize: async (id: string) => {
    try {
      await api.post(`/admin/disputes/${id}/finalize`);
      toast.success('최종 처리가 완료되었습니다.');
      get().fetchDisputes();
    } catch (error) {
      toast.error(handleApiError(error));
    }
  },
}));
