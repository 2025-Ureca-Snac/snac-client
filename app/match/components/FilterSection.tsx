'use client';

import React, { useState, useEffect } from 'react';
import FilterGroup from './filter/FilterGroup';
import TransactionTypeForm from './TransactionTypeForm';
import { Filters } from '../types';

interface FilterSectionProps {
  onFilterChange?: (filters: Filters) => void;
  onApply?: () => void;
  onReset?: () => void;
  currentFilters?: Filters;
  title?: string;
  // 판매자 등록 관련 props 추가
  onSellerInfoChange?: (info: SellerRegistrationInfo) => void;
  onToggleSellerStatus?: () => void;
  sellerInfo?: SellerRegistrationInfo;
}

export interface SellerRegistrationInfo {
  dataAmount: number;
  price: number;
  carrier: string;
  isActive: boolean;
}

// 필터 옵션 데이터
const FILTER_OPTIONS = {
  transactionType: [
    { value: '구매자', label: '구매자' },
    { value: '판매자', label: '판매자' },
  ],
  carrier: [
    { value: 'SKT', label: 'SKT' },
    { value: 'KT', label: 'KT' },
    { value: 'LG U+', label: 'LG U+' },
  ],
  dataAmount: [
    { value: '1GB 미만', label: '1GB 미만' },
    { value: '1GB 이상', label: '1GB 이상' },
    { value: '2GB 이상', label: '2GB 이상' },
  ],
  price: [
    { value: '0 - 999', label: '0 - 999' },
    { value: '1,000 - 1,499', label: '1,000 - 1,499' },
    { value: '1,500 - 1,999', label: '1,500 - 1,999' },
    { value: '2,000 - 2,499', label: '2,000 - 2,499' },
    { value: '2,500 이상', label: '2,500 이상' },
  ],
};

export default function FilterSection({
  onFilterChange,
  onApply,
  onReset,
  currentFilters,
  title = '실시간 매칭 조건을 선택해주세요',
  onSellerInfoChange,
  onToggleSellerStatus,
  sellerInfo,
}: FilterSectionProps) {
  const [selectedFilters, setSelectedFilters] = useState<Filters>(
    currentFilters || {
      transactionType: [],
      carrier: [],
      dataAmount: [],
      price: [],
    }
  );

  // 현재 선택된 거래 방식
  const currentTransactionType = selectedFilters.transactionType[0] || '';
  const isBuyer = currentTransactionType === '구매자';
  const isSeller = currentTransactionType === '판매자';

  // 판매자 등록 정보 (내부 상태)
  const [internalSellerInfo, setInternalSellerInfo] =
    useState<SellerRegistrationInfo>(
      sellerInfo || {
        dataAmount: 1,
        price: 1500,
        carrier: 'SKT',
        isActive: false,
      }
    );

  const handleFilterChange = (
    category: keyof Filters,
    value: string,
    multiSelect: boolean = true
  ) => {
    let newValues: string[];

    if (multiSelect) {
      // 다중선택: 기존 로직
      newValues = selectedFilters[
        category as keyof typeof selectedFilters
      ].includes(value)
        ? selectedFilters[category as keyof typeof selectedFilters].filter(
            (item) => item !== value
          )
        : [...selectedFilters[category as keyof typeof selectedFilters], value];
    } else {
      // 단일선택: 새로운 값으로 교체
      newValues = [value];
    }

    const newFilters = {
      ...selectedFilters,
      [category]: newValues,
    };

    setSelectedFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  const resetFilters = () => {
    const emptyFilters = {
      transactionType: [],
      carrier: [],
      dataAmount: [],
      price: [],
    };
    setSelectedFilters(emptyFilters);
    onFilterChange?.(emptyFilters);
    onReset?.();
  };

  const applyFilters = () => {
    onFilterChange?.(selectedFilters);
    onApply?.();
  };

  // 판매자 정보 변경 핸들러
  const handleSellerInfoChange = (
    field: keyof SellerRegistrationInfo,
    value: string | number | boolean
  ) => {
    const newInfo = {
      ...internalSellerInfo,
      [field]: value,
    };
    setInternalSellerInfo(newInfo);
    onSellerInfoChange?.(newInfo);
  };

  const handleToggleSellerStatus = () => {
    const newInfo = {
      ...internalSellerInfo,
      isActive: !internalSellerInfo.isActive,
    };
    setInternalSellerInfo(newInfo);
    onSellerInfoChange?.(newInfo);
    onToggleSellerStatus?.();
  };

  // currentFilters가 변경될 때 selectedFilters 업데이트
  useEffect(() => {
    if (currentFilters) {
      setSelectedFilters(currentFilters);
    }
  }, [currentFilters]);

  // sellerInfo가 변경될 때 내부 상태 업데이트
  useEffect(() => {
    if (sellerInfo) {
      setInternalSellerInfo(sellerInfo);
    }
  }, [sellerInfo]);

  return (
    <section className="bg-gradient-to-b from-green-900 to-black text-white py-16 px-6">
      <div className="max-w-[524px] mx-auto">
        {/* 실시간 매칭 상태 표시 */}
        <div className="flex items-center justify-center mb-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm text-green-400 font-medium">
              실시간 매칭 활성화
            </span>
          </div>
        </div>

        <h1 className="text-2xl md:text-3xl font-semibold text-center mb-6 text-white">
          {title}
        </h1>

        <div className="space-y-6">
          {/* 거래 방식 선택은 항상 표시 */}
          <FilterGroup
            title="거래 방식"
            options={FILTER_OPTIONS.transactionType}
            selectedValues={selectedFilters.transactionType}
            onValueChange={(value) =>
              handleFilterChange('transactionType', value, false)
            }
            multiSelect={false}
          />

          {/* 거래 방식에 따른 폼 */}
          <TransactionTypeForm
            transactionType={currentTransactionType as '구매자' | '판매자' | ''}
            filterOptions={{
              carrier: FILTER_OPTIONS.carrier,
              dataAmount: FILTER_OPTIONS.dataAmount,
              price: FILTER_OPTIONS.price,
            }}
            selectedFilters={selectedFilters}
            onFilterChange={handleFilterChange}
            onReset={resetFilters}
            onApply={applyFilters}
            sellerInfo={internalSellerInfo}
            onSellerInfoChange={handleSellerInfoChange}
            onToggleSellerStatus={handleToggleSellerStatus}
          />

          {/* 거래 방식을 선택하지 않았을 때 */}
          {!isBuyer && !isSeller && (
            <div className="text-center py-8">
              <p className="text-gray-300">거래 방식을 선택해주세요</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
