'use client';

import { useEffect, useState } from 'react';
import ModalPortal from '@/app/(shared)/components/modal-portal';
import Image from 'next/image';
import { MarkdownRenderer } from '../../blog/components/MarkdownRenderer';

import { useBlogStore } from '@/app/(shared)/stores/use-blog-store';
import { BlogCard } from '@/app/(shared)/components/BlogCard';
import type { Blog } from '@/app/(shared)/stores/use-blog-store';

interface BlogDetailModalProps {
  post: Blog | null;
  isOpen: boolean;
  onClose: () => void;
  onPostSelect?: (post: Blog) => void;
}

export const BlogDetailModal = ({
  post,
  isOpen,
  onClose,
  onPostSelect,
}: BlogDetailModalProps) => {
  // 전체 블로그 목록 (관련 포스트용)
  const blogs = useBlogStore((state) => state.blogs);

  // 마크다운 컨텐츠 상태
  const [markdownContent, setMarkdownContent] = useState<string>('');
  const [fetching, setFetching] = useState(false);

  // 마크다운, 텍스트 파일 fetch (이미지 파일이 아니면)
  useEffect(() => {
    if (post?.articleUrl && !post.articleUrl.match(/\.(jpg|jpeg|png|gif)$/i)) {
      setFetching(true);
      fetch(post.articleUrl)
        .then((res) => res.text())
        .then((text) => {
          setMarkdownContent(text);
          setFetching(false);
        })
        .catch(() => {
          setMarkdownContent('콘텐츠를 불러오는 데 실패했습니다.');
          setFetching(false);
        });
    } else {
      setMarkdownContent('');
    }
  }, [post?.articleUrl]);

  if (!post) return null;

  // 관련 포스트(같은 닉네임일때만
  const relatedPosts = blogs
    .filter(
      (p) =>
        p.id !== post.id &&
        p.nickname &&
        post.nickname &&
        p.nickname === post.nickname
    )
    .slice(0, 3);

  const renderContent = () => {
    if (!post.articleUrl) {
      return (
        <p className="text-muted-foreground">콘텐츠가 없습니다.</p>
      );
    }

    if (post.articleUrl.match(/\.(jpg|jpeg|png|gif)$/i)) {
      return (
        <Image
          src={post.articleUrl}
          alt="업로드 이미지"
          width={400}
          height={300}
          className="rounded-lg"
        />
      );
    }

    if (fetching) {
      return (
        <p className="text-muted-foreground">컨텐츠 로딩 중...</p>
      );
    }

    return <MarkdownRenderer content={markdownContent} />;
  };

  return (
    <ModalPortal isOpen={isOpen} onClose={onClose}>
      {/* 배경 오버레이 */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* 모달 컨텐츠 */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-card rounded-2xl max-w-4xl w-full max-h-[90vh] shadow-light flex flex-col">
          {/* 헤더 */}
          <div className="flex-shrink-0 bg-card border-b border-border px-6 py-4 rounded-t-2xl">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-card-foreground">
                블로그 포스트
              </h2>
              <button
                onClick={onClose}
                className="text-muted-foreground hover:text-muted-foreground:text-primary-foreground transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* 본문 */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
            {/* 썸네일 이미지 */}
            {post.imageUrl && (
              <div className="relative h-64 mb-6 rounded-lg overflow-hidden">
                <Image
                  src={post.imageUrl}
                  alt={post.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            )}

            {/* 제목 */}
            <h1 className="text-regular-3xl font-bold text-card-foreground mb-4">
              {post.title}
            </h1>

            {/* 메타 정보 */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-regular-sm text-muted-foreground mb-8 pb-6 border-b border-border">
              {post.nickname && (
                <div className="flex items-center gap-2">
                  {/* 작성자 아이콘 */}
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  <span>{post.nickname}</span>
                </div>
              )}
            </div>

            {/* 실제 본문 (마크다운 or 이미지) 
              MarkdownRenderer는 자체적으로 다크모드를 처리하므로 이 부분은 수정하지 않습니다.
            */}
            <div className="prose prose-lg max-w-none">
              {renderContent()}
            </div>

            {/* 관련 포스트 */}
            <div className="border-t border-border pt-8 mt-8">
              <h3 className="text-regular-xl font-semibold text-card-foreground mb-4">
                관련 포스트
              </h3>

              {relatedPosts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {relatedPosts.map((relatedPost: Blog) => (
                    <BlogCard
                      key={relatedPost.id}
                      post={relatedPost}
                      variant="detailed"
                      showAuthor={true}
                      showReadTime={true}
                      showCategory={true}
                      onClick={() => {
                        onPostSelect?.(relatedPost);
                      }}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">
                  관련된 다른 포스트가 없습니다.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </ModalPortal>
  );
};
