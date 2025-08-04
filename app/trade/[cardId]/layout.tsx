import { Metadata } from 'next';
import { api } from '@/app/(shared)/utils/api';
import { CardData } from '@/app/(shared)/types/card';
import { getCarrierImageUrl } from '@/app/(shared)/utils/carrier-utils';

const formatCarrierName = (carrier: string): string =>
  carrier === 'LG' ? 'LGU+' : carrier;

const formatDataAmount = (amountInGB: number): string => {
  return `${amountInGB}GB`;
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ cardId: string }>;
}): Promise<Metadata> {
  try {
    const { cardId } = await params;
    const response = await api.get(`/cards/${cardId}`);
    const responseData = response.data as { data: CardData };
    const cardData = responseData.data;

    const title = `${formatCarrierName(cardData.carrier)} 데이터 ${formatDataAmount(cardData.dataAmount)} - ${cardData.cardCategory === 'SELL' ? '판매' : '구매'} | 스낵`;
    const description = `${formatCarrierName(cardData.carrier)} ${formatDataAmount(cardData.dataAmount)} 데이터를 ${cardData.price.toLocaleString()}원에 ${cardData.cardCategory === 'SELL' ? '판매' : '구매'}합니다. 스낵스코어: ${cardData.ratingScore}`;
    const url = `https://snac-app.com/trade/${cardId}`;

    return {
      title,
      description,
      authors: [{ name: cardData.name || '스낵팀' }],
      creator: '스낵',
      publisher: '스낵',
      formatDetection: {
        email: false,
        address: false,
        telephone: false,
      },
      metadataBase: new URL('https://snac-app.com'),
      alternates: {
        canonical: url,
      },
      openGraph: {
        title,
        description,
        type: 'website',
        url,
        siteName: '스낵',
        images: [
          {
            url: getCarrierImageUrl(cardData.carrier),
            width: 1200,
            height: 630,
            alt: `${formatCarrierName(cardData.carrier)} 로고`,
          },
        ],
        locale: 'ko_KR',
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [getCarrierImageUrl(cardData.carrier)],
        creator: '@snac_official',
        site: '@snac_official',
      },
      keywords: [
        '데이터 거래',
        '모바일 데이터',
        '통신사 데이터',
        '스낵',
        formatCarrierName(cardData.carrier),
        `${formatDataAmount(cardData.dataAmount)} 데이터`,
        cardData.cardCategory === 'SELL' ? '데이터 판매' : '데이터 구매',
        '데이터 마켓플레이스',
        '모바일 데이터 거래',
        '스낵스코어',
        cardData.ratingScore.toString(),
      ],
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
      verification: {
        google: 'your-google-verification-code',
        // naver: 'your-naver-verification-code',
      },
      other: {
        'article:published_time': cardData.createdAt,
        'article:author': cardData.name || '스낵팀',
        'article:section':
          cardData.cardCategory === 'SELL' ? '데이터 판매' : '데이터 구매',
        'article:tag': [
          '데이터 거래',
          '모바일 데이터',
          '통신사 데이터',
          '스낵',
          formatCarrierName(cardData.carrier),
          `${formatDataAmount(cardData.dataAmount)} 데이터`,
          cardData.cardCategory === 'SELL' ? '데이터 판매' : '데이터 구매',
        ].join(', '),
      },
    };
  } catch {
    return {
      title: '데이터 거래 | 스낵',
      description: '안전하고 빠른 데이터 거래 플랫폼',
      keywords: ['데이터 거래', '모바일 데이터', '통신사 데이터', '스낵'],
      robots: {
        index: false,
        follow: false,
      },
    };
  }
}

export default function TradeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
