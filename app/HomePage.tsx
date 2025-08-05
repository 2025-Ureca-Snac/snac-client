'use client';

import { useEffect, useState, useRef, useMemo } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useHomeStore } from '@/app/(shared)/stores/home-store';
import { useWebSocketGuard } from './(shared)/hooks/useWebSocketGuard';

import Banner from './home/banner';
import { DataAvg } from './home/data-avgs';
import HomeLayout from './home/home-layout';
import { ArticleSection } from './home/components/article-section';

import { generateQueryParams } from '@/app/(shared)/utils/generateQueryParams';
import type { CardData } from '@/app/(shared)/types/card';
import { api } from '@/app/(shared)/utils/api';

import type {
  SellStatus,
  Carrier,
} from '@/app/(shared)/utils/generateQueryParams';
import { CreateButton } from '@/app/(shared)/components/CreateButton';

interface CardApiResponse {
  data: {
    hasNext: boolean;
    cardResponseList: CardData[];
  };
}

interface JwtPayload {
  username: string;
  [key: string]: unknown;
}

const getCurrentUserEmail = (): string | null => {
  try {
    const authStorage = localStorage.getItem('auth-storage');
    if (authStorage) {
      const parsed = JSON.parse(authStorage);
      if (parsed.state?.token) {
        const token = parsed.state.token;
        const decoded = jwtDecode<JwtPayload>(token);
        return decoded.username;
      }
    }
    return null;
  } catch (error) {
    console.error('토큰 디코딩 실패:', error);
    return null;
  }
};

const filterCardsByPostView = (
  cards: CardData[],
  postView: string
): CardData[] => {
  if (!postView || postView === 'ALL') return cards;

  if (postView === 'MY_POSTS') {
    const currentUserEmail = getCurrentUserEmail();
    return currentUserEmail
      ? cards.filter((card: CardData) => card.email === currentUserEmail)
      : [];
  } else if (postView === 'FAVORITE_POSTS') {
    return cards.filter((card: CardData) => card.favorite === true);
  }

  return cards;
};

const sortCards = (cards: CardData[], sortBy: string): CardData[] => {
  const sorted = [...cards];
  if (sortBy === 'RATING') {
    return sorted.sort((a, b) => {
      if (a.ratingScore !== b.ratingScore) {
        return b.ratingScore - a.ratingScore;
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  } else {
    return sorted.sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }
};

export default function HomePage() {
  useWebSocketGuard();

  const [allCards, setAllCards] = useState<CardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const {
    cardCategory,
    category,
    transactionStatus,
    priceRange,
    sortBy,
    postView,
    actions,
    refetchTrigger,
  } = useHomeStore();

  const [showCreateButton, setShowCreateButton] = useState(false);
  const homeLayoutRef = useRef<HTMLDivElement>(null);

  const PAGE_SIZE = 20;

  useEffect(() => {
    const fetchAllCards = async () => {
      setLoading(true);
      setCurrentPage(1);
      let accumulatedCards: CardData[] = [];
      let hasNext = true;
      let lastCardId: number | undefined = undefined;
      let lastUpdatedAt: string | undefined = undefined;

      const highRatingFirst = sortBy === 'RATING';
      const carrierForQuery: Carrier | undefined =
        category === 'ALL'
          ? undefined
          : category === 'LGU+'
            ? 'LG'
            : (category ?? undefined);

      while (hasNext) {
        try {
          const queryString = generateQueryParams({
            cardCategory: cardCategory,

            sellStatusFilter: transactionStatus as SellStatus,
            priceRanges: [priceRange],
            highRatingFirst,
            size: PAGE_SIZE,
            lastCardId,
            lastUpdatedAt,
            carrier: carrierForQuery,
            favoriteOnly: postView === 'FAVORITE_POSTS',
          });

          const endpoint = `/cards/scroll?${queryString}`;
          const res = await api.get(endpoint);
          const json = res.data as CardApiResponse;

          const newCards = json.data.cardResponseList.filter(
            (card) => card.sellStatus !== 'CANCELLED'
          );

          accumulatedCards = [...accumulatedCards, ...newCards];

          hasNext = json.data.hasNext;
          if (hasNext && newCards.length > 0) {
            const lastCard = newCards[newCards.length - 1];
            lastCardId = lastCard.id;
            lastUpdatedAt = lastCard.updatedAt;
          } else {
            hasNext = false;
          }
        } catch (error) {
          console.error('전체 카드 조회 중 오류 발생:', error);
          hasNext = false;
        }
      }
      setAllCards(accumulatedCards);
      setLoading(false);
    };

    fetchAllCards();
  }, [
    cardCategory,
    category,
    priceRange,
    sortBy,
    transactionStatus,
    refetchTrigger,
    postView,
  ]);

  const filteredAndSortedCards = useMemo(() => {
    const cardsToProcess = filterCardsByPostView(allCards, postView);

    return sortCards(cardsToProcess, sortBy);
  }, [allCards, postView, sortBy]);

  const totalPages = Math.ceil(filteredAndSortedCards.length / PAGE_SIZE);

  const currentCards = useMemo(() => {
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    const endIndex = startIndex + PAGE_SIZE;
    return filteredAndSortedCards.slice(startIndex, endIndex);
  }, [currentPage, filteredAndSortedCards]);

  const handlePageChange = (page: number) => {
    if (page > 0 && (page <= totalPages || totalPages === 0)) {
      setCurrentPage(page);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowCreateButton(entry.isIntersecting);
      },
      {
        rootMargin: '0px 0px -100px 0px',
        threshold: 0.1,
      }
    );
    const currentRef = homeLayoutRef.current;
    if (currentRef) observer.observe(currentRef);
    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, []);

  return (
    <>
      <Banner />
      <DataAvg />
      {showCreateButton && <CreateButton onClick={actions.toggleCreateModal} />}
      <div ref={homeLayoutRef} className="flex items-center justify-center">
        <HomeLayout
          cards={currentCards}
          isLoading={loading}
          currentPage={currentPage}
          totalPages={totalPages > 0 ? totalPages : 1}
          onPageChange={handlePageChange}
        />
      </div>

      <div className="w-full">
        <ArticleSection />
      </div>
    </>
  );
}
