'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
        <div className="bg-white rounded-2xl p-6 shadow-light">
          <h3 className="text-xl font-bold text-gray-900 mb-6">관련 포스트</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedBlogs.map((post) => (
              <div
                key={post.id}
                onClick={() => handlePostClick(post)}
                className="cursor-pointer hover:shadow-md transition-shadow"
              >
                <BlogCard post={post} />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // 관련 포스트가 없으면 아무것도 렌더링하지 않음
  return null;
}
