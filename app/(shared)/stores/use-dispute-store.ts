'use client';

import { create } from 'zustand';
import { api, handleApiError } from '@/app/(shared)/utils/api';
import { toast } from 'sonner';

export type DisputeStatus =
  | 'IN_PROGRESS'
  | 'ANSWERED'
  | 'NEED_MORE'
  | 'REJECTED';

export type DisputeType =
  | 'DATA_NONE'
  | 'DATA_PARTIAL'
  | 'PAYMENT'
  | 'ACCOUNT'
  | 'TECHNICAL_PROBLEM'
  | 'OTHER';

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

  // --- 삭제 모달 상태 및 함수 ---
  selectedDisputeId: string | null;
  isDeleteModalOpen: boolean;
  openDeleteModal: (id: string) => void;
  closeDeleteModal: () => void;
  deleteDispute: (id: string) => Promise<void>;

  // --- 해결 모달 상태 및 함수 ---
  isResolveModalOpen: boolean;
  openResolveModal: (id: string) => void;
  closeResolveModal: () => void;
  resolveDispute: (
    id: string,
    result: DisputeStatus,
    answer: string
  ) => Promise<boolean>;

  // --- 확인 모달 상태 및 함수 ---
  isConfirmModalOpen: boolean;
  confirmMessage: string;
  confirmAction: (() => void) | null;
  openConfirmModal: (message: string, onConfirm: () => void) => void;
  closeConfirmModal: () => void;

  // --- 액션 함수들 ---
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
  fetchDisputeById: (id: string) => Promise<Dispute | null>;
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

  // --- 삭제 모달 상태 및 함수 ---
  selectedDisputeId: null,
  isDeleteModalOpen: false,
  openDeleteModal: (id) =>
    set({ isDeleteModalOpen: true, selectedDisputeId: id }),
  closeDeleteModal: () =>
    set({ isDeleteModalOpen: false, selectedDisputeId: null }),
  // /admin/disputes/{id} (DELETE)
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

  // --- 해결 모달 상태 및 함수 ---
  isResolveModalOpen: false,
  openResolveModal: (id) =>
    set({ isResolveModalOpen: true, selectedDisputeId: id }),
  closeResolveModal: () =>
    set({ isResolveModalOpen: false, selectedDisputeId: null }),
  // /admin/disputes/{id}/resolve (PATCH)
  async resolveDispute(id, result, answer) {
    set({ loading: true, error: null });
    try {
      await api.patch(`/admin/disputes/${id}/resolve`, { answer, result });
      toast.success('분쟁 답변/상태 변경 완료');
      get().fetchDisputes({ page: get().currentPage });
      return true;
    } catch (error) {
      toast.error(handleApiError(error));
      return false;
    } finally {
      set({ loading: false });
    }
  },

  // --- 확인 모달 상태 및 함수 ---
  isConfirmModalOpen: false,
  confirmMessage: '',
  confirmAction: null,
  openConfirmModal: (message, onConfirm) =>
    set({
      isConfirmModalOpen: true,
      confirmMessage: message,
      confirmAction: onConfirm,
    }),
  closeConfirmModal: () =>
    set({
      isConfirmModalOpen: false,
      confirmMessage: '',
      confirmAction: null,
    }),

  // /admin/disputes (GET)
  async fetchDisputes(params = {}) {
    set({ loading: true, error: null });
    try {
      const { status, type, reporter, page = 0, size = 20 } = params;
      const res = await api.get<DisputeListResponse>('/admin/disputes', {
        params: { status, type, reporter, page, size },
      });
      set({
        disputes: Array.isArray(res.data.data) ? res.data.data : [],
        hasNext: res.data.hasNext ?? false,
      });
    } catch (error) {
      set({ error: '분쟁 목록 조회 실패' });
      toast.error(handleApiError(error));
    } finally {
      set({ loading: false });
    }
  },

  // /admin/disputes/{id} (GET)
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

  // /admin/disputes/pending (GET)
  async fetchPendingDisputes(page = 0, size = 20) {
    set({ loading: true, error: null });
    try {
      const res = await api.get<DisputeListResponse>(
        '/admin/disputes/pending',
        { params: { page, size } }
      );
      set({
        pendingDisputes: Array.isArray(res.data.data) ? res.data.data : [],
      });
    } catch (error) {
      set({ error: '보류 분쟁 조회 실패' });
      toast.error(handleApiError(error));
    } finally {
      set({ loading: false });
    }
  },

  // /admin/disputes/{id}/refund-and-cancel (POST)
  async refundAndCancel(id: string) {
    set({ loading: true, error: null });
    try {
      await api.post(`/admin/disputes/${id}/refund-and-cancel`);
      toast.success('환불 및 취소 처리 완료');
      get().fetchDisputes({ page: get().currentPage });
    } catch (error) {
      set({ error: '환불/취소 실패' });
      toast.error(handleApiError(error));
    } finally {
      set({ loading: false });
    }
  },

  // /admin/disputes/{id}/penalty-seller (POST)
  async penaltySeller(id: string) {
    set({ loading: true, error: null });
    try {
      await api.post(`/admin/disputes/${id}/penalty-seller`);
      toast.success('판매자 패널티 부여 완료');
      get().fetchDisputes({ page: get().currentPage });
    } catch (error) {
      set({ error: '패널티 처리 실패' });
      toast.error(handleApiError(error));
    } finally {
      set({ loading: false });
    }
  },

  // /admin/disputes/{id}/finalize (POST)
  async finalize(id: string) {
    set({ loading: true, error: null });
    try {
      await api.post(`/admin/disputes/${id}/finalize`);
      toast.success('분쟁 최종 처리 완료');
      get().fetchDisputes({ page: get().currentPage });
    } catch (error) {
      set({ error: '최종 처리 실패' });
      toast.error(handleApiError(error));
    } finally {
      set({ loading: false });
    }
  },

  // /admin/disputes/{id} (GET) 단건 상세 (별도 fetch)
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
}));
