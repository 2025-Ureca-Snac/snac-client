import { create } from 'zustand';

import { api } from '@/app/(shared)/utils/api';

interface ApiResponse<T> {
  data: T;
  code: string;
  status: string;
  message: string;
  timestamp: string;
}

interface MemberCountData {
  memberCount: number;
}

interface DashboardMetrics {
  memberCount: number;
}

interface AdminState {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (isOpen: boolean) => void;

  dashboardMetrics: DashboardMetrics | null;
  loading: boolean;
  error: string | null;
  fetchDashboardMetrics: () => Promise<void>;
}

export const useAdminStore = create<AdminState>((set) => ({
  isSidebarOpen: false,
  toggleSidebar: () =>
    set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  setSidebarOpen: (isOpen) => set({ isSidebarOpen: isOpen }),

  dashboardMetrics: null,
  loading: true,
  error: null,

  fetchDashboardMetrics: async () => {
    set({ loading: true, error: null });
    try {
      const response =
        await api.get<ApiResponse<MemberCountData>>('/member/count');

      const count = response.data.data.memberCount;

      if (typeof count === 'number') {
        set({
          dashboardMetrics: { memberCount: count },
          loading: false,
        });
      } else {
        throw new Error('API 응답에서 memberCount를 찾을 수 없습니다.');
      }
    } catch (err) {
      console.error('대시보드 데이터 로딩 실패:', err);
      set({
        error: '대시보드 정보를 불러오는데 실패했습니다.',
        loading: false,
      });
    }
  },
}));
