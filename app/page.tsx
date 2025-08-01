'use client';
import Image from 'next/image';
import { useEffect, useState, useRef } from 'react';
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

  const [cardPages, setCardPages] = useState<CardData[][]>([]);
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

  const PAGE_SIZE = 54;

  // refetchTrigger가 변경될 때 페이지네이션 상태를 리셋하는 useEffect
  const isInitialMount = useRef(true);
  useEffect(() => {
    // 컴포넌트 첫 마운트 시에는 실행하지 않음
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    setCurrentPage(1);
    setCardPages([]);
    setTotalPages(1);
  }, [refetchTrigger]);

  // 현재 페이지의 데이터를 가져오는 useEffect
  useEffect(() => {
    const pageIdx = currentPage - 1;
    // 페이지 인덱스가 유효하지 않거나, 해당 페이지 데이터가 이미 캐시되어 있다면 fetch를 건너뜀
    if (pageIdx < 0 || cardPages[pageIdx]) {
      if (cardPages[pageIdx]) setLoading(false);
      return;
    }

    const fetchPage = async () => {
      setLoading(true);

      let lastCardId: number | undefined = undefined;
      let lastUpdatedAt: string | undefined = undefined;
      // 이전 페이지의 마지막 아이템을 기준으로 커서 설정
      if (pageIdx > 0 && cardPages[pageIdx - 1]?.length > 0) {
        const prevPageLast =
          cardPages[pageIdx - 1][cardPages[pageIdx - 1].length - 1];
        lastCardId = prevPageLast.id;
        lastUpdatedAt = prevPageLast.updatedAt;
      }

      const highRatingFirst = sortBy === 'RATING';
      const carrierForQuery: Carrier | undefined =
        category === 'ALL'
          ? undefined
          : category === 'LGU+'
            ? 'LG'
            : (category ?? undefined);

      const queryString = generateQueryParams({
        cardCategory: cardCategory,
        sellStatusFilter: 'ALL' as SellStatus,
        priceRanges: [priceRange],
        highRatingFirst,
        size: PAGE_SIZE,
        lastCardId,
        lastUpdatedAt,
        carrier: carrierForQuery,
      });

      const fullUrl = `${API_BASE}/cards/scroll?${queryString}&_v=${new Date().getTime()}`;
      console.log('[요청 URL]', fullUrl);

      try {
        const res = await fetch(fullUrl, { cache: 'no-store' });
        if (!res.ok) {
          console.error('fetch data 실패:', res.status, res.statusText);
          throw new Error('fetch error');
        }

        const json: CardApiResponse = await res.json();

        // CANCELLED 상태의 카드 제외
        let filteredCards = json.data.cardResponseList.filter(
          (card) => card.sellStatus !== 'CANCELLED'
        );

        // transactionStatus에 따라 카드 필터링
        if (transactionStatus && transactionStatus !== 'ALL') {
          filteredCards = filteredCards.filter(
            (card) => card.sellStatus === transactionStatus
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

        // 카드 페이지 배열에 추가 (캐시)
        setCardPages((prev) => {
          const next = [...prev];
          next[pageIdx] = filteredCards;
          return next;
        });

        setTotalPages(json.data.hasNext ? pageIdx + 2 : pageIdx + 1);
      } catch (e) {
        console.error('카드 조회 실패:', e);
        setCardPages((prev) => {
          const next = [...prev];
          next[pageIdx] = [];
          return next;
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPage();
  }, [
    currentPage,
    cardPages,
    cardCategory,
    category,
    transactionStatus,
    priceRange,
    sortBy,
    carrier,
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
          cards={cardPages[currentPage - 1] || []}
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
