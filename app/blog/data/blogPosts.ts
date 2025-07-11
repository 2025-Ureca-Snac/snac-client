import { BlogPost } from '@/app/(shared)/components/BlogCard';

export const blogPosts: BlogPost[] = [
  {
    id: 1,
    title: '데이터 기반 아웃렛 마케팅은?',
    subtitle: '더 보기 →',
    image: '/blog1.png',
    featured: true,
  },
  {
    id: 2,
    title: '데이터 기반 아웃렛 마케팅은?',
    subtitle: '더 보기 →',
    image: '/blog2.png',
    featured: false,
  },
  {
    id: 3,
    title: '데이터 기반 아웃렛 마케팅은?',
    subtitle: '더 보기 →',
    image: '/blog3.png',
    featured: true,
  },
  {
    id: 4,
    title: '데이터 기반 아웃렛 마케팅은?',
    subtitle: '더 보기 →',
    image: '/blog1.png',
    featured: false,
  },
  {
    id: 5,
    title: '데이터 기반 아웃렛 마케팅은?',
    subtitle: '더 보기 →',
    image: '/blog2.png',
    featured: true,
  },
  {
    id: 6,
    title: '데이터 기반 아웃렛 마케팅은?',
    subtitle: '더 보기 →',
    image: '/blog3.png',
    featured: false,
  },
  {
    id: 7,
    title: '데이터 기반 아웃렛 마케팅은?',
    subtitle: '더 보기 →',
    image: '/blog1.png',
    featured: true,
  },
  {
    id: 8,
    title: '데이터 기반 아웃렛 마케팅은?',
    subtitle: '더 보기 →',
    image: '/blog2.png',
    featured: false,
  },
  {
    id: 9,
    title: '데이터 기반 아웃렛 마케팅은?',
    subtitle: '더 보기 →',
    image: '/blog3.png',
    featured: true,
  },
];

// 추가 유틸리티 함수들
export const getFeaturedPosts = () => blogPosts.filter((post) => post.featured);
export const getPostById = (id: number) =>
  blogPosts.find((post) => post.id === id);
export const getPostsByPage = (page: number, limit: number = 9) => {
  const start = (page - 1) * limit;
  const end = start + limit;
  return blogPosts.slice(start, end);
};
