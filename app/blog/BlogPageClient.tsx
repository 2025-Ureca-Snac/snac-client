'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useBlogStore } from '@/app/(shared)/stores/use-blog-store';
import { BlogContent } from './components/BlogContent';
import { Blog } from '@/app/(shared)/stores/use-blog-store';

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

  const handleSortChange = (sortBy: string) => {
    console.log('Sort changed to:', sortBy);
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
