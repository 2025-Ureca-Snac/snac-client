'use client';

import { useHomeStore } from '@/app/(shared)/stores/home-store';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import Image from 'next/image';

const DISPLAY_CATEGORIES = ['SKT', 'KT', 'LGU+'] as const;

const transactionOptions = [
  { label: '모든 거래', value: 'ALL' as const },
  { label: '거래 전', value: 'SELLING' as const },
  { label: '거래 완료', value: 'SOLD_OUT' as const },
];

const price_ranges = [
  '모든 가격',
  '1,000원 이하',
  '1,500원 이하',
  '2,000원 이하',
  '2,500원 이하',
] as const;

const PRICE_VALUE_MAP: Record<
  (typeof price_ranges)[number],
  'ALL' | 'P0_1000' | 'P0_1500' | 'P0_2000' | 'P0_2500'
> = {
  '모든 가격': 'ALL',
  '1,000원 이하': 'P0_1000',
  '1,500원 이하': 'P0_1500',
  '2,000원 이하': 'P0_2000',
  '2,500원 이하': 'P0_2500',
};

export const Filter = () => {
  const { isFilterOpen, actions, category, transactionStatus, priceRange } =
    useHomeStore();

  // 필터가 실제로 변경되었는지 확인

  const closeAndApply = () => {
    actions.triggerRefetch();
    actions.toggleFilter();
  };

  return (
    <>
      {/* PC 사이드바 */}
      <div className="hidden md:block md:w-72 lg:w-80 md:flex-shrink-0">
        <div className="flex flex-col max-h-[85vh] md:w-[288px] md:h-[729px] bg-white md:max-h-full md:rounded-2xl shadow-light">
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
          </div>

          <div className="flex-grow overflow-y-auto p-4 space-y-6 scrollbar-hide">
            <div className="space-y-3">
              <h3 className="text-regular-md md:text-medium-md text-midnight-black">
                카테고리
              </h3>
              <div className="flex flex-wrap gap-2 md:flex-col md:items-start md:gap-3">
                {DISPLAY_CATEGORIES.map((item) => {
                  const isSelected = category === item;
                  return (
                    <button
                      key={item}
                      onClick={() =>
                        actions.setCategory(isSelected ? null : item)
                      }
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

            <div className="space-y-3">
              <h3 className="text-regular-md md:text-medium-md text-midnight-black">
                가격
              </h3>
              <div className="space-y-2">
                {price_ranges.map((item) => {
                  const value = PRICE_VALUE_MAP[item];
                  return (
                    <label
                      key={item}
                      className="flex items-center space-x-3 cursor-pointer p-1"
                    >
                      <span className="text-gray-500 mr-auto md:text-medium-sm text-medium-sm">
                        {item}
                      </span>
                      <input
                        type="radio"
                        name="priceRange"
                        checked={priceRange === value}
                        onChange={() => actions.setPriceRange(value)}
                        className="h-6 w-6 border-gray-300 text-teal-green cursor-pointer focus:ring-teal-green"
                      />
                    </label>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="flex-shrink-0 grid grid-cols-2 gap-4 p-4">
            <button
              onClick={actions.resetFilters}
              className="px-4 py-3 bg-gray-100 rounded-lg font-bold text-gray-800 hover:bg-gray-200 md:bg-transparent md:border md:border-gray-400 md:text-gray-400"
            >
              전체 해제
            </button>
            <button
              onClick={closeAndApply}
              className="px-2 py-3 rounded-lg font-bold transition-colors bg-teal-green md:bg-gray-800 text-white hover:bg-gray-500"
            >
              적용하기
            </button>
          </div>
        </div>
      </div>

      {/* 모바일 모달 */}
      {isFilterOpen && (
        <Transition appear show={isFilterOpen} as={Fragment}>
          <Dialog
            as="div"
            className="relative z-40 md:hidden"
            onClose={actions.toggleFilter}
          >
            <div className="fixed inset-0 bg-midnight-black bg-opacity-50" />

            <div className="fixed inset-0 flex items-center justify-center p-4">
              <div className="w-full max-w-sm transform overflow-hidden rounded-2xl bg-white shadow-xl transition-all">
                <div className="flex flex-col max-h-[85vh] bg-white">
                  <div className="flex-shrink-0 flex items-center justify-between pt-6 px-6">
                    <h2 className="text-heading-lg font-bold flex items-center gap-2">
                      필터
                    </h2>
                    <button
                      onClick={actions.toggleFilter}
                      className="p-2"
                      aria-label="필터 닫기"
                    >
                      <Image
                        src="/close.svg"
                        alt="필터 닫기"
                        width={24}
                        height={24}
                      />
                    </button>
                  </div>

                  <div className="flex-grow overflow-y-auto p-4 space-y-6 scrollbar-hide">
                    <div className="space-y-3">
                      <h3 className="text-regular-md text-midnight-black">
                        카테고리
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {DISPLAY_CATEGORIES.map((item) => {
                          const isSelected = category === item;
                          return (
                            <button
                              key={item}
                              onClick={() =>
                                actions.setCategory(isSelected ? null : item)
                              }
                              className={`px-2 py-2 text-regular-sm w-[95px] h-[40px] rounded-[10px] border transition-colors ${
                                isSelected
                                  ? 'bg-teal-green text-white border-teal-green font-semibold'
                                  : 'bg-white text-gray-700 hover:bg-gray-50'
                              }`}
                            >
                              {item}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h3 className="text-regular-md text-midnight-black">
                        거래 상태
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {transactionOptions.map((option) => {
                          const isSelected = transactionStatus === option.value;
                          return (
                            <button
                              key={option.value}
                              onClick={() =>
                                actions.setTransactionStatus(option.value)
                              }
                              className={`px-2 py-2 text-regular-sm w-[95px] h-[40px] rounded-lg border transition-colors ${
                                isSelected
                                  ? 'bg-teal-green text-white border-teal-green font-semibold'
                                  : 'bg-white text-gray-700 hover:bg-gray-50'
                              }`}
                            >
                              {option.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h3 className="text-regular-md text-midnight-black">
                        가격
                      </h3>
                      <div className="space-y-2">
                        {price_ranges.map((item) => {
                          const value = PRICE_VALUE_MAP[item];
                          return (
                            <label
                              key={item}
                              className="flex items-center space-x-3 cursor-pointer p-1"
                            >
                              <span className="text-gray-500 mr-auto text-medium-sm">
                                {item}
                              </span>
                              <input
                                type="radio"
                                name="priceRange"
                                checked={priceRange === value}
                                onChange={() => actions.setPriceRange(value)}
                                className="h-6 w-6 border-gray-300 text-teal-green cursor-pointer focus:ring-teal-green"
                              />
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="flex-shrink-0 grid grid-cols-2 gap-4 p-4">
                    <button
                      onClick={actions.resetFilters}
                      className="px-4 py-3 bg-gray-100 rounded-lg font-bold text-gray-800 hover:bg-gray-200"
                    >
                      전체 해제
                    </button>
                    <button
                      onClick={closeAndApply}
                      className="px-2 py-3 rounded-lg font-bold transition-colors bg-teal-green text-white hover:bg-gray-500"
                    >
                      적용하기
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </Dialog>
        </Transition>
      )}
    </>
  );
};
