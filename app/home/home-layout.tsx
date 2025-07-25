'use client';
import React, { useState } from 'react';
import { Filter } from './components/filter';
import { Sort } from './components/sort';
import { Modal } from './components/modal';
import { useHomeStore } from '@/app/(shared)/stores/home-store';
import HomeSection from './home-section';
import Image from 'next/image';

import { Pagination } from '@/app/(shared)/components/Pagination';
import { PriceUnit } from '@/app/(shared)/types';
import { PriceUnitToggle } from './components/price-unit-toggle';
import TabNavigation from '@/app/(shared)/components/TabNavigation';

interface Card {
  id: number;
  name: string;
  createdAt: string;
  email: string;
  sellStatus: string;
  cardCategory: 'SELL' | 'BUY';
  carrier: string;
  dataAmount: number;
  price: number;
  updatedAt: string;
  ratingScore: number;
}

interface HomeLayoutProps {
  cards: Card[];
  isLoading: boolean;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function HomeLayout({
  cards,
  isLoading,
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
    <div className="flex w-full flex-col md:flex-row">
      <Filter />
      <Modal />

      <main className="flex flex-1 flex-col p-4">
        <div>
          {/* 모바일 */}
          <div className="mb-4 md:hidden">
            <div className="border-b border-t border-gray-200 py-3 mb-3">
              <button
                onClick={actions.toggleFilter}
                className="flex items-center gap-2"
                aria-label="필터 열기"
              >
                <Image
                  src="/filter.svg"
                  alt="필터 아이콘"
                  width={20}
                  height={20}
                />
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
                  <Image
                    src="/refresh.svg"
                    alt="새로고침"
                    width={18}
                    height={18}
                    className="cursor-pointer"
                  />
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
              <button
                onClick={() => window.location.reload()}
                aria-label="새로고침"
              >
                <Image
                  src="/refresh.svg"
                  alt="새로고침"
                  width={24}
                  height={24}
                  className="cursor-pointer"
                />
              </button>
            </div>

            <PriceUnitToggle
              currentUnit={currentUnit}
              setCurrentUnit={setCurrentUnit}
            />
          </div>
        </div>
        <div className="flex-grow">
          {isLoading ? (
            <div className="text-center py-10">로딩 중...</div>
          ) : (
            <>
              {cards.length === 0 && (
                <p className="text-center text-gray-500 py-10">
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
