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

export default function Home() {
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { actions } = useHomeStore();

  const { category, transactionStatus, priceRanges, sortBy } = useHomeStore();
  useEffect(() => {
    async function fetchScrollCards() {
      setLoading(true);
      try {
        const queryString = generateQueryParams({
          category,
          transactionStatus,
          priceRanges,
          sortBy,
          page: currentPage,
          size: 54,
        });

        const res = await fetch(`/api/cards/scroll?${queryString}`, {
          cache: 'no-store',
        });

        if (!res.ok) {
          throw new Error(`데이터를 가져오는데 실패했습니다: ${res.status}`);
        }

        const json: CardApiResponse = await res.json();
        setCards(json.data.cardResponseList);
        setTotalPages(json.data.hasNext ? currentPage + 1 : currentPage);
      } catch (err) {
        console.error('카드 스크롤 조회 실패:', err);
        setCards([]);
      } finally {
        setLoading(false);
      }
    }

    fetchScrollCards();
  }, [
    currentPage,
    category,
    transactionStatus,
    JSON.stringify(priceRanges),
    sortBy,
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
        className="fixed bottom-6 right-6 z-50 p-4 rounded-full shadow-light transition-all
      bg-gradient-to-br from-[#98FF58] to-[#38CB89] hover:brightness-90"
        aria-label="글 등록하기"
      >
        <Image src="/write.svg" alt="글쓰기" width={24} height={24} />
      </button>

      <div className="flex items-center justify-center">
        {loading ? (
          <p>로딩 중…</p>
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
