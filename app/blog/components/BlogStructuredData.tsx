import { ExtendedBlogPost } from '../data/blogPosts';

interface BlogStructuredDataProps {
  post?: ExtendedBlogPost;
  posts?: ExtendedBlogPost[];
}

export default function BlogStructuredData({
  post,
  posts,
}: BlogStructuredDataProps) {
  if (post) {
    // 개별 포스트용 구조화된 데이터
    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: post.title,
      description: post.content?.substring(0, 160) || post.title,
      image: post.image,
      author: {
        '@type': 'Person',
        name: post.author || '스낵팀',
      },
      publisher: {
        '@type': 'Organization',
        name: '스낵',
        logo: {
          '@type': 'ImageObject',
          url: '/logo.png',
        },
      },
      datePublished: post.publishDate,
      dateModified: post.publishDate,
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': `https://snac.com/blog/${post.id}`,
      },
      articleSection: post.category || '블로그',
    };

    return (
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
    );
  }

  if (posts) {
    // 블로그 목록용 구조화된 데이터
    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'Blog',
      name: '스낵 블로그',
      description:
        '데이터 거래, 데이터 마켓플레이스, 데이터 판매와 구매를 다루는 스낵 블로그입니다.',
      url: 'https://snac.com/blog',
      publisher: {
        '@type': 'Organization',
        name: '스낵',
        logo: {
          '@type': 'ImageObject',
          url: '/logo.png',
        },
      },
      blogPost: posts.map((post) => ({
        '@type': 'BlogPosting',
        headline: post.title,
        description: post.content?.substring(0, 160) || post.title,
        image: post.image,
        author: {
          '@type': 'Person',
          name: post.author || '스낵팀',
        },
        datePublished: post.publishDate,
        url: `https://snac.com/blog/${post.id}`,
      })),
    };

    return (
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
    );
  }

  return null;
}
