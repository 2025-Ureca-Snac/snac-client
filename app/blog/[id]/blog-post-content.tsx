// 내부 라이브러리/유틸리티 임포트 (절대 경로)
import BlogPostHeader from '@/app/(shared)/components/blog-post-header';
import BlogPostMeta from '@/app/(shared)/components/blog-post-meta';
import BlogPostRenderer from '@/app/(shared)/components/blog-post-renderer';
import { BlogPostContentProps } from '@/app/(shared)/types/blog-post';

// 상대 경로 임포트
import { calculateReadingTime } from './utils';

// 서버 컴포넌트로 블로그 포스트 내용 렌더링
export default async function BlogPostContent({ post }: BlogPostContentProps) {
  // 읽기 시간 계산
  const getReadingTime = async () => {
    if (post.markdownContent) {
      const content = await post.markdownContent;
      return calculateReadingTime(content);
    }
    return null;
  };

  const readingTime = await getReadingTime();

  return (
    <div className="max-w-6xl mx-auto bg-white rounded-2xl my-8 shadow-light flex flex-col">
      {/* 헤더 */}
      <BlogPostHeader title={post.title} />

      {/* 본문 */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
        {/* 메타 정보 */}
        <BlogPostMeta post={post} readingTime={readingTime} />

        {/* 콘텐츠 렌더링 */}
        <BlogPostRenderer post={post} />
      </div>
    </div>
  );
}
