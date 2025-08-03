'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Footer } from '@/app/(shared)/components/Footer';
import { Header } from '@/app/(shared)/components/Header';
import BlogDetailPage from '../components/BlogDetailPage';
import { useBlogStore, Blog } from '@/app/(shared)/stores/use-blog-store';

interface BlogPostPageClientProps {
  id: string;
}

export default function BlogPostPageClient({ id }: BlogPostPageClientProps) {
  const router = useRouter();

  const {
    currentBlog,
    relatedBlogs,
    loading,
    error,
    fetchOne,
    fetchRelated,
    clearCurrentBlog,
  } = useBlogStore();

  useEffect(() => {
    const postId = parseInt(id, 10);
    if (!isNaN(postId)) {
      fetchOne(postId);
      fetchRelated(postId);
    }

    return () => {
      clearCurrentBlog();
    };
  }, [id, fetchOne, fetchRelated, clearCurrentBlog]);

  const handlePostClick = (post: Blog) => {
    router.push(`/blog/${post.id}`);
  };

  if (loading && !currentBlog) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>게시글을 불러오는 중...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl font-semibold text-red-500">
            오류가 발생했습니다
          </p>
          <p className="text-gray-600 mt-2">{error}</p>
          <button
            onClick={() => router.push('/blog')}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            블로그 홈으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />

      <BlogDetailPage
        post={currentBlog}
        relatedPosts={relatedBlogs}
        onPostSelect={handlePostClick}
      />

      <Footer />
    </div>
  );
}
