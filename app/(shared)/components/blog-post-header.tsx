// React 관련 임포트
import Link from 'next/link';

// 내부 라이브러리/유틸리티 임포트 (절대 경로)
import { BlogPostHeaderProps } from '../types/blog-post';

export default function BlogPostHeader({ title }: BlogPostHeaderProps) {
  return (
    <div className="flex-shrink-0 border-b border-gray-200 dark:border-gray-700 px-6 py-4 rounded-t-2xl flex items-center justify-between">
      <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
        {title}
      </h2>
      <Link
        href="/blog"
        className="text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-100 px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded transition-colors"
      >
        목록으로
      </Link>
    </div>
  );
}
