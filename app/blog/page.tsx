'use client';

import { useRouter } from 'next/navigation';
import { Footer } from '@/app/(shared)/components/Footer';
import { Header } from '@/app/(shared)/components/Header';
import { BlogHero } from './components/BlogHero';
import { BlogContent } from './components/BlogContent';
import { BLOG_POSTS, ExtendedBlogPost } from './data/blogPosts';

export default function BlogPage() {
  const router = useRouter();

  const handleShowMore = () => {
    console.log('Show more clicked!');
    // 여기에 더 많은 포스트를 로드하는 로직 추가
  };

  const handleSortChange = (sortBy: string) => {
    console.log('Sort changed to:', sortBy);
    // 여기에 정렬 로직 추가
  };

  const handlePostClick = (post: ExtendedBlogPost) => {
    // 포스트 클릭 시 동적 라우트로 이동
    router.push(`/blog/${post.id}`);
  };

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
