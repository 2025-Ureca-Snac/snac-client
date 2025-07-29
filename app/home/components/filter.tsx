'use client';

import { useHomeStore } from '@/app/(shared)/stores/home-store';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import Image from 'next/image';
import FilterGroup from '@/app/(shared)/components/FilterGroup';
import FilterButtons from '@/app/(shared)/components/FilterButtons';

type Category = 'SKT' | 'KT' | 'LGU+';
type TransactionStatus = 'ALL' | 'SELLING' | 'SOLD_OUT';
type PriceRange = 'ALL' | 'P0_1000' | 'P0_1500' | 'P0_2000' | 'P0_2500';

const FILTER_OPTIONS = {
  category: [
    { value: 'SKT', label: 'SKT' },
    { value: 'KT', label: 'KT' },
    { value: 'LGU+', label: 'LGU+' },
  ],
  transactionStatus: [
    { value: 'ALL', label: '모든 거래' },
    { value: 'SELLING', label: '거래 전' },
    { value: 'SOLD_OUT', label: '거래 완료' },
  ],
  priceRange: [
    { value: 'ALL', label: '모든 가격' },
    { value: 'P0_1000', label: '1,000원 이하' },
    { value: 'P0_1500', label: '1,500원 이하' },
    { value: 'P0_2000', label: '2,000원 이하' },
    { value: 'P0_2500', label: '2,500원 이하' },
  ],
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
            <FilterGroup
              title="카테고리"
              options={FILTER_OPTIONS.category}
              selectedValues={category ? [category] : []}
              onValueChange={(value) =>
                actions.setCategory(
                  category === value ? null : (value as Category)
                )
              }
              variant="button"
            />

            <FilterGroup
              title="거래 상태"
              options={FILTER_OPTIONS.transactionStatus}
              selectedValues={transactionStatus ? [transactionStatus] : []}
              onValueChange={(value) =>
                actions.setTransactionStatus(value as TransactionStatus)
              }
              variant="button"
            />

            <FilterGroup
              title="가격"
              options={FILTER_OPTIONS.priceRange}
              selectedValues={priceRange ? [priceRange] : []}
              onValueChange={(value) =>
                actions.setPriceRange(value as PriceRange)
              }
              variant="radio"
            />
          </div>

          <FilterButtons
            onReset={actions.resetFilters}
            onApply={closeAndApply}
            variant="home"
          />
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
                    <FilterGroup
                      title="카테고리"
                      options={FILTER_OPTIONS.category}
                      selectedValues={category ? [category] : []}
                      onValueChange={(value) =>
                        actions.setCategory(
                          category === value ? null : (value as Category)
                        )
                      }
                      variant="button"
                    />

                    <FilterGroup
                      title="거래 상태"
                      options={FILTER_OPTIONS.transactionStatus}
                      selectedValues={
                        transactionStatus ? [transactionStatus] : []
                      }
                      onValueChange={(value) =>
                        actions.setTransactionStatus(value as TransactionStatus)
                      }
                      variant="button"
                    />

                    <FilterGroup
                      title="가격"
                      options={FILTER_OPTIONS.priceRange}
                      selectedValues={priceRange ? [priceRange] : []}
                      onValueChange={(value) =>
                        actions.setPriceRange(value as PriceRange)
                      }
                      variant="radio"
                    />
                  </div>

                  <FilterButtons
                    onReset={actions.resetFilters}
                    onApply={closeAndApply}
                    variant="home"
                  />
                </div>
              </div>
            </div>
          </Dialog>
        </Transition>
      )}
    </>
  );
};
