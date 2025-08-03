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

  countByCategory?: { [key: string]: number };
}

interface CountByType {
  [key: string]: number;
}
interface StatisticsApiResponse {
  data: {
    countByCategory: { [key: string]: number };
    countByType: CountByType;
  };
}

interface ChartData {
  name: string;
  value: number;
}

interface AdminState {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (isOpen: boolean) => void;

  dashboardMetrics: DashboardMetrics | null;
  loading: boolean;
  error: string | null;
  fetchDashboardMetrics: () => Promise<void>;

  qnaChartData: ChartData[];
  qnaChartLoading: boolean;
  qnaChartError: string | null;
  fetchQnaChartData: () => Promise<void>;

  reportChartData: ChartData[];
  reportChartLoading: boolean;
  reportChartError: string | null;
  fetchReportChartData: () => Promise<void>;
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
      const [memberResponse, articleResponse, statsResponse] =
        await Promise.all([
          api.get<ApiResponse<MemberCountData>>('/member/count'),
          api.get<ApiResponse<ArticleCountData>>('/articles/count'),
          api.get<StatisticsApiResponse>('/admin/disputes/statistics'), // Fetch dispute statistics
        ]);

      const memberCount = memberResponse.data.data.memberCount;
      const articleCount = articleResponse.data.data.articleCount;

      const countByCategory = statsResponse.data.data.countByCategory;

      if (
        typeof memberCount === 'number' &&
        typeof articleCount === 'number' &&
        countByCategory &&
        typeof countByCategory === 'object'
      ) {
        set({
          dashboardMetrics: {
            memberCount: memberCount,
            activePostsCount: articleCount,
            countByCategory: countByCategory, // ✅ Include countByCategory
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

  qnaChartData: [],
  qnaChartLoading: true,
  qnaChartError: null,
  fetchQnaChartData: async () => {
    set({ qnaChartLoading: true, qnaChartError: null });
    try {
      const response = await api.get<StatisticsApiResponse>(
        '/admin/disputes/statistics'
      );
      const stats = response.data.data.countByType;

      const TYPE_LABELS: { [key: string]: string } = {
        TECHNICAL_PROBLEM: '기술 문의',
        ACCOUNT: '계정 문의',
        PAYMENT: '결제 문의',
      };

      if (stats && typeof stats === 'object') {
        const transformedData = Object.keys(stats)
          .filter((key) => key in TYPE_LABELS)
          .map((key) => ({
            name: TYPE_LABELS[key],
            value: stats[key],
          }));
        set({ qnaChartData: transformedData, qnaChartLoading: false });
      } else {
        set({ qnaChartData: [], qnaChartLoading: false });
      }
    } catch (err) {
      console.error(err);
      set({
        qnaChartError: '통계 데이터를 불러오는 데 실패했습니다.',
        qnaChartLoading: false,
      });
    }
  },

  reportChartData: [],
  reportChartLoading: true,
  reportChartError: null,
  fetchReportChartData: async () => {
    set({ reportChartLoading: true, reportChartError: null });
    try {
      const response = await api.get<StatisticsApiResponse>(
        '/admin/disputes/statistics'
      );
      const stats = response.data.data.countByType;

      const TYPE_LABELS: { [key: string]: string } = {
        DATA_NONE: '데이터 미수신',
        DATA_PARTIAL: '데이터 일부 수신',
      };

      if (stats && typeof stats === 'object') {
        const transformedData = Object.keys(stats)
          .filter((key) => key in TYPE_LABELS)
          .map((key) => ({
            name: TYPE_LABELS[key],
            value: stats[key],
          }));
        set({ reportChartData: transformedData, reportChartLoading: false });
      } else {
        set({ reportChartData: [], reportChartLoading: false });
      }
    } catch (err) {
      console.error(err);
      set({
        reportChartError: '통계 데이터를 불러오는 데 실패했습니다.',
        reportChartLoading: false,
      });
    }
  },
}));
