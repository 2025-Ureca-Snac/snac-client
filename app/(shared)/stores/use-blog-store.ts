import { create } from 'zustand';
import { toast } from 'sonner';

interface Blog {
  id: number;
  title: string;
  author: string;
  category: string;
  date: string;
}

interface BlogState {
  blogs: Blog[];
  loading: boolean;
  error: string | null;
  isDeleteModalOpen: boolean;
  selectedBlogId: number | null;
  fetchBlogs: () => Promise<void>;
  openDeleteModal: (id: number) => void;
  closeDeleteModal: () => void;
  deleteBlog: () => Promise<void>;
}

const MOCK_BLOGS: Blog[] = [
  {
    id: 18,
    title: '이메일 마케팅 ROI 향상 전략',
    author: '이메일팀',
    category: '이메일마케팅',
    date: '2023-11-30',
  },
  {
    id: 17,
    title: 'SEO 최적화 완벽 가이드',
    author: 'SEO팀',
    category: 'SEO',
    date: '2023-12-05',
  },
  {
    id: 16,
    title: '콘텐츠 마케팅 전략 수립',
    author: '콘텐츠팀',
    category: '콘텐츠마케팅',
    date: '2023-12-10',
  },
];

export const useBlogStore = create<BlogState>((set, get) => ({
  blogs: [],
  loading: true,
  error: null,
  isDeleteModalOpen: false,
  selectedBlogId: null,

  fetchBlogs: async () => {
    set({ loading: true, error: null });
    try {
      // API 호출 및 지연 시뮬레이션
      const blogs = await new Promise<Blog[]>((resolve, reject) => {
        setTimeout(() => {
          // 20% 확률로 에러 발생 시뮬레이션
          if (Math.random() < 0.2) {
            reject(new Error('서버에서 블로그 목록을 가져오지 못했습니다.'));
          } else {
            resolve(MOCK_BLOGS);
          }
        }, 500);
      });
      set({ blogs, loading: false });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.';
      set({ error: message, loading: false });
    }
  },

  openDeleteModal: (id) => set({ isDeleteModalOpen: true, selectedBlogId: id }),

  closeDeleteModal: () =>
    set({ isDeleteModalOpen: false, selectedBlogId: null }),

  deleteBlog: async () => {
    const { selectedBlogId } = get();
    if (!selectedBlogId) return;

    try {
      // API 호출 시뮬레이션
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          // 20% 확률로 에러 발생 시뮬레이션
          if (Math.random() < 0.2) {
            reject(new Error('서버 문제로 글을 삭제하지 못했습니다.'));
          } else {
            resolve(true);
          }
        }, 300);
      });

      set((state) => ({
        blogs: state.blogs.filter((blog) => blog.id !== selectedBlogId),
        isDeleteModalOpen: false,
        selectedBlogId: null,
      }));
      toast.success('블로그 글이 성공적으로 삭제되었습니다.');
    } catch (err) {
      const message =
        err instanceof Error ? err.message : '블로그 글 삭제에 실패했습니다.';
      toast.error(message);
    }
  },
}));
