import { MetadataRoute } from 'next';
import api from '@/app/(shared)/utils/api';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://snac-app.com';

  // 정적 페이지들
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/login`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/signUp`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
  ];

  // 블로그 포스트들 (API에서 동적으로 가져오기)
  let blogPosts: MetadataRoute.Sitemap = [];

  try {
    const response = await api.get('/articles');
    const posts =
      (response.data as { data: Array<{ id: string; publishDate?: string }> })
        .data || [];

    blogPosts = posts.map((post) => ({
      url: `${baseUrl}/blog/${post.id}`,
      lastModified: new Date(post.publishDate || new Date()),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));
  } catch (error) {
    console.error('Failed to fetch blog posts for sitemap:', error);
  }

  return [...staticPages, ...blogPosts];
}
