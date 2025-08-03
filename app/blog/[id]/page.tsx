import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { marked } from 'marked';
import BlogPostPageClient from './blog-post-page-client';
import BlogStructuredData from '../components/BlogStructuredData';
import { generateBlogPostMetadata } from '../metadata';
import { ExtendedBlogPost } from '../data/blogPosts';
import api from '@/app/(shared)/utils/api';
import { Header } from '@/app/(shared)/components/Header';
import { Footer } from '@/app/(shared)/components/Footer';

// 읽기 시간 계산 함수
function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200; // 한국어 기준 분당 읽는 단어 수
  const wordCount = content.trim().split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
}

// 목차 생성 함수
function generateTableOfContents(
  content: string
): Array<{ id: string; text: string; level: number }> {
  const headings = content.match(/^(#{1,6})\s+(.+)$/gm);
  if (!headings) return [];

  return headings.map((heading, index) => {
    const level = heading.match(/^(#{1,6})/)?.[0].length || 1;
    const text = heading.replace(/^(#{1,6})\s+/, '');
    const id = `heading-${index}`;
    return { id, text, level };
  });
}

// 데이터를 가져오는 함수
async function getPost(id: string): Promise<ExtendedBlogPost | null> {
  try {
    const response = await api.get(`/articles/${id}`);
    console.log('API 응답:', response.data);
    const post = (response.data as { data: ExtendedBlogPost }).data;
    console.log('블로그 포스트 데이터:', post);

    // articleUrl에서 콘텐츠 가져오기
    if (post.articleUrl && !post.articleUrl.match(/\.(jpg|jpeg|png|gif)$/i)) {
      try {
        const contentResponse = await fetch(post.articleUrl);
        if (contentResponse.ok) {
          const content = await contentResponse.text();
          post.markdownContent = content;
          console.log(
            '마크다운 콘텐츠 로드 완료:',
            content.substring(0, 100) + '...'
          );
        }
      } catch (error) {
        console.error('콘텐츠 로드 실패:', error);
      }
    }

    return post;
  } catch (error) {
    console.error('Failed to fetch post:', error);
    return null;
  }
}

// Props 인터페이스
interface Props {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

// generateMetadata 함수 - SEO 최적화
export async function generateMetadata({
  params,
  searchParams,
}: Props): Promise<Metadata> {
  const { id } = await params;
  await searchParams; // searchParams도 비동기로 처리
  const post = await getPost(id);

  if (!post) {
    return {
      title: '포스트를 찾을 수 없습니다 | 스낵 블로그',
      description: '요청하신 블로그 포스트를 찾을 수 없습니다.',
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  return generateBlogPostMetadata(post);
}

// 서버 컴포넌트로 블로그 포스트 내용 렌더링
async function BlogPostContent({ post }: { post: ExtendedBlogPost }) {
  // 읽기 시간 계산
  const getReadingTime = async () => {
    if (post.markdownContent) {
      const content = await post.markdownContent;
      return calculateReadingTime(content);
    }
    return null;
  };

  const readingTime = await getReadingTime();

  // 목차 생성
  const getTableOfContents = async () => {
    if (post.markdownContent) {
      const content = await post.markdownContent;
      return generateTableOfContents(content);
    }
    return [];
  };

  const tableOfContents = await getTableOfContents();

  // 콘텐츠를 단락으로 분리하고 이미지 삽입
  const renderContentWithImages = async () => {
    // 마크다운 콘텐츠가 있으면 우선 처리
    if (post.markdownContent) {
      const content = await post.markdownContent;
      try {
        const htmlContent = marked(content, {
          breaks: true, // 줄바꿈을 <br>로 변환
          gfm: true, // GitHub Flavored Markdown 지원
        });
        return (
          <div
            className="text-gray-700 leading-relaxed prose prose-lg max-w-none [&>h1]:text-4xl [&>h1]:font-bold [&>h1]:mb-6 [&>h1]:text-gray-900 [&>h2]:text-3xl [&>h2]:font-bold [&>h2]:mb-4 [&>h2]:text-gray-900 [&>h3]:text-2xl [&>h3]:font-bold [&>h3]:mb-3 [&>h3]:text-gray-900 [&>h4]:text-xl [&>h4]:font-semibold [&>h4]:mb-2 [&>h4]:text-gray-900 [&>p]:mb-4 [&>p]:leading-7 [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:mb-4 [&>ol]:list-decimal [&>ol]:pl-6 [&>ol]:mb-4 [&>li]:mb-2 [&>li]:leading-6 [&>strong]:font-bold [&>strong]:text-gray-900 [&>em]:italic [&>code]:bg-gray-100 [&>code]:px-2 [&>code]:py-1 [&>code]:rounded [&>code]:text-sm [&>code]:font-mono [&>pre]:bg-gray-100 [&>pre]:p-4 [&>pre]:rounded-lg [&>pre]:overflow-x-auto [&>pre]:mb-4 [&>hr]:my-8 [&>hr]:border-gray-300 [&>blockquote]:border-l-4 [&>blockquote]:border-blue-500 [&>blockquote]:pl-4 [&>blockquote]:italic [&>blockquote]:text-gray-600 [&>blockquote]:bg-blue-50 [&>blockquote]:py-2 [&>blockquote]:rounded-r [&>a]:text-blue-600 [&>a]:underline [&>a]:hover:text-blue-800 [&>a]:transition-colors [&>a]:duration-200 [&>table]:w-full [&>table]:border-collapse [&>table]:mb-4 [&>th]:border [&>th]:border-gray-300 [&>th]:px-4 [&>th]:py-2 [&>th]:bg-gray-100 [&>th]:font-bold [&>td]:border [&>td]:border-gray-300 [&>td]:px-4 [&>td]:py-2 [&>img]:w-full [&>img]:h-auto [&>img]:rounded-lg [&>img]:shadow-md [&>img]:my-4 [&>img]:max-w-full [&>img]:object-contain"
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />
        );
      } catch (error) {
        console.error('마크다운 변환 실패:', error);
        return (
          <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
            {content}
          </div>
        );
      }
    }

    // API에서 실제로 사용하는 속성들 확인
    if (!post.content && !post.articleUrl && !post.contentFileUrl) {
      return (
        <div className="text-gray-700 leading-relaxed">
          <p>콘텐츠를 불러오는 중...</p>
        </div>
      );
    }

    // 기존 content가 있으면 사용
    if (post.content) {
      const content = post.content;

      if (!post.images || post.images.length === 0 || !post.imagePositions) {
        // 이미지가 없으면 일반 렌더링
        if (post.content) {
          return (
            <div
              className="text-gray-700 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          );
        } else {
          const markdownContent = post.markdownContent
            ? await post.markdownContent
            : '';
          return (
            <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {markdownContent}
            </div>
          );
        }
      }

      // 이미지가 있는 경우 단락 사이에 삽입
      const elements: React.ReactElement[] = [];
      const paragraphs = content.split('\n\n').filter((p) => p.trim());

      for (let i = 0; i < paragraphs.length; i++) {
        const paragraph = paragraphs[i];
        // 단락 추가
        if (post.content) {
          elements.push(
            <div
              key={`paragraph-${i}`}
              className="text-gray-700 leading-relaxed mb-6"
              dangerouslySetInnerHTML={{ __html: paragraph }}
            />
          );
        } else {
          elements.push(
            <div
              key={`paragraph-${i}`}
              className="text-gray-700 leading-relaxed mb-6 whitespace-pre-wrap"
            >
              {paragraph}
            </div>
          );
        }

        // 이미지 위치에 해당하는 단락 뒤에 이미지 삽입
        if (post.imagePositions?.includes(i + 1)) {
          const imageIndex = post.imagePositions.indexOf(i + 1);
          if (imageIndex < (post.images?.length || 0)) {
            const imageSrc = post.images![imageIndex];
            elements.push(
              <div key={`image-${i}`} className="my-8">
                <div className="relative h-80 rounded-lg overflow-hidden shadow-md">
                  <Image
                    src={imageSrc}
                    alt={`${post.title} - 이미지 ${imageIndex + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
                  />
                </div>
              </div>
            );
          }
        }
      }

      return elements;
    }

    // articleUrl이나 contentFileUrl이 있는 경우
    if (post.articleUrl || post.contentFileUrl) {
      const contentUrl = post.articleUrl || post.contentFileUrl;

      // 이미지 파일인 경우
      if (contentUrl && contentUrl.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return (
          <div className="relative aspect-video mb-6">
            <Image
              src={contentUrl}
              alt="업로드 이미지"
              fill
              className="object-contain rounded-lg"
            />
          </div>
        );
      }

      // 텍스트/마크다운 파일인 경우 - 클라이언트에서 처리하도록 안내
      return (
        <div className="text-gray-700 leading-relaxed">
          <p>콘텐츠를 불러오는 중...</p>
          <p className="text-sm text-gray-500 mt-2">콘텐츠 URL: {contentUrl}</p>
        </div>
      );
    }

    return (
      <div className="text-gray-700 leading-relaxed">
        <p>콘텐츠가 없습니다.</p>
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto bg-white rounded-2xl my-8 shadow-light flex flex-col">
      {/* 헤더 */}
      <div className="flex-shrink-0 border-b border-gray-200 px-6 py-4 rounded-t-2xl flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">블로그 포스트</h2>
        <Link
          href="/blog"
          className="text-gray-500 hover:text-gray-800 px-2 py-1 text-xs border border-gray-300 rounded transition-colors"
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
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
            />
          </div>
        )}

        {/* 제목 */}
        <h1 className="text-3xl font-bold text-gray-900 mb-4">{post.title}</h1>

        {/* 메타 정보 */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-500 mb-8 pb-6 border-b border-gray-200">
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

          {post.publishDate && (
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
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span>
                {new Date(post.publishDate).toLocaleDateString('ko-KR')}
              </span>
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

          {/* 읽기 시간 표시 */}
          {post.markdownContent && (
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
              <span>{readingTime}분 읽기</span>
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
        </div>

        {/* 콘텐츠와 이미지 */}
        <div className="prose prose-lg max-w-none">
          {await renderContentWithImages()}
        </div>

        {/* 목차 */}
        {tableOfContents.length > 0 && (
          <div className="mt-8 p-6 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">목차</h3>
            <nav className="space-y-2">
              {tableOfContents.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className={`block text-blue-600 hover:text-blue-800 transition-colors ${
                    item.level === 1
                      ? 'font-semibold'
                      : item.level === 2
                        ? 'ml-4'
                        : item.level === 3
                          ? 'ml-8'
                          : item.level === 4
                            ? 'ml-12'
                            : item.level === 5
                              ? 'ml-16'
                              : 'ml-20'
                  }`}
                >
                  {item.text}
                </a>
              ))}
            </nav>
          </div>
        )}
      </div>
    </div>
  );
}

// 메인 페이지 컴포넌트
export default async function BlogPostPage({ params, searchParams }: Props) {
  const { id } = await params;
  await searchParams; // searchParams도 비동기로 처리
  const post = await getPost(id);

  if (!post) {
    notFound();
  }

  return (
    <>
      <BlogStructuredData post={post} />

      <div className="min-h-screen">
        <Header />

        {/* 서버 컴포넌트로 렌더링되는 블로그 포스트 내용 */}
        <BlogPostContent post={post} />

        {/* 클라이언트 컴포넌트 - 인터랙션만 담당 */}
        <BlogPostPageClient id={id} />

        <Footer />
      </div>
    </>
  );
}
