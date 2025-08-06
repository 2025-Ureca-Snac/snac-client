'use client';

import { useWebSocketGuard } from './(shared)/hooks/useWebSocketGuard';

import Banner from './home/banner';

import { ArticleSection } from './home/components/article-section';
import TradingInformationSection from './home/components/TradingInformationSection';

export default function HomePage() {
  useWebSocketGuard();

  return (
    <>
      <TradingInformationSection />
      <Banner />

      <div className="w-full">
        <ArticleSection />
      </div>
    </>
  );
}
