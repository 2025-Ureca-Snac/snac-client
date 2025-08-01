'use client';

import { create } from 'zustand';
import { api, handleApiError } from '@/app/(shared)/utils/api';
import { toast } from 'sonner';

export type DisputeStatus =
  | 'IN_PROGRESS'
  | 'ANSWERED'
  | 'NEED_MORE'
  | 'REJECTED';
export type DisputeType = 'DATA_NONE' | 'DATA_PARTIAL' | 'OTHER';

export interface Dispute {
  id: string;
  status: DisputeStatus;
  type: DisputeType;
  reporter: string;
  answer?: string;
  createdAt: string;
}

interface DisputeListResponse {
  data: Dispute[];
  hasNext: boolean;
}

interface DisputeDetailResponse {
  data: Dispute;
}

interface DisputeStore {
  disputes: Dispute[];
  pendingDisputes: Dispute[];
  currentDispute: Dispute | null;
  loading: boolean;
  error: string | null;
  hasNext: boolean;
  currentPage: number;
  setCurrentPage: (page: number) => void;

  // --- 모달 공통 상태 ---
  selectedDisputeId: string | null;

  // --- 삭제 모달 관련 상태 및 함수 ---
  isDeleteModalOpen: boolean;
  openDeleteModal: (id: string) => void;
  closeDeleteModal: () => void;
  deleteDispute: (id: string) => Promise<void>;

  // --- 해결 모달 관련 상태 및 함수 ---
  isResolveModalOpen: boolean;
  openResolveModal: (id: string) => void;
  closeResolveModal: () => void;
  resolveDispute: (
    id: string,
    result: DisputeStatus,
    answer: string
  ) => Promise<boolean>;
  fetchDisputeById: (id: string) => Promise<Dispute | null>;

  // --- 기존 액션 함수들 ---
  fetchDisputes: (params?: {
    status?: DisputeStatus;
    type?: DisputeType;
    reporter?: string;
    page?: number;
    size?: number;
  }) => Promise<void>;
  fetchDispute: (id: string) => Promise<void>;
  fetchPendingDisputes: (page?: number, size?: number) => Promise<void>;
  refundAndCancel: (id: string) => Promise<void>;
  penaltySeller: (id: string) => Promise<void>;
  finalize: (id: string) => Promise<void>;
}

export const useDisputeStore = create<DisputeStore>((set, get) => ({
  disputes: [],
  pendingDisputes: [],
  currentDispute: null,
  loading: false,
  error: null,
  hasNext: false,
  currentPage: 0,
  setCurrentPage: (page) => set({ currentPage: page }),

  // --- 모달 공통 상태 초기화 ---
  selectedDisputeId: null,

  // --- 삭제 모달 관련 구현 ---
  isDeleteModalOpen: false,
  openDeleteModal: (id) =>
    set({ isDeleteModalOpen: true, selectedDisputeId: id }),
  closeDeleteModal: () =>
    set({ isDeleteModalOpen: false, selectedDisputeId: null }),
  async deleteDispute(id: string) {
    set({ loading: true, error: null });
    try {
      await api.delete(`/admin/disputes/${id}`);
      toast.success('분쟁이 성공적으로 삭제되었습니다.');
      set({ isDeleteModalOpen: false, selectedDisputeId: null });
      get().fetchDisputes({ page: get().currentPage });
    } catch (error) {
      toast.error(handleApiError(error));
    } finally {
      set({ loading: false });
    }
  },

  // --- 해결 모달 관련 구현 ---
  isResolveModalOpen: false,
  openResolveModal: (id) =>
    set({ isResolveModalOpen: true, selectedDisputeId: id }),
  closeResolveModal: () =>
    set({ isResolveModalOpen: false, selectedDisputeId: null }),
  async resolveDispute(id, result, answer) {
    set({ loading: true, error: null });
    try {
      await api.patch(`/admin/disputes/${id}/resolve`, { answer, result });
      toast.success('분쟁 답변/상태 변경 완료');
      get().fetchDisputes({ page: get().currentPage });
      return true; // 성공 시 true 반환
    } catch (error) {
      toast.error(handleApiError(error));
      return false; // 실패 시 false 반환
    } finally {
      set({ loading: false });
    }
  },
  async fetchDisputeById(id) {
    set({ loading: true, error: null });
    try {
      const res = await api.get<DisputeDetailResponse>(`/admin/disputes/${id}`);
      return res.data.data;
    } catch (error) {
      toast.error(handleApiError(error));
      return null;
    } finally {
      set({ loading: false });
    }
  },

  // --- 기존 액션 함수들 ---
  async fetchDisputes(params = {}) {
    set({ loading: true, error: null });
    try {
      const { status, type, reporter, page = 0, size = 20 } = params;
      const res = await api.get<DisputeListResponse>('/admin/disputes', {
        params: { status, type, reporter, page, size },
      });
      set({
        disputes: res.data.data || [],
        hasNext: !!res.data.hasNext,
      });
    } catch (error) {
      set({ error: '분쟁 목록 조회 실패' });
      toast.error(handleApiError(error));
    } finally {
      set({ loading: false });
    }
  },

  async fetchDispute(id: string) {
    set({ loading: true, error: null });
    try {
      const res = await api.get<DisputeDetailResponse>(`/admin/disputes/${id}`);
      set({ currentDispute: res.data.data });
    } catch (error) {
      set({ error: '분쟁 상세 조회 실패' });
      toast.error(handleApiError(error));
    } finally {
      set({ loading: false });
    }
  },

  async fetchPendingDisputes(page = 0, size = 20) {
    set({ loading: true, error: null });
    try {
      const res = await api.get<DisputeListResponse>(
        '/admin/disputes/pending',
        {
          params: { page, size },
        }
      );
      set({ pendingDisputes: res.data.data || [] });
    } catch (error) {
      set({ error: '보류 분쟁 조회 실패' });
      toast.error(handleApiError(error));
    } finally {
      set({ loading: false });
    }
  },

  async refundAndCancel(id: string) {
    set({ loading: true, error: null });
    try {
      await api.post(`/admin/disputes/${id}/refund-and-cancel`);
      toast.success('환불 및 취소 처리 완료');
      get().fetchDisputes({ page: get().currentPage });
    } catch (error) {
      set({ error: '환불/취소 실패', loading: false });
      toast.error(handleApiError(error));
    } finally {
      set({ loading: false });
    }
  },

  async penaltySeller(id: string) {
    set({ loading: true, error: null });
    try {
      await api.post(`/admin/disputes/${id}/penalty-seller`);
      toast.success('판매자 패널티 부여 완료');
      get().fetchDisputes({ page: get().currentPage });
    } catch (error) {
      set({ error: '패널티 처리 실패', loading: false });
      toast.error(handleApiError(error));
    } finally {
      set({ loading: false });
    }
  },

  async finalize(id: string) {
    set({ loading: true, error: null });
    try {
      await api.post(`/admin/disputes/${id}/finalize`);
      toast.success('분쟁 최종 처리 완료');
      get().fetchDisputes({ page: get().currentPage });
    } catch (error) {
      set({ error: '최종 처리 실패', loading: false });
      toast.error(handleApiError(error));
    } finally {
      set({ loading: false });
    }
  },
}));
