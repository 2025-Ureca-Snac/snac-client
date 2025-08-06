import React from 'react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { api } from '@/app/(shared)/utils/api';
import { CardData } from '@/app/(shared)/types/card';
import TradeContent from './trade-content';
import TradePageClient from './trade-page-client';
import StructuredData from './components/structured-data';

interface TradePageProps {
  params: Promise<{
    cardId: string;
  }>;
}

// 동적 메타데이터 생성 함수
export async function generateMetadata({
  params,
}: TradePageProps): Promise<Metadata> {
  const { cardId } = await params;

  try {
    const response = await api.get(`/cards/${cardId}`);
    const responseData = response.data as { data: CardData };
    const cardData = responseData.data;

    // 메타 설명 생성
    const carrierName = cardData.carrier === 'LG' ? 'LGU+' : cardData.carrier;
    const dataAmount = `${cardData.dataAmount}GB`;
    const price = cardData.price
      ? cardData.price.toLocaleString()
      : '가격 협의';
    const category = cardData.cardCategory === 'SELL' ? '판매' : '구매';
    const ratingScore = cardData.ratingScore || '평점 없음';

    // 더 구체적인 설명 생성
    const baseDescription = `${carrierName} ${dataAmount} 데이터를 ${price}원에 ${category}합니다. 스낵스코어: ${ratingScore}`;
    const detailedDescription =
      category === '판매'
        ? `${baseDescription} 안전한 거래와 실시간 매칭으로 빠른 판매가 가능합니다.`
        : `${baseDescription} 데이터 부족 시 즉시 구매하여 자유롭게 사용하세요.`;

    const description = detailedDescription.substring(0, 160);

    // 더 구체적인 키워드 생성
    const keywords = [
      '데이터거래',
      '데이터마켓플레이스',
      '데이터판매',
      '데이터구매',
      carrierName,
      dataAmount,
      category,
      '스낵',
      '스낵스코어',
      '실시간매칭',
      '안전거래',
      '모바일데이터',
      category === '판매' ? '데이터판매' : '데이터구매',
      category === '판매' ? '데이터부족' : '데이터활용',
    ];

    // 구체적인 제목 생성
    const title =
      category === '판매'
        ? `${carrierName} ${dataAmount} 데이터 판매 - 안전한 거래 | 스낵`
        : `${carrierName} ${dataAmount} 데이터 구매 - 즉시 사용 가능 | 스낵`;

    return {
      title,
      description,
      keywords,
      creator: '스낵',
      publisher: '스낵',
      formatDetection: {
        email: false,
        address: false,
        telephone: false,
      },
      metadataBase: new URL('https://snac-app.com'),
      alternates: {
        canonical: `/trade/${cardId}`,
      },
      openGraph: {
        title:
          category === '판매'
            ? `${carrierName} ${dataAmount} 데이터 판매 - 안전한 거래`
            : `${carrierName} ${dataAmount} 데이터 구매 - 즉시 사용 가능`,
        description,
        url: `https://snac-app.com/trade/${cardId}`,
        siteName: '스낵',
        images: [
          {
            url: '/logo.png',
            width: 1200,
            height: 630,
            alt: `${carrierName} ${dataAmount} ${category}`,
          },
        ],
        locale: 'ko_KR',
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title:
          category === '판매'
            ? `${carrierName} ${dataAmount} 데이터 판매 - 안전한 거래`
            : `${carrierName} ${dataAmount} 데이터 구매 - 즉시 사용 가능`,
        description,
        images: ['/logo.png'],
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
        'article:section': '데이터거래',
        'article:tag': keywords.join(', '),
        'article:category': category,
        'article:carrier': carrierName,
        'article:data_amount': dataAmount,
        'article:price': price,
      },
    };
  } catch {
    return {
      title: '거래 상세 - Snac',
      description:
        '데이터 거래 상세 정보를 확인하세요. 안전한 거래와 실시간 매칭으로 데이터를 자유롭게 사용하세요.',
      keywords: [
        '데이터거래',
        '데이터마켓플레이스',
        '스낵',
        '안전거래',
        '실시간매칭',
      ],
      robots: {
        index: false,
        follow: false,
      },
    };
  }
}

export default async function TradePage({ params }: TradePageProps) {
  const { cardId } = await params;

  try {
    console.log('카드 정보 조회 시작:', cardId);
    const response = await api.get(`/cards/${cardId}`);
    console.log('카드 정보 조회 성공:', response.data);
    const responseData = response.data as { data: CardData };
    const cardData = responseData.data;

    return (
      <>
        <StructuredData cardData={cardData} />

        <div className="min-h-screen bg-white dark:bg-gray-900">
          <div className="max-w-4xl mx-auto p-4">
            {/* 서버 컴포넌트로 렌더링되는 거래 내용 */}
            <TradeContent cardData={cardData}>
              {/* 클라이언트 컴포넌트 - 인터랙션만 담당 */}
              <TradePageClient cardData={cardData} />
            </TradeContent>
          </div>
        </div>
      </>
    );
  } catch (error) {
    console.error('카드 정보 가져오기 실패:', error);
    console.error('에러 상세 정보:', {
      status: (error as { response?: { status: number } })?.response?.status,
      data: (error as { response?: { data: unknown } })?.response?.data,
      message: (error as { message?: string })?.message,
    });
    notFound();
  }
}
