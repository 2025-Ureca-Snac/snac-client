// 임시 파일
import { create } from 'zustand';
import { toast } from 'sonner';
import { api } from '@/app/(shared)/utils/api';

export interface Blog {
  id: number;
  title: string;
  author: string;
  category: string;
  date: string;
  contentFileUrl?: string;
  imageUrl?: string;
}

interface BlogState {
  blogs: Blog[];
  loading: boolean;
  error: string | null;
  hasNext: boolean;

  fetchAll: () => Promise<void>;
  fetchMore: () => Promise<void>; // 무한 스크롤 용
}

export const useBlogStore = create<BlogState>((set, get) => ({
  blogs: [],
  loading: false,
  error: null,
  hasNext: true,

  // 관리자 전체 조회 (사이즈 크게)
  fetchAll: async () => {
    set({ loading: true, error: null });
    try {
      const res = await api.get<{
        data: { articleResponseList: Blog[]; hasNext: boolean };
      }>('/articles', { params: { size: 10000 } });

      const { articleResponseList, hasNext } = res.data.data;

      set({
        blogs: articleResponseList ?? [],
        hasNext,
        loading: false,
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : '전체 목록 로드 실패';
      set({ error: msg, loading: false });
      toast.error(msg);
    }
  },

  // 무한 스크롤 (lastArticleId 사용)
  fetchMore: async () => {
    const { blogs, hasNext, loading } = get();
    if (!hasNext || loading) return;

    set({ loading: true });
    try {
      const lastId = blogs.length > 0 ? blogs[blogs.length - 1].id : undefined;

      const res = await api.get<{
        data: { articleResponseList: Blog[]; hasNext: boolean };
      }>('/articles', {
        params: { lastArticleId: lastId, size: 9 },
      });

      const { articleResponseList, hasNext: newHasNext } = res.data.data;

      set({
        blogs: [...blogs, ...(articleResponseList ?? [])],
        hasNext: newHasNext,
        loading: false,
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : '추가 로드 실패';
      set({ error: msg, loading: false });
      toast.error(msg);
    }
  },
}));
