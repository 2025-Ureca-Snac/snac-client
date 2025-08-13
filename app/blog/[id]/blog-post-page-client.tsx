'use client';

// React 관련 임포트
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// 내부 라이브러리/유틸리티 임포트 (절대 경로)
import { BlogCard } from '@/app/(shared)/components/BlogCard';
import { useBlogStore, Blog } from '@/app/(shared)/stores/use-blog-store';

interface BlogPostPageClientProps {
  id: string;
}

export default function BlogPostPageClient({ id }: BlogPostPageClientProps) {
  const router = useRouter();

  const { relatedBlogs, fetchRelated, clearCurrentBlog } = useBlogStore();

  useEffect(() => {
    const postId = parseInt(id, 10);
    if (!isNaN(postId)) {
      fetchRelated(postId);
    }

    return () => {
      clearCurrentBlog();
    };
  }, [id, fetchRelated, clearCurrentBlog]);

  const handlePostClick = (post: Blog) => {
    router.push(`/blog/${post.id}`);
  };

  // 관련 포스트가 있을 때만 렌더링
  if (relatedBlogs && relatedBlogs.length > 0) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="bg-card rounded-2xl p-6 shadow-light">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-card-foreground mb-2">
              관련 포스트
            </h3>
            <p className="text-muted-foreground">
              더 많은 유용한 정보를 확인해보세요
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedBlogs.map((post) => (
              <div
                key={post.id}
                onClick={() => handlePostClick(post)}
                className="cursor-pointer hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
              >
                <BlogCard post={post} />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  return null;
}
