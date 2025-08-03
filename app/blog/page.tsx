// 내부 라이브러리/유틸리티 임포트 (절대 경로)
import { blogPageMetadata } from './metadata';

// 상대 경로 임포트
import { BlogHero } from './components/BlogHero';
import BlogPageClient from './BlogPageClient';
import BlogStructuredData from './components/BlogStructuredData';

export const metadata = blogPageMetadata;

export default function BlogPage() {
  return (
    <>
      <BlogStructuredData />
      <div className="min-h-screen">
        <BlogHero />
        <BlogPageClient />
      </div>
    </>
  );
}
