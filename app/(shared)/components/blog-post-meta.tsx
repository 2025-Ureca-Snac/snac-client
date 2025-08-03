import BlogPostThumbnail from './blog-post-thumbnail';
import BlogPostTitle from './blog-post-title';
import BlogPostInfo from './blog-post-info';
import { BlogPostMetaProps } from '../types/blog-post';

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
