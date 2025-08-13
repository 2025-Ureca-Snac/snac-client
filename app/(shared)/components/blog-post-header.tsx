// React 관련 임포트
import Link from 'next/link';

// 내부 라이브러리/유틸리티 임포트 (절대 경로)
import { BlogPostHeaderProps } from '../types/blog-post';

export default function BlogPostHeader({ title }: BlogPostHeaderProps) {
  return (
    <div className="flex-shrink-0 border-b border-border px-6 py-4 rounded-t-2xl flex items-center justify-between">
      <h2 className="text-xl font-bold text-card-foreground">
        {title}
      </h2>
      <Link
        href="/blog"
        className="text-muted-foreground hover:text-foreground px-2 py-1 text-xs border border-border rounded transition-colors"
      >
        목록으로
      </Link>
    </div>
  );
}
