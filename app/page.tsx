import { Metadata } from 'next';
import HomePage from './HomePage'; // 클라이언트 컴포넌트 분리

export const metadata: Metadata = {
  title: '스낵 - 데이터 거래 플랫폼',
  description:
    '스낵은 안전하고 편리한 데이터 거래 플랫폼입니다. 데이터 판매와 구매를 통해 데이터를 자유롭게 사용하고, 실시간 매칭으로 빠른 거래를 경험하세요. SKT, KT, LGU+ 등 모든 통신사 데이터 거래 가능합니다.',
  keywords: [
    '데이터거래',
    '데이터마켓플레이스',
    '데이터판매',
    '데이터구매',
    '모바일데이터',
    '통신사데이터',
    'SKT',
    'KT',
    'LGU+',
    '스낵',
    '데이터거래소',
    '실시간매칭',
  ],
  alternates: {
    canonical: 'https://snac-app.com/',
  },
  openGraph: {
    title: '스낵 - 데이터 거래 플랫폼',
    description:
      '안전하고 편리한 데이터 거래 플랫폼. SKT, KT, LGU+ 데이터 판매와 구매를 통해 데이터를 자유롭게 사용하세요.',
    url: 'https://snac-app.com',
    siteName: '스낵',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: '스낵 - 데이터 거래 플랫폼',
      },
    ],
    locale: 'ko_KR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '스낵 - 데이터 거래 플랫폼',
    description:
      '안전하고 편리한 데이터 거래 플랫폼. SKT, KT, LGU+ 데이터 판매와 구매를 통해 데이터를 자유롭게 사용하세요.',
    images: ['/logo.png'],
  },
};

export default function Page() {
  return <HomePage />; // 클라이언트 컴포넌트
}
