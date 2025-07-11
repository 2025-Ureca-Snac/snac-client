import { BlogPost } from '@/app/(shared)/components/BlogCard';
import { BLOG_POSTS } from '../data/blogPosts';

/**
 * 추천 포스트만 필터링하여 반환
 * @returns 추천 포스트 배열
 */
export const getFeaturedPosts = (): BlogPost[] => {
  return BLOG_POSTS.filter((post) => post.featured);
};

/**
 * ID로 특정 포스트 검색
 * @param id - 검색할 포스트 ID
 * @returns 해당 ID의 포스트 또는 undefined
 */
export const getPostById = (id: number): BlogPost | undefined => {
  return BLOG_POSTS.find((post) => post.id === id);
};

/**
 * 페이지네이션을 위한 포스트 배열 반환
 * @param page - 페이지 번호 (1부터 시작)
 * @param limit - 페이지당 포스트 수 (기본값: 9)
 * @returns 해당 페이지의 포스트 배열
 */
export const getPostsByPage = (page: number, limit: number = 9): BlogPost[] => {
  const start = (page - 1) * limit;
  const end = start + limit;
  return BLOG_POSTS.slice(start, end);
};

/**
 * 전체 포스트 개수 반환
 * @returns 전체 포스트 개수
 */
export const getTotalPostsCount = (): number => {
  return BLOG_POSTS.length;
};

/**
 * 전체 페이지 수 계산
 * @param limit - 페이지당 포스트 수 (기본값: 9)
 * @returns 전체 페이지 수
 */
export const getTotalPages = (limit: number = 9): number => {
  return Math.ceil(BLOG_POSTS.length / limit);
};
