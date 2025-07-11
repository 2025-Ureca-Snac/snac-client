'use client';

import { useState } from 'react';
import { BlogCard, BlogPost } from '@/app/(shared)/components/BlogCard';

/**
 * BlogContent 컴포넌트 Props
 */
interface BlogContentProps {
  /** 렌더링할 블로그 포스트 배열 */
  posts: BlogPost[];
  /** 'Show more' 버튼 클릭 시 실행할 콜백 함수 */
  onShowMore?: () => void;
  /** 개별 포스트 클릭 시 실행할 콜백 함수 */
  onPostClick?: (post: BlogPost) => void;
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
}: BlogContentProps) => {
  const [activeTab, setActiveTab] = useState<'all' | 'featured'>('all');

  const filteredPosts =
    activeTab === 'all' ? posts : posts.filter((post) => post.featured);

  const handlePostClick = (post: BlogPost) => {
    onPostClick?.(post);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* 탭 네비게이션 */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex space-x-8">
          <button
            onClick={() => setActiveTab('all')}
            className={`text-lg font-medium pb-2 border-b-2 transition-colors ${
              activeTab === 'all'
                ? 'text-gray-800 border-gray-800'
                : 'text-gray-500 border-transparent hover:text-gray-700'
            }`}
          >
            모든글
          </button>
          <button
            onClick={() => setActiveTab('featured')}
            className={`text-lg font-medium pb-2 border-b-2 transition-colors ${
              activeTab === 'featured'
                ? 'text-gray-800 border-gray-800'
                : 'text-gray-500 border-transparent hover:text-gray-700'
            }`}
          >
            Featured
          </button>
        </div>

        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-500">Sort by</span>
          <select className="border border-gray-300 rounded-lg px-3 py-1 text-sm">
            <option>최신순</option>
            <option>인기순</option>
            <option>조회순</option>
          </select>
        </div>
      </div>

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
