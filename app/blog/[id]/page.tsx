import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import BlogPostPageClient from './blog-post-page-client';
import BlogStructuredData from '../components/BlogStructuredData';
import { generateBlogPostMetadata } from '../metadata';
import { ExtendedBlogPost } from '../data/blogPosts';

// 데이터를 가져오는 함수
async function getPost(id: string): Promise<ExtendedBlogPost | null> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/articles/${id}`,
      { cache: 'no-store' }
    );
    if (!res.ok) return null;
    const responseJson = await res.json();
    return responseJson.data as ExtendedBlogPost;
  } catch (error) {
    console.error('Failed to fetch post:', error);
    return null;
  }
}

// Props 인터페이스에 searchParams 추가
interface Props {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

// generateMetadata 함수에 수정된 Props와 반환 타입 적용
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
    };
  }

  return generateBlogPostMetadata(post);
}

// 메인 페이지 컴포넌트에 수정된 Props 적용
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
      <BlogPostPageClient id={id} />
    </>
  );
}
