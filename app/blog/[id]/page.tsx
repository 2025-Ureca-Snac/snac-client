'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Footer } from '@/app/(shared)/components/Footer';
import { Header } from '@/app/(shared)/components/Header';
import { ExtendedBlogPost, BLOG_POSTS } from '../data/blogPosts';
import { getPostById } from '../utils/blogUtils';
import Image from 'next/image';

export default function BlogPostPage() {
  const params = useParams();
  const router = useRouter();
  const [post, setPost] = useState<ExtendedBlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const postId = Number(params.id);

    if (isNaN(postId)) {
      router.push('/blog');
      return;
    }

    const foundPost = getPostById(postId);
    if (!foundPost) {
      router.push('/blog');
      return;
    }

    setPost(foundPost);
    setLoading(false);
  }, [params.id, router]);

  const handleBackToBlog = () => {
    router.push('/blog');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg">로딩 중...</div>
      </div>
    );
  }

  if (!post) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* 메인 콘텐츠 */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* 뒤로가기 버튼 */}
        <button
          onClick={handleBackToBlog}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6 transition-colors"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          블로그 목록으로 돌아가기
        </button>

        {/* 포스트 헤더 */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
          <div className="relative h-96">
            <Image
              src={post.image}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
          </div>

          <div className="p-8">
            <div className="flex items-center gap-2 mb-4">
              {post.featured && (
                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                  추천
                </span>
              )}
              {post.category && (
                <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded">
                  {post.category}
                </span>
              )}
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {post.title}
            </h1>

            <div className="flex items-center gap-6 text-sm text-gray-500 mb-4">
              {post.author && (
                <span className="flex items-center gap-1">
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
                  {post.author}
                </span>
              )}
              {post.publishDate && (
                <span className="flex items-center gap-1">
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
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  {new Date(post.publishDate).toLocaleDateString('ko-KR')}
                </span>
              )}
              {post.readTime && (
                <span className="flex items-center gap-1">
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
                  {post.readTime}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* 포스트 콘텐츠 */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="prose max-w-none">
            {post.content ? (
              <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                {post.content}
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                  포스트 상세 내용
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  이곳에는 실제 블로그 포스트의 상세 내용이 들어갑니다. 현재는
                  임시 콘텐츠로 표시되고 있습니다.
                </p>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco
                  laboris nisi ut aliquip ex ea commodo consequat.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  Duis aute irure dolor in reprehenderit in voluptate velit esse
                  cillum dolore eu fugiat nulla pariatur. Excepteur sint
                  occaecat cupidatat non proident, sunt in culpa qui officia
                  deserunt mollit anim id est laborum.
                </p>
              </>
            )}
          </div>
        </div>

        {/* 관련 포스트 섹션 */}
        <div className="bg-white rounded-lg shadow-lg p-8 mt-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            관련 포스트
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {BLOG_POSTS.filter(
              (p: ExtendedBlogPost) =>
                p.id !== post.id && p.category === post.category
            )
              .slice(0, 3)
              .map((relatedPost: ExtendedBlogPost) => (
                <div
                  key={relatedPost.id}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => router.push(`/blog/${relatedPost.id}`)}
                >
                  <div className="relative h-32 mb-3">
                    <Image
                      src={relatedPost.image}
                      alt={relatedPost.title}
                      fill
                      className="object-cover rounded"
                    />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                    {relatedPost.title}
                  </h4>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    {relatedPost.author && <span>{relatedPost.author}</span>}
                    {relatedPost.readTime && (
                      <span>• {relatedPost.readTime}</span>
                    )}
                  </div>
                </div>
              ))}
          </div>
          {BLOG_POSTS.filter(
            (p: ExtendedBlogPost) =>
              p.id !== post.id && p.category === post.category
          ).length === 0 && (
            <p className="text-gray-600">관련된 다른 포스트가 없습니다.</p>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
