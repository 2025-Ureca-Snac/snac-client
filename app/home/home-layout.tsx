'use client';

import { Filter } from './components/filter';
import { Sort } from './components/sort';
import { Modal } from './components/modal';
import { useHomeStore } from '@/app/(shared)/stores/home-store';
import HomeSection from './home-section';
import Image from 'next/image';
import { Toaster } from 'sonner';
import { Pagination } from '@/app/(shared)/components/Pagination';

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
              <Sort />
              <button
                onClick={actions.toggleCreateModal}
                className="px-4 py-2 w-[100px] border rounded-lg text-medium-sm font-semibold hover:bg-gray-50 bg-white shadow-sm"
              >
                + 등록하기
              </button>
            </div>
          </div>
          {/* PC */}
          <div className="hidden md:flex justify-between items-center mb-4">
            <div className="flex items-center gap-4">
              <Sort />
            </div>
            <button
              onClick={actions.toggleCreateModal}
              className="px-4 py-2 w-[93px] md:w-[110px] border rounded-lg text-medium-md font-semibold hover:bg-gray-50 bg-white shadow-sm"
            >
              + 등록하기
            </button>
          </div>
        </div>

        <div className="flex-grow">
          {isLoading ? (
            <div className="text-center py-10">로딩 중...</div>
          ) : (
            <HomeSection cards={cards} />
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
