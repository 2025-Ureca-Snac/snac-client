// 내부 라이브러리/유틸리티 임포트 (절대 경로)
import { BlogPostMetaProps } from '../types/blog-post';

// 상대 경로 임포트
import BlogPostThumbnail from './blog-post-thumbnail';
import BlogPostTitle from './blog-post-title';
import BlogPostInfo from './blog-post-info';

export default function BlogPostMeta({ post, readingTime }: BlogPostMetaProps) {
  return (
    <>
      {/* 썸네일 이미지 */}
      {post.imageUrl && (
        <BlogPostThumbnail imageUrl={post.imageUrl} title={post.title} />
      )}

      {/* 제목 */}
      <BlogPostTitle title={post.title} />

      {/* 메타 정보 */}
      <BlogPostInfo post={post} readingTime={readingTime} />
    </>
  );
}
