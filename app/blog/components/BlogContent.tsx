'use client';

import { useState } from 'react';
import { BlogCard } from '@/app/(shared)/components/BlogCard';
import { BlogTabNavigation } from './BlogTabNavigation';
import { ExtendedBlogPost } from '../data/blogPosts';

interface BlogContentProps {
  posts: ExtendedBlogPost[];
  onShowMore?: () => void;
  onPostClick?: (post: ExtendedBlogPost) => void;
  onSortChange?: (sortBy: string) => void;
}

/**
 * 블로그 메인 콘텐츠 컴포넌트
 * 탭 네비게이션, 블로그 카드 그리드, Show more 버튼을 포함
 *
 * @param props - BlogContent 컴포넌트 props
 * @returns 블로그 메인 콘텐츠 JSX 엘리먼트
 */
export const BlogContent = ({
  posts,
  onShowMore,
  onPostClick,
  onSortChange,
}: BlogContentProps) => {
  const [activeTab, setActiveTab] = useState<'all' | 'featured'>('all');

  const filteredPosts =
    activeTab === 'all' ? posts : posts.filter((post) => post.featured);

  const handleTabChange = (tab: 'all' | 'featured') => {
    setActiveTab(tab);
  };

  const handlePostClick = (post: ExtendedBlogPost) => {
    // 모달 대신 바로 라우터 이동
    onPostClick?.(post);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* 탭 네비게이션 */}
      <BlogTabNavigation
        activeTab={activeTab}
        onTabChange={handleTabChange}
        onSortChange={onSortChange}
      />

      {/* 블로그 카드 그리드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
        {filteredPosts.map((post) => (
          <BlogCard
            key={post.id}
            post={post}
            onClick={() => handlePostClick(post)}
          />
        ))}
      </div>

      {/* Show more 버튼 */}
      <div className="text-center">
        <button
          onClick={onShowMore}
          className="bg-white border-2 border-gray-300 text-gray-700 px-8 py-3 rounded-full font-medium hover:bg-gray-50 transition-colors"
        >
          Show more
        </button>
      </div>
    </div>
  );
};
