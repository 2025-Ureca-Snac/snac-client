'use client';

// React 관련 임포트
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// 내부 라이브러리/유틸리티 임포트 (절대 경로)
import { useBlogStore, Blog } from '@/app/(shared)/stores/use-blog-store';

// 상대 경로 임포트
import { BlogContent } from './components/BlogContent';

export default function BlogPageClient() {
  const router = useRouter();

  const { blogs, loading, hasNext, fetchAll, fetchMore } = useBlogStore();

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const handleShowMore = () => {
    if (hasNext && !loading) {
      fetchMore();
    }
  };

  const handleSortChange = () => {
    // 추후 정렬 로직 구현
  };

  const handlePostClick = (post: Blog) => {
    router.push(`/blog/${post.id}`);
  };

  return (
    <BlogContent
      posts={blogs}
      isLoading={loading}
      hasNext={hasNext}
      onShowMore={handleShowMore}
      onSortChange={handleSortChange}
      onPostClick={handlePostClick}
    />
  );
}
