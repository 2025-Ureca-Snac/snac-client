'use client';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useHomeStore } from '@/app/(shared)/stores/home-store';
import { useWebSocketGuard } from './(shared)/hooks/useWebSocketGuard';
import { Header } from './(shared)/components/Header';
import Banner from './home/banner';
import { DataAvg } from './home/data-avgs';
import HomeLayout from './home/home-layout';
import { ArticleSection } from './home/components/article-section';
import { Footer } from './(shared)/components/Footer';
import { generateQueryParams } from '@/app/(shared)/utils/generateQueryParams';
import type { CardData } from '@/app/(shared)/types/card';

import type {
  CardCategory,
  SellStatus,
  Carrier,
} from '@/app/(shared)/utils/generateQueryParams';

interface CardApiResponse {
  data: {
    cardResponseList: CardData[];
    hasNext: boolean;
  };
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

export default function Home() {
  // WebSocket 가드 사용
  useWebSocketGuard();

  const [cards, setCards] = useState<CardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const {
    cardCategory,
    category,
    transactionStatus,
    priceRange,
    sortBy,
    carrier,
    actions,
    refetchTrigger,
  } = useHomeStore();

  useEffect(() => {
    console.log('[디버깅] 필터 상태:', {
      category,
      transactionStatus,
      priceRange,
      sortBy,
      carrier,
    });

    const fetchScrollCards = async () => {
      setLoading(true);
      try {
        const highRatingFirst = sortBy === 'RATING';
        const carrierForQuery: Carrier | undefined =
          category === 'ALL'
            ? undefined
            : category === 'LGU+'
              ? 'LG'
              : (category ?? undefined);

        const queryString = generateQueryParams({
          cardCategory: (cardCategory || 'BUY') as CardCategory,
          sellStatusFilter: 'ALL' as SellStatus,
          priceRanges: [priceRange || 'ALL'],
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

        // transactionStatus에 따라 카드 필터링
        let filteredCards = json.data.cardResponseList;

        // CANCELLED 상태의 카드 제외
        filteredCards = filteredCards.filter(
          (card: { sellStatus: string }) => card.sellStatus !== 'CANCELLED'
        );

        if (transactionStatus && transactionStatus !== 'ALL') {
          filteredCards = filteredCards.filter(
            (card: { sellStatus: string }) =>
              card.sellStatus === transactionStatus
          );
        }

        // sortBy에 따라 카드 정렬
        if (sortBy === 'RATING') {
          // 인기순: 바삭스코어 높은 순, 같으면 등록순
          filteredCards.sort((a, b) => {
            if (a.ratingScore !== b.ratingScore) {
              return b.ratingScore - a.ratingScore; // 높은 점수 먼저
            }
            // 점수가 같으면 등록순 (최신 등록 먼저)
            return (
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
          });
        } else {
          // 최신순: 등록순 (최신 등록 먼저)
          filteredCards.sort((a, b) => {
            return (
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
          });
        }

        setCards(filteredCards);
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
  }, [
    currentPage,
    refetchTrigger,
    cardCategory,
    carrier,
    category,
    priceRange,
    sortBy,
    transactionStatus,
  ]);

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
        className="fixed bottom-6 right-6 z-50 p-4 rounded-full shadow-light transition-all bg-gradient-to-br from-burst-lime to-[#38CB89] hover:brightness-90"
        aria-label="글 등록하기"
      >
        <Image src="/write.svg" alt="글쓰기" width={24} height={24} />
      </button>

      <div className="flex items-center justify-center">
        <HomeLayout
          cards={cards}
          isLoading={loading}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>

      <div className="w-full">
        <ArticleSection />
      </div>

      <Footer />
    </>
  );
}
