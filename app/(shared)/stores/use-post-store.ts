import { create } from 'zustand';
import { toast } from 'sonner';

interface Post {
  id: number;
  title: string;
  author: string;
  category: string;
  date: string;
}

interface PostState {
  posts: Post[];
  loading: boolean;
  error: string | null;
  isDeleteModalOpen: boolean;
  selectedPostId: number | null;
  fetchPosts: () => Promise<void>;
  openDeleteModal: (id: number) => void;
  closeDeleteModal: () => void;
  deletePost: () => Promise<void>;
}

const mockPosts: Post[] = [
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

export const usePostStore = create<PostState>((set, get) => ({
  posts: [],
  loading: true,
  error: null,
  isDeleteModalOpen: false,
  selectedPostId: null,

  fetchPosts: async () => {
    set({ loading: true, error: null });
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      set({ posts: mockPosts, loading: false });
    } catch {
      set({ error: '데이터를 불러오는데 실패했습니다.', loading: false });
    }
  },

  openDeleteModal: (id) => set({ isDeleteModalOpen: true, selectedPostId: id }),

  closeDeleteModal: () =>
    set({ isDeleteModalOpen: false, selectedPostId: null }),

  deletePost: async () => {
    const { selectedPostId } = get();
    if (!selectedPostId) return;

    try {
      console.log(`${selectedPostId}번 게시물 삭제 API 호출`);
      await new Promise((resolve) => setTimeout(resolve, 300));

      set((state) => ({
        posts: state.posts.filter((p) => p.id !== selectedPostId),
        isDeleteModalOpen: false,
        selectedPostId: null,
      }));
      toast.success('게시물이 성공적으로 삭제되었습니다.');
    } catch (err) {
      console.error('삭제 실패:', err);
      toast.error('게시물 삭제에 실패했습니다.');
    }
  },
}));
