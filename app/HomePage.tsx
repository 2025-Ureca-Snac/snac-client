'use client';

import { useWebSocketGuard } from './(shared)/hooks/useWebSocketGuard';

import Banner from './home/banner';

import { ArticleSection } from './home/components/article-section';
import BlogIntroBanner from './(shared)/components/blog-intro-banner';

export default function HomePage() {
  useWebSocketGuard();

  return (
    <>
      <BlogIntroBanner />
      <Banner />

      <div className="w-full article-section" id="articles">
        <ArticleSection />
      </div>
    </>
  );
}
