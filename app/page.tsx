'use client';

import { useEffect, useState } from 'react';
import { useHomeStore } from '@/app/(shared)/stores/home-store';
import { Header } from './(shared)/components/Header';
import Banner from './home/banner';

import { DataAvg } from './home/data-avgs';
import HomeLayout from './home/home-layout';
import { ArticleSection } from './home/components/article-section';
import { Footer } from './(shared)/components/Footer';
import { generateQueryParams } from '@/app/(shared)/utils/generateQueryParams';
import type {
  CardCategory,
  SellStatus,
  PriceRange,
  Carrier,
} from '@/app/(shared)/utils/generateQueryParams';
import Image from 'next/image';

interface Card {
  id: number;
  cardCategory: 'BUY' | 'SELL';
  carrier: 'SKT' | 'KT' | 'LGU+';
  dataAmount: number;
  price: number;
  updatedAt: string;
  createdAt: string;
  email: string;
  name: string;
  sellStatus: string;
}

interface CardApiResponse {
  data: {
    cardResponseList: Card[];
    hasNext: boolean;
  };
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

export default function Home() {
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const {
    category,
    cardCategory,
    transactionStatus,
    priceRanges,
    sortBy,
    carrier,
    actions,
    refetchTrigger,
  } = useHomeStore();

  useEffect(() => {
    console.log('[디버깅] 필터 상태:', {
      category,
      transactionStatus,
      priceRanges,
      sortBy,
      carrier,
    });

    const fetchScrollCards = async () => {
      setLoading(true);
      try {
        const highRatingFirst = sortBy === 'RATING';
        const carrierForQuery: Carrier | undefined =
          category === 'LGU+' ? 'LG' : (category ?? undefined);

        const queryString = generateQueryParams({
          cardCategory: (cardCategory || 'BUY') as CardCategory,
          sellStatusFilter: (transactionStatus || 'ALL') as SellStatus,
          priceRanges:
            priceRanges.length === 0 ? ['ALL'] : (priceRanges as PriceRange[]),
          highRatingFirst,
          size: 54,
          carrier: carrierForQuery,
        });

        const fullUrl = `${API_BASE}/cards/scroll?${queryString}&_v=${new Date().getTime()}`;
        console.log('[ 요청 URL 확인]', fullUrl);

        const res = await fetch(fullUrl, {
          cache: 'no-store',
        });

        if (!res.ok) {
          console.error('fetch data 실패:', res.status, res.statusText);
          setCards([]);
          return;
        }

        const json: CardApiResponse = await res.json();
        setCards(json.data.cardResponseList);
        console.log('응답 데이터:', json);
        setTotalPages(json.data.hasNext ? currentPage + 1 : currentPage);
      } catch (err) {
        console.error('카드 스크롤 조회 실패:', err);
        setCards([]);
      } finally {
        setLoading(false);
      }
    };

    fetchScrollCards();
  }, [currentPage, refetchTrigger, priceRanges.join(',')]);

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <>
      <Header />
      <Banner />
      <DataAvg />

      <button
        onClick={actions.toggleCreateModal}
        className="fixed bottom-6 right-6 z-50 p-4 rounded-full shadow-light transition-all
          bg-gradient-to-br from-[#98FF58] to-[#38CB89] hover:brightness-90"
        aria-label="글 등록하기"
      >
        <Image src="/write.svg" alt="글쓰기" width={24} height={24} />
      </button>

      <div className="flex items-center justify-center">
        {loading ? (
          <p>로딩 중…</p>
        ) : cards.length === 0 ? (
          <p>조건에 맞는 카드가 없어요 😢</p>
        ) : (
          <HomeLayout
            cards={cards}
            isLoading={loading}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </div>

      <div className="w-full">
        <ArticleSection />
      </div>

      <Footer />
    </>
  );
}
