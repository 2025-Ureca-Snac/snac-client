'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MarkdownRenderer } from './MarkdownRenderer';
import { BlogCard } from '@/app/(shared)/components/BlogCard';
import type { Blog } from '@/app/(shared)/stores/use-blog-store';

interface BlogDetailPageProps {
  post: Blog | null;
  relatedPosts?: Blog[];
  onPostSelect?: (post: Blog) => void;
}

export default function BlogDetailPage({
  post,
  relatedPosts = [],
  onPostSelect,
}: BlogDetailPageProps) {
  const [markdownContent, setMarkdownContent] = useState<string>('');
  const [fetching, setFetching] = useState(false);

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

  if (!post) {
    return (
      <div className="p-10 text-center text-gray-500 dark:text-gray-100">
        게시글을 찾을 수 없습니다.
        <div className="mt-8">
          <Link href="/blog" className="text-blue-600 underline">
            목록으로
          </Link>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    if (!post.articleUrl) {
      return (
        <p className="text-gray-700 dark:text-gray-100 ">콘텐츠가 없습니다.</p>
      );
    }

    if (post.articleUrl.match(/\.(jpg|jpeg|png|gif)$/i)) {
      return (
        <div className="relative aspect-video">
          <Image
            src={post.articleUrl}
            alt="업로드 이미지"
            fill
            className="object-contain rounded-lg"
          />
        </div>
      );
    }

    if (fetching) {
      return <p className="text-gray-400">컨텐츠 로딩 중...</p>;
    }

    if (markdownContent) {
      return <MarkdownRenderer content={markdownContent} />;
    }
    return (
      <p className="text-gray-700 dark:text-gray-100">콘텐츠가 없습니다.</p>
    );
  };

  return (
    <div className="max-w-6xl mx-auto bg-white rounded-2xl my-8 shadow-light flex flex-col">
      {/* 헤더 */}
      <div className="flex-shrink-0 border-b border-gray-200 px-6 py-4 rounded-t-2xl flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
          블로그 포스트
        </h2>
        <Link
          href="/blog"
          className="text-gray-500 dark:text-gray-100 hover:text-gray-800 px-2 py-1 text-xs border border-gray-300 rounded transition-colors"
        >
          목록으로
        </Link>
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
        <h1 className="text-3xl font-bold text-gray-900 mb-4 dark:text-gray-100">
          {post.title}
        </h1>

        {/* 메타 정보 */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-500 dark:text-gray-100 mb-8 pb-6 border-b border-gray-200">
          {post.nickname && (
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
              <span>{post.nickname}</span>
            </div>
          )}
        </div>

        {/* 실제 본문 */}
        <div className="prose prose-lg max-w-none">{renderContent()}</div>

        {/* 관련 포스트 */}
        <div className="border-t border-gray-200 pt-8 mt-8">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
            관련 포스트
          </h3>
          {relatedPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {relatedPosts.map((relatedPost: Blog) => (
                <BlogCard
                  key={relatedPost.id}
                  post={relatedPost}
                  variant="detailed"
                  onClick={() => onPostSelect?.(relatedPost)}
                />
              ))}
            </div>
          ) : (
            <p className="text-gray-600 dark:text-gray-100">
              관련된 다른 포스트가 없습니다.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
