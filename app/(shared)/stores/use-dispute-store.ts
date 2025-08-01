// app/(shared)/stores/use-dispute-store.ts
import { create } from 'zustand';
import { api, handleApiError } from '@/app/(shared)/utils/api';
import { toast } from 'sonner';

// 1. Enum 정의
export type DisputeStatus =
  | 'IN_PROGRESS'
  | 'ANSWERED'
  | 'NEED_MORE'
  | 'REJECTED';
export type DisputeType = 'DATA_NONE' | 'DATA_PARTIAL' | 'OTHER';

// 2. 인터페이스
export interface Dispute {
  id: string;
  status: DisputeStatus;
  type: DisputeType;
  reporter: string;
  answer?: string;
  createdAt: string;
  // 필요 시 기타 필드 추가
}

// 3. Zustand Store 타입
interface DisputeStore {
  disputes: Dispute[];
  pendingDisputes: Dispute[];
  currentDispute: Dispute | null;
  loading: boolean;
  error: string | null;
  hasNext: boolean;
  currentPage: number; // 추가!
  setCurrentPage: (page: number) => void; // 추가!

  // 목록 조회
  fetchDisputes: (params?: {
    status?: DisputeStatus;
    type?: DisputeType;
    reporter?: string;
    page?: number;
    size?: number;
  }) => Promise<void>;

  // 상세 조회
  fetchDispute: (id: string) => Promise<void>;

  // 미처리(보류) 목록 조회
  fetchPendingDisputes: (page?: number, size?: number) => Promise<void>;

  // 분쟁 처리 액션
  refundAndCancel: (id: string) => Promise<void>;
  penaltySeller: (id: string) => Promise<void>;
  finalize: (id: string) => Promise<void>;
  resolve: (id: string, answer: string, result: DisputeStatus) => Promise<void>;
}

// 4. Zustand Store 구현
export const useDisputeStore = create<DisputeStore>((set, get) => ({
  disputes: [],
  pendingDisputes: [],
  currentDispute: null,
  loading: false,
  error: null,
  hasNext: false,
  currentPage: 0, // 추가!
  setCurrentPage: (page) => set({ currentPage: page }), // 추가!

  // 목록 조회
  async fetchDisputes(params = {}) {
    set({ loading: true, error: null });
    try {
      const { status, type, reporter, page = 0, size = 20 } = params;
      const res = await api.get('/admin/disputes', {
        params: { status, type, reporter, page, size },
      });
      set({
        disputes: res.data.data || [],
        hasNext: !!res.data.hasNext,
        loading: false,
      });
    } catch (error) {
      set({ loading: false, error: '분쟁 목록 조회 실패' });
      handleApiError(error);
    }
  },

  // 상세 조회
  async fetchDispute(id: string) {
    set({ loading: true, error: null });
    try {
      const res = await api.get(`/admin/disputes/${id}`);
      set({ currentDispute: res.data.data, loading: false });
    } catch (error) {
      set({ loading: false, error: '분쟁 상세 조회 실패' });
      handleApiError(error);
    }
  },

  // 미처리(보류) 목록 조회
  async fetchPendingDisputes(page = 0, size = 20) {
    set({ loading: true, error: null });
    try {
      const res = await api.get('/admin/disputes/pending', {
        params: { page, size },
      });
      set({ pendingDisputes: res.data.data || [], loading: false });
    } catch (error) {
      set({ loading: false, error: '보류 분쟁 조회 실패' });
      handleApiError(error);
    }
  },

  // 환불/취소 처리
  async refundAndCancel(id: string) {
    set({ loading: true, error: null });
    try {
      await api.post(`/admin/disputes/${id}/refund-and-cancel`);
      toast.success('환불 및 취소 처리 완료');
      // 필요시 disputes 새로고침 등 추가
    } catch (error) {
      set({ error: '환불/취소 실패', loading: false });
      handleApiError(error);
    } finally {
      set({ loading: false });
    }
  },

  // 판매자 패널티
  async penaltySeller(id: string) {
    set({ loading: true, error: null });
    try {
      await api.post(`/admin/disputes/${id}/penalty-seller`);
      toast.success('판매자 패널티 부여 완료');
    } catch (error) {
      set({ error: '패널티 처리 실패', loading: false });
      handleApiError(error);
    } finally {
      set({ loading: false });
    }
  },

  // 분쟁 최종처리
  async finalize(id: string) {
    set({ loading: true, error: null });
    try {
      await api.post(`/admin/disputes/${id}/finalize`);
      toast.success('분쟁 최종 처리 완료');
    } catch (error) {
      set({ error: '최종 처리 실패', loading: false });
      handleApiError(error);
    } finally {
      set({ loading: false });
    }
  },

  // 분쟁 resolve (답변 및 상태 변경)
  async resolve(id: string, answer: string, result: DisputeStatus) {
    set({ loading: true, error: null });
    try {
      await api.patch(`/admin/disputes/${id}/resolve`, { answer, result });
      toast.success('분쟁 답변/상태 변경 완료');
    } catch (error) {
      set({ error: '분쟁 답변 실패', loading: false });
      handleApiError(error);
    } finally {
      set({ loading: false });
    }
  },
}));
