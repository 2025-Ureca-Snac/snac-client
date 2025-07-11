'use client';

import { Footer } from '@/app/(shared)/components/Footer';
import { Header } from '@/app/(shared)/components/Header';
import { BlogPost } from '@/app/(shared)/components/BlogCard';
import { BlogHero } from './components/BlogHero';
import { BlogContent } from './components/BlogContent';
import { blogPosts } from './data/blogPosts';

export default function BlogPage() {
  const handleShowMore = () => {
    console.log('Show more clicked!');
    // 여기에 더 많은 포스트를 로드하는 로직 추가
  };

  const handlePostClick = (post: BlogPost) => {
    console.log('Post clicked:', post.title);
    // 여기에 개별 포스트 페이지로 이동하는 로직 추가
    // 예: router.push(`/blog/${post.id}`)
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <BlogHero />
      <BlogContent
        posts={blogPosts}
        onShowMore={handleShowMore}
        onPostClick={handlePostClick}
      />
      <Footer />
    </div>
  );
}
