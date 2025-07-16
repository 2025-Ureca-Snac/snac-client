'use client';

import ModalPortal from '@/app/(shared)/components/modal-portal';
import Image from 'next/image';
import { MarkdownRenderer } from './MarkdownRenderer';
import { ExtendedBlogPost, BLOG_POSTS } from '../data/blogPosts';
import { BlogCard } from '@/app/(shared)/components/BlogCard';

interface BlogDetailModalProps {
  post: ExtendedBlogPost | null;
  isOpen: boolean;
  onClose: () => void;
  onPostSelect?: (post: ExtendedBlogPost) => void;
}

/**
 * 블로그 포스트 상세 모달 컴포넌트
 *
 * @param props - BlogDetailModal 컴포넌트 props
 * @returns 블로그 상세 모달 JSX 엘리먼트
 */
export const BlogDetailModal = ({
  post,
  isOpen,
  onClose,
  onPostSelect,
}: BlogDetailModalProps) => {
  if (!post) return null;

  return (
    <ModalPortal isOpen={isOpen} onClose={onClose}>
      {/* 배경 오버레이 */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* 모달 컨텐츠 */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] shadow-2xl flex flex-col">
          {/* 헤더 */}
          <div className="flex-shrink-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">블로그 포스트</h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
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

          {/* 컨텐츠 */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
            {/* 이미지 */}
            <div className="relative h-64 mb-6 rounded-lg overflow-hidden">
              <Image
                src={post.image}
                alt={post.title}
                fill
                className="object-cover"
                priority
              />

              {/* 추천 배지 */}
              {post.featured && (
                <div className="absolute top-4 right-4">
                  <span className="bg-yellow-500 text-white text-sm px-3 py-1 rounded-full font-medium">
                    추천
                  </span>
                </div>
              )}
            </div>

            {/* 제목 */}
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {post.title}
            </h1>

            {/* 부제목 */}
            <p className="text-lg text-gray-600 mb-6">{post.subtitle}</p>

            {/* 메타 정보 */}
            <div className="flex items-center gap-4 text-sm text-gray-500 mb-8 pb-6 border-b border-gray-200">
              {post.author && (
                <div className="flex items-center gap-2">
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
                  <span>{post.author}</span>
                </div>
              )}
              {post.readTime && (
                <div className="flex items-center gap-2">
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
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>{post.readTime}</span>
                </div>
              )}
              {post.category && (
                <div className="flex items-center gap-2">
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
                      d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                    />
                  </svg>
                  <span>{post.category}</span>
                </div>
              )}
            </div>

            {/* 블로그 포스트 컨텐츠 */}
            <div className="prose prose-lg max-w-none">
              {post.markdownContent ? (
                <MarkdownRenderer
                  content={post.markdownContent}
                  images={post.images}
                  imagePositions={post.imagePositions}
                />
              ) : post.content ? (
                <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {post.content}
                </div>
              ) : (
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                    포스트 상세 내용
                  </h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    이곳에는 실제 블로그 포스트의 상세 내용이 들어갑니다. 현재는
                    임시 콘텐츠로 표시되고 있습니다.
                  </p>
                </div>
              )}
            </div>

            {/* 관련 포스트 섹션 */}
            <div className="border-t border-gray-200 pt-8 mt-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                관련 포스트
              </h3>
              {(() => {
                const relatedPosts = BLOG_POSTS.filter(
                  (p: ExtendedBlogPost) =>
                    p.id !== post.id && p.category === post.category
                ).slice(0, 3);

                return relatedPosts.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {relatedPosts.map((relatedPost: ExtendedBlogPost) => (
                      <BlogCard
                        key={relatedPost.id}
                        post={relatedPost}
                        variant="detailed"
                        showAuthor={true}
                        showReadTime={true}
                        showCategory={true}
                        onClick={() => {
                          // 새로운 포스트 선택
                          onPostSelect?.(relatedPost);
                        }}
                      />
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600">
                    관련된 다른 포스트가 없습니다.
                  </p>
                );
              })()}
            </div>
          </div>

          {/* 푸터 */}
          <div className="flex-shrink-0 bg-white border-t border-gray-200 px-6 py-4 rounded-b-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4"></div>
              <button
                onClick={onClose}
                className="bg-gray-900 text-white px-6 py-2 rounded-xl hover:bg-gray-800 transition-colors"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      </div>
    </ModalPortal>
  );
};
