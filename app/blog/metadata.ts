import { Metadata } from 'next';
import { ExtendedBlogPost } from './data/blogPosts';

// 블로그 레이아웃 메타데이터
export const blogLayoutMetadata: Metadata = {
  title: {
    default: '블로그 | 스낵',
    template: '%s | 스낵 블로그',
  },
  description:
    '데이터 거래, 데이터 마켓플레이스, 데이터 판매와 구매를 다루는 스낵 블로그입니다.',
  keywords: [
    '데이터거래',
    '데이터마켓플레이스',
    '데이터판매',
    '데이터구매',
    '비즈니스',
    '아웃렛',
    '스낵',
  ],
  authors: [{ name: '스낵팀' }],
  creator: '스낵',
  publisher: '스낵',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://snac-app.com'),
  alternates: {
    canonical: '/blog',
  },
  openGraph: {
    title: '블로그 | 스낵',
    description:
      '데이터 거래, 데이터 마켓플레이스, 데이터 판매와 구매를 다루는 스낵 블로그입니다.',
    url: 'https://snac-app.com/blog',
    siteName: '스낵',
    images: [
      {
        url: '/blog-bg-pattern.png',
        width: 1200,
        height: 630,
        alt: '스낵 블로그',
      },
    ],
    locale: 'ko_KR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '블로그 | 스낵',
    description:
      '데이터 거래, 데이터 마켓플레이스, 데이터 판매와 구매를 다루는 스낵 블로그입니다.',
    images: ['/blog-bg-pattern.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

// 블로그 메인 페이지 메타데이터
export const blogPageMetadata: Metadata = {
  title: '블로그 | 스낵',
  description:
    '데이터 거래, 데이터 마켓플레이스, 데이터 판매와 구매를 다루는 스낵 블로그입니다. 최신 트렌드와 실무 노하우를 확인하세요.',
  keywords: [
    '데이터거래',
    '데이터마켓플레이스',
    '데이터판매',
    '데이터구매',
    '비즈니스',
    '아웃렛',
    '스낵',
    '블로그',
  ],
  openGraph: {
    title: '블로그 | 스낵',
    description:
      '데이터 거래, 데이터 마켓플레이스, 데이터 판매와 구매를 다루는 스낵 블로그입니다.',
    url: 'https://snac-app.com/blog',
    siteName: '스낵',
    images: [
      {
        url: '/blog-bg-pattern.png',
        width: 1200,
        height: 630,
        alt: '스낵 블로그',
      },
    ],
    locale: 'ko_KR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '블로그 | 스낵',
    description:
      '데이터 거래, 데이터 마켓플레이스, 데이터 판매와 구매를 다루는 스낵 블로그입니다.',
    images: ['/blog-bg-pattern.png'],
  },
  alternates: {
    canonical: '/blog',
  },
};

// 블로그 포스트 메타데이터 생성 함수
export function generateBlogPostMetadata(post: ExtendedBlogPost): Metadata {
  // 콘텐츠에서 HTML 태그 제거하고 깨끗한 텍스트 추출
  // content가 없으면 markdownContent를 사용
  let contentText = '';
  if (post.content) {
    contentText = post.content.replace(/<[^>]*>/g, '');
  } else if (post.markdownContent) {
    // markdownContent가 Promise인 경우 처리
    if (typeof post.markdownContent === 'string') {
      contentText = post.markdownContent;
    } else {
      // Promise인 경우 기본값 사용
      contentText = '';
    }
  }

  const description =
    contentText.substring(0, 160) || post.title || '스낵 블로그 포스트입니다.';

  // 키워드 생성 (제목, 카테고리, 태그 등)
  const keywords = [
    post.category || '블로그',
    '스낵',
    '데이터거래',
    '데이터마켓플레이스',
    ...(post.title.split(' ').filter((word) => word.length > 1) || []),
  ];

  return {
    title: `${post.title} | 스낵 블로그`,
    description,
    keywords,
    authors: [{ name: post.nickname || post.author || '스낵팀' }],
    creator: '스낵',
    publisher: '스낵',
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL('https://snac-app.com'),
    alternates: {
      canonical: `/blog/${post.id}`,
    },
    openGraph: {
      title: post.title,
      description,
      url: `https://snac-app.com/blog/${post.id}`,
      siteName: '스낵',
      images: [
        {
          url: post.imageUrl || post.image || '/blog-bg-pattern.png',
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
      locale: 'ko_KR',
      type: 'article',
      publishedTime: post.publishDate,
      authors: [post.nickname || post.author || '스낵팀'],
      section: post.category || '블로그',
      tags: keywords,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description,
      images: [post.imageUrl || post.image || '/blog-bg-pattern.png'],
      creator: '@snac_app',
      site: '@snac_app',
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    other: {
      'article:published_time': post.publishDate || '',
      'article:author': post.nickname || post.author || '스낵팀',
      'article:section': post.category || '블로그',
      'article:tag': keywords.join(', '),
    },
  };
}
