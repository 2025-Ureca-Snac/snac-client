'use client';

import React from 'react';
import { CardData } from '@/app/(shared)/types/card';

const formatCarrierName = (carrier: string): string =>
  carrier === 'LG' ? 'LGU+' : carrier;

const formatDataAmount = (amountInGB: number): string => {
  return `${amountInGB}GB`;
};

interface StructuredDataProps {
  cardData: CardData;
}

export default function StructuredData({ cardData }: StructuredDataProps) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: `${formatCarrierName(cardData.carrier)} 데이터 ${formatDataAmount(cardData.dataAmount)}`,
    description: `${formatCarrierName(cardData.carrier)} ${formatDataAmount(cardData.dataAmount)} 데이터를 ${cardData.price.toLocaleString()}원에 ${cardData.cardCategory === 'SELL' ? '판매' : '구매'}합니다.`,
    brand: {
      '@type': 'Brand',
      name: formatCarrierName(cardData.carrier),
    },
    category: '모바일 데이터',
    offers: {
      '@type': 'Offer',
      price: cardData.price,
      priceCurrency: 'KRW',
      availability:
        cardData.sellStatus === 'SELLING'
          ? 'https://schema.org/InStock'
          : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Person',
        name: cardData.name,
      },
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: cardData.ratingScore,
      reviewCount: 1,
    },
    image: `/api/carriers/${cardData.carrier.toLowerCase()}.svg`,
    url: `https://snac-app.com/trade/${cardData.id}`,
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
          name: '카드 목록',
          item: 'https://snac-app.com/cards',
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: `${formatCarrierName(cardData.carrier)} 데이터 ${formatDataAmount(cardData.dataAmount)}`,
          item: `https://snac-app.com/trade/${cardData.id}`,
        },
      ],
    },
    // Organization 정보 추가
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
    inLanguage: 'ko-KR',
    datePublished: cardData.createdAt,
    dateModified: cardData.updatedAt,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
