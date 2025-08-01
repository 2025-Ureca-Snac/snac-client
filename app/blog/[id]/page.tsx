import { notFound } from 'next/navigation';
import type { Metadata, ResolvingMetadata } from 'next'; // 1. Metadata 관련 타입 import
import BlogPostPageClient from './blog-post-page-client';
import BlogStructuredData from '../components/BlogStructuredData';
import { generateBlogPostMetadata } from '../metadata';
import { Blog } from '@/app/(shared)/stores/use-blog-store';

// 데이터를 가져오는 통합 함수
async function getPost(id: string): Promise<Blog | null> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/articles/${id}`,
      { cache: 'no-store' }
    );

    if (!res.ok) {
      return null;
    }

    const responseJson = await res.json();
    return responseJson.data;
  } catch (error) {
    console.error('Failed to fetch post:', error);
    return null;
  }
}

// 2. 페이지와 메타데이터 함수가 공유할 Props 타입 정의
type Props = {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

// 3. 동적 메타데이터 (SEO) - 타입 정의 수정
export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { id } = params;
  const post = await getPost(id);

  if (!post) {
    return {
      title: '포스트를 찾을 수 없습니다 | 스낵 블로그',
      description: '요청하신 블로그 포스트를 찾을 수 없습니다.',
    };
  }

  // generateBlogPostMetadata가 Metadata 객체를 반환한다고 가정합니다.
  return generateBlogPostMetadata(post);
}

// 4. 메인 페이지 컴포넌트 - 타입 정의 수정
export default async function BlogPostPage({ params }: Props) {
  const { id } = params;
  const post = await getPost(id);

  if (!post) {
    notFound();
  }

  return (
    <>
      <BlogStructuredData post={post} />
      <BlogPostPageClient id={id} />
    </>
  );
}
