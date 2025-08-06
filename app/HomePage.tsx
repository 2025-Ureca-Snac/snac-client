'use client';

import { useWebSocketGuard } from './(shared)/hooks/useWebSocketGuard';

import Banner from './home/banner';

import { ArticleSection } from './home/components/article-section';
import TradingInformationSection from './home/components/TradingInformationSection';
import BlogIntroBanner from './(shared)/components/blog-intro-banner';

export default function HomePage() {
  useWebSocketGuard();

  return (
    <>
      <TradingInformationSection />
      <BlogIntroBanner />
      <Banner />

      <div className="w-full article-section" id="articles">
        <ArticleSection />
      </div>
    </>
  );
}
