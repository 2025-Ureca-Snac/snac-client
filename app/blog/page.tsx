'use client';

import { useRouter } from 'next/navigation';
import { Footer } from '@/app/(shared)/components/Footer';
import { Header } from '@/app/(shared)/components/Header';
import { BlogPost } from '@/app/(shared)/components/BlogCard';
import { BlogHero } from './components/BlogHero';
import { BlogContent } from './components/BlogContent';
import { BLOG_POSTS } from './data/blogPosts';

export default function BlogPage() {
  const router = useRouter();

  const handleShowMore = () => {
    console.log('Show more clicked!');
    // 여기에 더 많은 포스트를 로드하는 로직 추가
  };

  const handlePostClick = (post: BlogPost) => {
    console.log('Post clicked:', post.title);
    // 개별 포스트 페이지로 이동
    router.push(`/blog/${post.id}`);
  };

  const handleSortChange = (sortBy: string) => {
    console.log('Sort changed to:', sortBy);
    // 여기에 정렬 로직 추가
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <BlogHero />
      <BlogContent
        posts={BLOG_POSTS}
        onShowMore={handleShowMore}
        onPostClick={handlePostClick}
        onSortChange={handleSortChange}
      />
      <Footer />
    </div>
  );
}
