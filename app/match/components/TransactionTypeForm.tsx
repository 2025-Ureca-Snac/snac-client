'use client';

import React from 'react';
import FilterGroup from './filter/FilterGroup';
import FilterButtons from './filter/FilterButtons';
import { Filters } from '../types';
import { SellerRegistrationInfo } from './FilterSection';
import CarrierSelect from './seller/CarrierSelect';
import DataAmountInput from './seller/DataAmountInput';
import PriceInput from './seller/PriceInput';
import SellerStatusToggle from './seller/SellerStatusToggle';

interface FilterOptionData {
  value: string;
  label: string;
  disabled?: boolean;
}

interface TransactionTypeFormProps {
  transactionType: '구매자' | '판매자' | '';
  filterOptions: {
    carrier: FilterOptionData[];
    dataAmount: FilterOptionData[];
    price: FilterOptionData[];
  };
  selectedFilters: Filters;
  onFilterChange: (
    category: keyof Filters,
    value: string,
    multiSelect?: boolean
  ) => void;
  onReset: () => void;
  onApply: () => void;
  // 판매자 관련 props
  sellerInfo?: SellerRegistrationInfo;
  onSellerInfoChange?: (
    field: keyof SellerRegistrationInfo,
    value: string | number | boolean
  ) => void;
  onToggleSellerStatus?: () => void;
}

export default function TransactionTypeForm({
  transactionType,
  filterOptions,
  selectedFilters,
  onFilterChange,
  onReset,
  onApply,
  sellerInfo,
  onSellerInfoChange,
  onToggleSellerStatus,
}: TransactionTypeFormProps) {
  const isBuyer = transactionType === '구매자';
  const isSeller = transactionType === '판매자';

  if (isBuyer) {
    return (
      <>
        <FilterGroup
          title="통신사"
          options={filterOptions.carrier}
          selectedValues={selectedFilters.carrier}
          onValueChange={(value) => onFilterChange('carrier', value, false)}
          multiSelect={false}
        />

        <FilterGroup
          title="데이터량"
          options={filterOptions.dataAmount}
          selectedValues={selectedFilters.dataAmount}
          onValueChange={(value) => onFilterChange('dataAmount', value, true)}
          multiSelect={true}
        />

        <FilterGroup
          title="가격"
          options={filterOptions.price}
          selectedValues={selectedFilters.price}
          onValueChange={(value) => onFilterChange('price', value, false)}
          multiSelect={false}
        />

        <FilterButtons onReset={onReset} onApply={onApply} />
      </>
    );
  }

  if (isSeller && sellerInfo && onSellerInfoChange && onToggleSellerStatus) {
    const isSellingActive = sellerInfo.isActive;

    return (
      <div className="space-y-6">
        {/* 통신사 선택 */}
        <CarrierSelect
          value={sellerInfo.carrier}
          onChange={(value) => onSellerInfoChange('carrier', value)}
          disabled={isSellingActive}
        />

        {/* 데이터량 입력 */}
        <DataAmountInput
          value={sellerInfo.dataAmount}
          onChange={(value) => onSellerInfoChange('dataAmount', value)}
          disabled={isSellingActive}
        />

        {/* 가격 입력 */}
        <PriceInput
          value={sellerInfo.price}
          onChange={(value) => onSellerInfoChange('price', value)}
          disabled={isSellingActive}
        />

        {/* 판매 상태 토글 */}
        <SellerStatusToggle
          sellerInfo={sellerInfo}
          onToggle={onToggleSellerStatus}
        />
      </div>
    );
  }

  return null;
}
