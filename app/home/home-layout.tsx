'use client';
import React, { useState } from 'react';
import { Filter } from './components/filter';
import { Sort } from './components/sort';
import { Modal } from './components/modal';
import { useHomeStore } from '@/app/(shared)/stores/home-store';
import HomeSection from './home-section';
import PlusIcon from '@/public/plus.svg';
import RefreshIcon from '@/public/refresh.svg';
import FilterIcon from '@/public/filter.svg';
import { Pagination } from '@/app/(shared)/components/Pagination';
import { PriceUnit } from '@/app/(shared)/types';
import { PriceUnitToggle } from './components/price-unit-toggle';
import TabNavigation from '@/app/(shared)/components/TabNavigation';
import LoadingSpinner from '@/app/(shared)/components/LoadingSpinner';
import type { CardData } from '@/app/(shared)/types/card';

interface HomeLayoutProps {
  cards: CardData[];
  isLoading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function HomeLayout({
  cards,
  isLoading,
  error,
  currentPage,
  totalPages,
  onPageChange,
}: HomeLayoutProps) {
  const { actions, cardCategory } = useHomeStore();
  const [currentUnit, setCurrentUnit] = useState<PriceUnit>('snack');

  const tabs = [
    { id: 'SELL', label: '팝니다' },
    { id: 'BUY', label: '삽니다' },
  ];

  const handleTabChange = (tabId: string) => {
    if (tabId === 'SELL' || tabId === 'BUY') {
      actions.setCardCategory(tabId);
      onPageChange(1);
    }
  };
  return (
    <div className="flex w-full min-h-dvh flex-col md:flex-row p-6">
      <Filter />
      <Modal />

      <main className="flex flex-1 flex-col p-4">
        <div>
          {/* 모바일 */}
          <div className="mb-4 md:hidden">
            <div className="border-b border-t border-border py-3 mb-3">
              <button
                onClick={actions.toggleFilter}
                className="flex items-center gap-2"
                aria-label="필터 열기"
              >
                <FilterIcon className="w-6 h-6 cursor-pointer " />
                <span className="font-semibold">필터</span>
              </button>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <Sort />

                <button
                  onClick={() => {
                    actions.resetAll();
                    onPageChange(1);
                  }}
                  aria-label="새로고침"
                >
                  <RefreshIcon className="w-6 h-6 cursor-pointer " />
                </button>
              </div>

              <PriceUnitToggle
                currentUnit={currentUnit}
                setCurrentUnit={setCurrentUnit}
                isMobile
              />
            </div>
          </div>
          <TabNavigation
            tabs={tabs}
            activeTab={cardCategory || 'SELL'}
            onTabChange={handleTabChange}
          />

          {/* PC */}
          <div className="hidden md:flex justify-between items-center mb-4">
            <div className="flex items-center gap-4">
              <Sort />
              <PriceUnitToggle
                currentUnit={currentUnit}
                setCurrentUnit={setCurrentUnit}
              />
              <button
                onClick={() => actions.triggerRefetch()}
                aria-label="새로고침"
              >
                <RefreshIcon className="w-6 h-6 cursor-pointer " />
              </button>
            </div>
            <button
              onClick={actions.toggleCreateModal}
              className="ml-1 px-3 rounded-lg flex w-auto h-auto justify-center items-center gap-2 border border-border"
            >
              <PlusIcon className="w-8 h-8 cursor-pointer text-muted-foreground" />
              <span className="text-muted-foreground hidden lg:block">
                글 등록하기
              </span>
            </button>
          </div>
        </div>
        <div className="flex-grow">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <LoadingSpinner size="lg" />
            </div>
          ) : error ? (
            <p className="text-center text-destructive py-10">{error}</p>
          ) : (
            <>
              {cards.length === 0 && (
                <p className="text-center text-muted-foreground py-10">
                  표시할 데이터가 없습니다.
                </p>
              )}

              <HomeSection cards={cards} unit={currentUnit} />
            </>
          )}
        </div>

        <div className="mt-5">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        </div>
      </main>
    </div>
  );
}
