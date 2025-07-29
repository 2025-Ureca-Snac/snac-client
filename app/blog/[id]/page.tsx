import { BLOG_POSTS } from '../data/blogPosts';
import BlogPostPageClient from './BlogPostPageClient';
import BlogStructuredData from '../components/BlogStructuredData';
import { generateBlogPostMetadata } from '../metadata';

interface BlogPostPageProps {
  params: Promise<{
    id: string;
  }>;
}

// 동적 메타데이터 생성
export async function generateMetadata({ params }: BlogPostPageProps) {
  const { id } = await params;
  const postId = parseInt(id);
  const post = BLOG_POSTS.find((p) => p.id === postId);

  if (!post) {
    return {
      title: '포스트를 찾을 수 없습니다 | 스낵 블로그',
      description: '요청하신 블로그 포스트를 찾을 수 없습니다.',
    };
  }

  return generateBlogPostMetadata(post);
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { id } = await params;
  const post = BLOG_POSTS.find((p) => p.id === parseInt(id));

  return (
    <>
      {post && <BlogStructuredData post={post} />}
      <BlogPostPageClient params={params} />
    </>
  );
}
