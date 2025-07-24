// app/(shared)/components/Filter.tsx
'use client';

import {
  useHomeStore,
  homeInitialState,
} from '@/app/(shared)/stores/home-store';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import Image from 'next/image';

// 통신사 카테고리 (기존)
const displayCategories = ['SKT', 'KT', 'LGU+'] as const;

// 거래 상태 매핑 (스토어 TransactionStatus 타입에 맞춤)
const transactionOptions = [
  { label: '모든 거래', value: 'ALL' as const },
  { label: '거래 전', value: 'SELLING' as const },
  { label: '거래 완료', value: 'SOLD_OUT' as const },
];

// 가격 레이블 (기존)
const price_ranges = [
  '모든 가격',
  '₩ 0 - 999',
  '₩ 1,000 - 1,499',
  '₩ 1,500 - 1,999',
  '₩ 2,000 - 2,499',
  '₩ 2,500+',
] as const;

// 레이블 → 스토어 PriceRange 타입 매핑
const priceValueMap: Record<
  (typeof price_ranges)[number],
  'ALL' | 'P0_999' | 'P1000_1499' | 'P1500_1999' | 'P2000_2499' | 'P2500_PLUS'
> = {
  '모든 가격': 'ALL',
  '₩ 0 - 999': 'P0_999',
  '₩ 1,000 - 1,499': 'P1000_1499',
  '₩ 1,500 - 1,999': 'P1500_1999',
  '₩ 2,000 - 2,499': 'P2000_2499',
  '₩ 2,500+': 'P2500_PLUS',
};

