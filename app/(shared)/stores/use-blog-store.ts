// app/admin/blog/store.ts
import { create } from 'zustand';
import { toast } from 'sonner';
import { api } from '@/app/(shared)/utils/api';

export interface Blog {
  id: number;
  title: string;
  nickname: string;
  contentFileUrl?: string;
  imageUrl?: string;
  articleUrl?: string;
}

interface BlogState {
  blogs: Blog[];
  currentBlog: Blog | null;
  loading: boolean;
  error: string | null;
  hasNext: boolean;

  // 목록 조회
  fetchAll: () => Promise<void>;
  fetchMore: () => Promise<void>;

  // 상세 조회
  fetchOne: (articleId: number) => Promise<void>;

  // 수정
  updateBlog: (
    articleId: number,
    title: string,
    file: File,
    image: File
  ) => Promise<void>;

  // 삭제 모달 관련
  isDeleteModalOpen: boolean;
  selectedBlogId: number | null;
  openDeleteModal: (id: number) => void;
  closeDeleteModal: () => void;
  deleteBlog: () => Promise<void>;
}

export const useBlogStore = create<BlogState>((set, get) => ({
  blogs: [],
  currentBlog: null,
  loading: false,
  error: null,
  hasNext: true,

  //  전체 조회
  fetchAll: async () => {
    set({ loading: true, error: null });
    try {
      const res = await api.get<{
        data: { articleResponseList: Blog[]; hasNext: boolean };
      }>('/articles', { params: { size: 20 } });

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

  //  무한 스크롤
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

  // 상세 조회
  fetchOne: async (articleId) => {
    set({ loading: true, error: null });
    try {
      const res = await api.get<{
        data: {
          id: number;
          email: string;
          name: string;
          nickname: string;
          articleUrl?: string;
          imageUrl?: string;
          title: string | null;
        };
      }>(`/articles/${articleId}`);

      const raw = res.data.data;

      const mappedBlog: Blog = {
        id: raw.id,
        title: raw.title ?? '(제목 없음)',
        nickname: raw.nickname,
        contentFileUrl: raw.articleUrl,
        imageUrl: raw.imageUrl,
        articleUrl: raw.articleUrl,
      };

      set({ currentBlog: mappedBlog, loading: false });
    } catch (err) {
      const msg = err instanceof Error ? err.message : '상세 조회 실패';
      set({ error: msg, loading: false });
      toast.error(msg);
    }
  },

  // 수정
  updateBlog: async (articleId, title, file, image) => {
    set({ loading: true, error: null });
    try {
      const form = new FormData();
      form.append('title', title);
      form.append('file', file);
      form.append('image', image);

      await api.put(`/articles/${articleId}`, form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      toast.success('게시글이 수정되었습니다.');

      // 수정 후 목록 갱신
      await get().fetchAll();
      set({ loading: false });
    } catch (err) {
      const msg = err instanceof Error ? err.message : '수정 실패';
      set({ error: msg, loading: false });
      toast.error(msg);
    }
  },

  // 삭제 모달 상태
  isDeleteModalOpen: false,
  selectedBlogId: null,
  openDeleteModal: (id) => set({ isDeleteModalOpen: true, selectedBlogId: id }),
  closeDeleteModal: () =>
    set({ isDeleteModalOpen: false, selectedBlogId: null }),

  // 삭제 기능
  deleteBlog: async () => {
    const { selectedBlogId, blogs } = get();
    if (!selectedBlogId) return;

    set({ loading: true });
    try {
      await api.delete(`/articles/${selectedBlogId}`);

      set({
        blogs: blogs.filter((b) => b.id !== selectedBlogId),
        isDeleteModalOpen: false,
        selectedBlogId: null,
        loading: false,
      });

      toast.success('게시글이 삭제되었습니다.');
    } catch (err) {
      const msg = err instanceof Error ? err.message : '삭제 실패';
      set({ error: msg, loading: false });
      toast.error(msg);
    }
  },
}));
