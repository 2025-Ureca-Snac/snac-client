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
interface ArticleCountData {
  articleCount: number;
}

interface DashboardMetrics {
  memberCount: number;
  activePostsCount: number;
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
      const [memberResponse, articleResponse] = await Promise.all([
        api.get<ApiResponse<MemberCountData>>('/member/count'),
        api.get<ApiResponse<ArticleCountData>>('/articles/count'),
      ]);

      const memberCount = memberResponse.data.data.memberCount;
      const articleCount = articleResponse.data.data.articleCount;

      if (typeof memberCount === 'number' && typeof articleCount === 'number') {
        set({
          dashboardMetrics: {
            memberCount: memberCount,
            activePostsCount: articleCount,
          },
          loading: false,
        });
      } else {
        throw new Error('API 응답 데이터 형식이 올바르지 않습니다.');
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
