'use client';
import React, { useState } from 'react';
import { Filter } from './components/filter';
import { Sort } from './components/sort';
import { Modal } from './components/modal';
import { useHomeStore } from '@/app/(shared)/stores/home-store';
import HomeSection from './home-section';
import Image from 'next/image';
import { Toaster } from 'sonner';
import { Pagination } from '@/app/(shared)/components/Pagination';

type PriceUnit = 'snack' | 'won';

interface Card {
  id: number;
  name: string;
  createdAt: string;
  email: string;
  sellStatus: string;
  cardCategory: string;
  carrier: string;
  dataAmount: number;
  price: number;
  updatedAt: string;
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
  const { actions } = useHomeStore();
  const [currentUnit, setCurrentUnit] = useState<PriceUnit>('snack');

  return (
    <div className="flex w-full flex-col md:flex-row">
      <Filter />
      <Modal />
      <Toaster richColors position="top-center" />

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
                  onClick={() => window.location.reload()}
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
              <div className="relative flex w-32 items-center rounded-full bg-gray-200 p-1">
                <div
                  className={`absolute h-[calc(100%-8px)] w-[calc(50%-4px)] transform rounded-full bg-white shadow-md transition-transform duration-300 ease-in-out ${
                    currentUnit === 'won' ? 'translate-x-full' : 'translate-x-0'
                  }`}
                />
                <button
                  onClick={() => setCurrentUnit('snack')}
                  className={`relative z-10 flex flex-1 items-center justify-center py-1 text-center text-xs font-bold transition-colors duration-300 ${
                    currentUnit === 'snack' ? 'text-gray-900' : 'text-gray-500'
                  }`}
                >
                  <Image
                    src="/snac-price.svg"
                    alt="스낵 단위 아이콘"
                    width={16}
                    height={16}
                    className="mr-1"
                  />
                  스낵
                </button>
                <button
                  onClick={() => setCurrentUnit('won')}
                  className={`relative z-10 flex-1 py-1 text-center text-regular-sm font-bold transition-colors duration-300 ${
                    currentUnit === 'won' ? 'text-gray-900' : 'text-gray-500'
                  }`}
                >
                  ₩ 원
                </button>
              </div>
            </div>
          </div>

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
            <div className="relative flex w-44 items-center rounded-full bg-gray-200 p-1">
              <div
                className={`absolute h-[calc(100%-8px)] w-[calc(50%-4px)] transform rounded-full bg-white shadow-light transition-transform duration-300 ease-in-out ${
                  currentUnit === 'won' ? 'translate-x-full' : 'translate-x-0'
                }`}
              />
              <button
                onClick={() => setCurrentUnit('snack')}
                className={`relative z-10 flex flex-1 items-center justify-center py-2 text-center text-regular-sm font-bold transition-colors duration-300 ${
                  currentUnit === 'snack' ? 'text-gray-900' : 'text-gray-500'
                }`}
              >
                <Image
                  src="/snac-price.svg"
                  alt="스낵 단위 아이콘"
                  width={18}
                  height={18}
                  className="mr-1.5"
                />
                스낵
              </button>
              <button
                onClick={() => setCurrentUnit('won')}
                className={`relative z-10 flex-1 py-2 text-center text-regular-sm font-bold transition-colors duration-300 ${
                  currentUnit === 'won' ? 'text-gray-900' : 'text-gray-500'
                }`}
              >
                ₩ 원
              </button>
            </div>
          </div>
        </div>

        <div className="flex-grow">
          {isLoading ? (
            <div className="text-center py-10">로딩 중...</div>
          ) : (
            <HomeSection cards={cards} unit={currentUnit} />
          )}
        </div>

        <div className="mt-0">
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
