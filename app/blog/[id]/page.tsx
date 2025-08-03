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
  // 디버깅을 위한 콘솔 로그
  console.log('BlogPostContent에서 받은 post:', {
    id: post.id,
    title: post.title,
    content: post.content,
    markdownContent: post.markdownContent ? 'Promise<string>' : 'undefined',
    contentFileUrl: post.contentFileUrl,
    articleUrl: post.articleUrl,
    imageUrl: post.imageUrl,
    nickname: post.nickname,
    publishDate: post.publishDate,
    category: post.category,
    readTime: post.readTime,
    images: post.images,
    imagePositions: post.imagePositions,
  });

  // 콘텐츠를 단락으로 분리하고 이미지 삽입
  const renderContentWithImages = async () => {
    // 마크다운 콘텐츠가 있으면 우선 처리
    if (post.markdownContent) {
      console.log('마크다운 콘텐츠 발견:', typeof post.markdownContent);
      const content = await post.markdownContent;
      console.log(
        '마크다운 원본 (처음 200자):',
        typeof content === 'string' ? content.substring(0, 200) : 'Not a string'
      );
      try {
        const htmlContent = marked(content, {
          breaks: true, // 줄바꿈을 <br>로 변환
          gfm: true, // GitHub Flavored Markdown 지원
        });
        console.log(
          'HTML 변환 결과 (처음 200자):',
          typeof htmlContent === 'string'
            ? htmlContent.substring(0, 200)
            : 'Not a string'
        );
        return (
          <div
            className="text-gray-700 leading-relaxed"
            style={{
              fontSize: '16px',
              lineHeight: '1.6',
            }}
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
      console.log(
        '콘텐츠가 없습니다. content:',
        post.content,
        'markdownContent:',
        post.markdownContent,
        'articleUrl:',
        post.articleUrl,
        'contentFileUrl:',
        post.contentFileUrl
      );
      return (
        <div className="text-gray-700 leading-relaxed">
          <p>콘텐츠를 불러오는 중...</p>
        </div>
      );
    }

    // 기존 content가 있으면 사용
    if (post.content) {
      const content = post.content;
      console.log('기존 콘텐츠 렌더링:', content);

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
      console.log('콘텐츠 URL:', contentUrl);

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
