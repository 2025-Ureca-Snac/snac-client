import Link from 'next/link';

import { BlogPostHeaderProps } from '../types/blog-post';

export default function BlogPostHeader({ title }: BlogPostHeaderProps) {
  return (
    <div className="flex-shrink-0 border-b border-gray-200 px-6 py-4 rounded-t-2xl flex items-center justify-between">
      <h2 className="text-xl font-bold text-gray-900">{title}</h2>
      <Link
        href="/blog"
        className="text-gray-500 hover:text-gray-800 px-2 py-1 text-xs border border-gray-300 rounded transition-colors"
      >
        목록으로
      </Link>
    </div>
  );
}
