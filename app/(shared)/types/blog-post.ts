import { ExtendedBlogPost } from '../../blog/data/blogPosts';

// 블로그 포스트 헤더 관련 타입
export interface BlogPostHeaderProps {
  title: string;
}

// 블로그 포스트 썸네일 관련 타입
export interface BlogPostThumbnailProps {
  imageUrl: string;
  title: string;
}

// 블로그 포스트 제목 관련 타입
export interface BlogPostTitleProps {
  title: string;
}

// 블로그 포스트 메타 정보 관련 타입
export interface BlogPostInfoProps {
  post: ExtendedBlogPost;
  readingTime: number | null;
}

// 블로그 포스트 메타 관련 타입
export interface BlogPostMetaProps {
  post: ExtendedBlogPost;
  readingTime: number | null;
}

// 블로그 포스트 렌더러 관련 타입
export interface BlogPostRendererProps {
  post: ExtendedBlogPost;
}

// 블로그 포스트 TOC 관련 타입
export interface TableOfContentsItem {
  id: string;
  text: string;
  level: number;
}

export interface BlogPostTOCProps {
  tableOfContents: TableOfContentsItem[];
}

// 블로그 포스트 콘텐츠 관련 타입
export interface BlogPostContentProps {
  post: ExtendedBlogPost;
}
