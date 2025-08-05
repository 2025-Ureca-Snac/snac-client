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
    // content가 없으면 markdownContent를 사용
    let contentText = '';
    if (post.content) {
      contentText = post.content.replace(/<[^>]*>/g, '');
    } else if (
      post.markdownContent &&
      typeof post.markdownContent === 'string'
    ) {
      contentText = post.markdownContent;
    }
    const wordCount = contentText.split(/\s+/).length;

    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: post.title,
      description: contentText.substring(0, 160) || post.title,
      image:
        post.imageUrl ||
        post.image ||
        'https://snac-app.com/blog-bg-pattern.png',
      author: {
        '@type': 'Person',
        name: post.nickname || post.author || '스낵팀',
        url: 'https://snac-app.com',
      },
      publisher: {
        '@type': 'Organization',
        name: '스낵',
        url: 'https://snac-app.com',
        logo: {
          '@type': 'ImageObject',
          url: 'https://snac-app.com/logo.png',
          width: 200,
          height: 60,
        },
      },
      datePublished: post.publishDate,
      dateModified: post.publishDate,
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': `https://snac-app.com/blog/${post.id}`,
      },
      articleSection: post.category || '블로그',
      inLanguage: 'ko-KR',
      isAccessibleForFree: true,
      keywords: [
        post.category || '블로그',
        '스낵',
        '데이터거래',
        '데이터마켓플레이스',
        ...(post.title.split(' ').filter((word) => word.length > 1) || []),
      ].join(', '),
      wordCount: wordCount,
      // BreadcrumbList 추가
      breadcrumb: {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: '홈',
            item: 'https://snac-app.com',
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: '블로그',
            item: 'https://snac-app.com/blog',
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: post.title,
            item: `https://snac-app.com/blog/${post.id}`,
          },
        ],
      },
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
      url: 'https://snac-app.com/blog',
      inLanguage: 'ko-KR',
      publisher: {
        '@type': 'Organization',
        name: '스낵',
        url: 'https://snac-app.com',
        logo: {
          '@type': 'ImageObject',
          url: 'https://snac-app.com/logo.png',
          width: 200,
          height: 60,
        },
      },
      blogPost: posts.map((post) => ({
        '@type': 'BlogPosting',
        headline: post.title,
        description:
          (
            post.content?.replace(/<[^>]*>/g, '') ||
            (post.markdownContent && typeof post.markdownContent === 'string'
              ? post.markdownContent
              : '')
          ).substring(0, 160) || post.title,
        image:
          post.imageUrl ||
          post.image ||
          'https://snac-app.com/blog-bg-pattern.png',
        author: {
          '@type': 'Person',
          name: post.nickname || post.author || '스낵팀',
          url: 'https://snac-app.com',
        },
        datePublished: post.publishDate,
        url: `https://snac-app.com/blog/${post.id}`,
        inLanguage: 'ko-KR',
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
