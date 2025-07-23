'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Footer } from '@/app/(shared)/components/Footer';
import { Header } from '@/app/(shared)/components/Header';
import { BlogHero } from '../components/BlogHero';
import { BlogContent } from '../components/BlogContent';
import { BlogDetailModal } from '../components/BlogDetailModal';
import { BLOG_POSTS, ExtendedBlogPost } from '../data/blogPosts';

interface BlogPostPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const router = useRouter();
  const [selectedPost, setSelectedPost] = useState<ExtendedBlogPost | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadPost = async () => {
      try {
        const { id } = await params;
        const postId = parseInt(id);
        const post = BLOG_POSTS.find((p) => p.id === postId);

        if (post) {
          setSelectedPost(post);
          setIsModalOpen(true);
        } else {
          // 해당 ID의 포스트가 없으면 메인 블로그 페이지로 리다이렉트
          router.replace('/blog');
        }
      } catch (error) {
        console.error('Error loading post:', error);
        router.replace('/blog');
      } finally {
        setIsLoading(false);
      }
    };

    loadPost();
  }, [params, router]);

  const handleShowMore = () => {
    console.log('Show more clicked!');
    // 여기에 더 많은 포스트를 로드하는 로직 추가
  };

  const handleSortChange = (sortBy: string) => {
    console.log('Sort changed to:', sortBy);
    // 여기에 정렬 로직 추가
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPost(null);
    // 모달을 닫으면 메인 블로그 페이지로 이동
    router.push('/blog');
  };

  const handlePostClick = (post: ExtendedBlogPost) => {
    // 다른 포스트 클릭 시 해당 포스트 페이지로 이동
    router.push(`/blog/${post.id}`);
  };

  const handlePostSelect = (post: ExtendedBlogPost) => {
    // 관련 포스트에서 다른 포스트 선택 시
    router.push(`/blog/${post.id}`);
  };

  // 로딩 중일 때는 기본 레이아웃만 보여줌
  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Header />
        <BlogHero />
        <BlogContent
          posts={BLOG_POSTS}
          onShowMore={handleShowMore}
          onSortChange={handleSortChange}
          onPostClick={handlePostClick}
        />
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      <BlogHero />
      <BlogContent
        posts={BLOG_POSTS}
        onShowMore={handleShowMore}
        onSortChange={handleSortChange}
        onPostClick={handlePostClick}
      />
      <Footer />

      {/* 블로그 상세 모달 */}
      <BlogDetailModal
        post={selectedPost}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onPostSelect={handlePostSelect}
      />
    </div>
  );
}
