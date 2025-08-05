// React 관련 임포트
import { notFound } from 'next/navigation';
import Head from 'next/head';
import type { Metadata } from 'next';

// 내부 라이브러리/유틸리티 임포트 (절대 경로);

// 상대 경로 임포트
import BlogPostPageClient from './blog-post-page-client';
import BlogPostContent from './blog-post-content';
import BlogStructuredData from '../components/BlogStructuredData';
import { generateBlogPostMetadata } from '../metadata';
import { getPost } from './utils';

// generateMetadata용 Props 인터페이스
interface GenerateMetadataProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

// generateMetadata 함수 - SEO 최적화
export async function generateMetadata({
  params,
}: GenerateMetadataProps): Promise<Metadata> {
  const { id } = await params;
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

// 메인 페이지 컴포넌트
export default async function BlogPostPage({ params }: GenerateMetadataProps) {
  const { id } = await params;
  const post = await getPost(id);

  if (!post) {
    notFound();
  }

  // 메타 설명 생성 - 제목 사용
  const description = post.title || '스낵 블로그 포스트입니다.';

  return (
    <>
      <Head>
        <meta name="description" content={description} />
      </Head>
      <BlogStructuredData post={post} />

      <div className="min-h-screen">
        {/* <Header /> */}

        {/* 서버 컴포넌트로 렌더링되는 블로그 포스트 내용 */}
        <BlogPostContent post={post} />

        {/* 클라이언트 컴포넌트 - 인터랙션만 담당 */}
        <BlogPostPageClient id={id} />

        {/* <Footer /> */}
      </div>
    </>
  );
}
