'use client';

import { useWebSocketGuard } from './(shared)/hooks/useWebSocketGuard';

import Banner from './home/banner';
import Introduction from './home/components/introduction';
import { ArticleSection } from './home/components/article-section';

export default function HomePage() {
  useWebSocketGuard();

  return (
    <>
      <Banner />
      <Introduction />
      <div className="w-full">
        <ArticleSection />
      </div>
    </>
  );
}