export const Filter = () => {
  const {
    isFilterOpen,
    actions,
    category,
    transactionStatus,
    priceRanges,
    showRegularsOnly,
  } = useHomeStore();

  const isChanged =
    category !== homeInitialState.category ||
    transactionStatus !== homeInitialState.transactionStatus ||
    JSON.stringify(priceRanges) !==
      JSON.stringify(homeInitialState.priceRanges) ||
    showRegularsOnly !== homeInitialState.showRegularsOnly;

  // 적용하기 시 refetch 트리거 + 모달 닫기
  const closeAndApply = () => {
    actions.triggerRefetch();
    actions.toggleFilter();
  };

  const FilterView = ({ isMobile = false }) => (
    <div className="flex flex-col max-h-[85vh] md:w-[288px] md:h-[729px] bg-white md:max-h-full md:rounded-2xl shadow-light">
      {/* 헤더 */}
      <div className="flex-shrink-0 flex items-center justify-between pt-6 px-6 md:pt-5 md:px-5">
        <h2 className="text-heading-lg md:text-medium-xl font-bold flex items-center gap-2">
          <Image
            src="/filter.svg"
            alt="필터"
            width={24}
            height={24}
            className="hidden md:block"
          />
          필터
        </h2>
        {isMobile && (
          <button
            onClick={actions.toggleFilter}
            className="p-2"
            aria-label="필터 닫기"
          >
            <Image src="/close.svg" alt="필터 닫기" width={24} height={24} />
          </button>
        )}
      </div>

      {/* 본문 */}
      <div className="flex-grow overflow-y-auto p-4 space-y-6 scrollbar-hide ">
        {/* 카테고리 */}
        <div className="space-y-3">
          <h3 className="text-regular-md md:text-medium-md text-midnight-black">
            카테고리
          </h3>
          <div className="flex flex-wrap gap-2 md:flex-col md:items-start md:gap-3">
            {displayCategories.map((item) => {
              const isSelected = category === item;
              return (
                <button
                  key={item}
                  onClick={() => actions.setCategory(isSelected ? null : item)}
                  className={`px-2 py-2 text-regular-sm md:text-medium-sm w-[95px] h-[40px] rounded-[10px] border transition-colors md:w-auto md:h-auto md:p-0 md:border-none md:bg-transparent md:rounded-none ${
                    isSelected
                      ? 'bg-teal-green text-white border-teal-green font-semibold md:bg-transparent md:text-midnight-black md:font-bold md:underline'
                      : 'bg-white text-gray-700 hover:bg-gray-50 md:text-gray-500 md:hover:bg-transparent'
                  }`}
                >
                  {item}
                </button>
              );
            })}
          </div>
        </div>

        {/* 거래 상태 */}
        <div className="space-y-3">
          <h3 className="text-regular-md md:text-medium-md text-midnight-black">
            거래 상태
          </h3>
          <div className="flex flex-wrap gap-2 md:flex-col md:items-start md:gap-3">
            {transactionOptions.map((option) => {
              const isSelected = transactionStatus === option.value;
              return (
                <button
                  key={option.value}
                  onClick={() => actions.setTransactionStatus(option.value)}
                  className={`px-2 py-2 text-regular-sm w-[95px] h-[40px] rounded-lg border transition-colors md:w-auto md:h-auto md:p-0 md:border-none md:bg-transparent md:rounded-none ${
                    isSelected
                      ? 'bg-teal-green text-white border-teal-green font-semibold md:bg-transparent md:text-midnight-black md:font-bold md:underline'
                      : 'bg-white text-gray-700 hover:bg-gray-50 md:text-gray-500 md:hover:bg-transparent'
                  }`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* 단골만 보기 */}
        <div className="space-y-3">
          <h3 className="text-regular-md md:text-medium-md text-midnight-black">
            판매자 필터
          </h3>
          <label className="flex items-center justify-between cursor-pointer p-1">
            <span className="text-gray-500 md:text-medium-sm text-medium-sm">
              단골만 보기
            </span>
            <input
              type="checkbox"
              checked={showRegularsOnly}
              onChange={actions.toggleShowRegularsOnly}
              className="h-6 w-6 rounded border-gray-300 text-teal-green cursor-pointer focus:ring-teal-green"
            />
          </label>
        </div>

        {/* 가격 */}
        <div className="space-y-3">
          <h3 className="text-regular-md md:text-medium-md text-midnight-black">
            가격
          </h3>
          <div className="space-y-2">
            {price_ranges.map((item) => {
              const value = priceValueMap[item];
              return (
                <label
                  key={item}
                  className="flex items-center space-x-3 cursor-pointer p-1"
                >
                  <span className="text-gray-500 mr-auto md:text-medium-sm text-medium-sm">
                    {item}
                  </span>
                  <input
                    type="checkbox"
                    checked={priceRanges.includes(value)}
                    onChange={() => actions.togglePriceRange(value)}
                    className="h-6 w-6 rounded border-gray-300 text-teal-green cursor-pointer focus:ring-teal-green"
                  />
                </label>
              );
            })}
          </div>
        </div>
      </div>

      {/* 푸터 */}
      <div className="flex-shrink-0 grid grid-cols-2 gap-4 p-4 ">
        <button
          onClick={actions.resetFilters}
          className="px-4 py-3 bg-gray-100 rounded-lg font-bold text-gray-800 hover:bg-gray-200 md:bg-transparent md:border md:border-gray-400 md:text-gray-400"
        >
          전체 해제
        </button>
        <button
          onClick={closeAndApply}
          disabled={!isChanged}
          className={`px-2 py-3 rounded-lg font-bold transition-colors ${
            isChanged
              ? 'bg-teal-green md:bg-gray-800 text-white hover:bg-gray-500 '
              : 'bg-gray-200 text-gray-500 cursor-not-allowed md:bg-transparent md:border md:border-gray-400 md:text-gray-400'
          }`}
        >
          적용하기
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* PC 사이드바 */}
      <div className="hidden md:block md:w-72 lg:w-80 md:flex-shrink-0 ">
        <FilterView />
      </div>

      {/* 모바일 모달 */}
      <Transition appear show={isFilterOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-40 md:hidden"
          onClose={actions.toggleFilter}
        >
          <div className="fixed inset-0 bg-midnight-black bg-opacity-50" />

          <div className="fixed inset-0 flex items-center justify-center p-4">
            <div className="w-full max-w-sm transform overflow-hidden rounded-2xl bg-white shadow-xl transition-all">
              <FilterView isMobile />
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};
