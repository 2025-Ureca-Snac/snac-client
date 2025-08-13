'use client';

// import { useState } from 'react';
import { BlogCard } from '@/app/(shared)/components/BlogCard';
// import { BlogTabNavigation } from './BlogTabNavigation';
import { Blog } from '@/app/(shared)/stores/use-blog-store';

interface BlogContentProps {
  posts: Blog[];
  isLoading?: boolean;
  hasNext?: boolean;
  onShowMore?: () => void;
  onPostClick?: (post: Blog) => void;
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
  isLoading,
  hasNext,
  onShowMore,
  onPostClick,
  // onSortChange,
}: BlogContentProps) => {
  // const [activeTab, setActiveTab] = useState<'all' | 'featured'>('all');

  const displayedPosts = posts;
  //.log('BlogContent가 받은 hasNext 값:', hasNext);
  // const handleTabChange = (tab: 'all' | 'featured') => {
  //   setActiveTab(tab);
  // };

  const handlePostClick = (post: Blog) => {
    onPostClick?.(post);
  };

  if (isLoading && posts.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center text-muted-foreground">
          게시글을 불러오는 중입니다...
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* <BlogTabNavigation
        activeTab={activeTab}
        onTabChange={handleTabChange}
        onSortChange={onSortChange}
      /> */}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
        {displayedPosts.map((post) => (
          <BlogCard
            key={post.id}
            post={post}
            onClick={() => handlePostClick(post)}
          />
        ))}
      </div>

      <div className="text-center">
        {hasNext && (
          <button
            onClick={onShowMore}
            disabled={isLoading}
            className="bg-card border-2 border-border text-foreground px-8 py-3 rounded-full font-medium hover:bg-muted transition-colors disabled:bg-muted disabled:cursor-not-allowed"
          >
            {isLoading ? '로딩 중...' : 'Show more'}
          </button>
        )}
      </div>
    </div>
  );
};
