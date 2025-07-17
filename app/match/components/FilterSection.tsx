'use client';

import React, { useState, useEffect } from 'react';
import FilterGroup from './FilterGroup';
import FilterButtons from './FilterButtons';
import { Filters } from '../types';

interface FilterSectionProps {
  onFilterChange?: (filters: Filters) => void;
  onApply?: () => void;
  onReset?: () => void;
  currentFilters?: Filters;
  title?: string;
}

export default function FilterSection({
  onFilterChange,
  onApply,
  onReset,
  currentFilters,
  title = '실시간 매칭 조건을 선택해주세요',
}: FilterSectionProps) {
  const [selectedFilters, setSelectedFilters] = useState<Filters>(
    currentFilters || {
      transactionType: [],
      carrier: [],
      dataAmount: [],
      price: [],
    }
  );

  const handleFilterChange = (
    category: string,
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

  // currentFilters가 변경될 때 selectedFilters 업데이트
  useEffect(() => {
    if (currentFilters) {
      setSelectedFilters(currentFilters);
    }
  }, [currentFilters]);

  // 필터 옵션 데이터
  const filterOptions = {
    transactionType: [
      { value: '판매자', label: '판매자' },
      { value: '구매자', label: '구매자' },
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

  return (
    <section className="bg-gradient-to-b from-green-900 to-black text-white py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-center mb-8">{title}</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <FilterGroup
            title="거래 방식"
            options={filterOptions.transactionType}
            selectedValues={selectedFilters.transactionType}
            onValueChange={(value) =>
              handleFilterChange('transactionType', value, false)
            }
            multiSelect={false}
          />

          <FilterGroup
            title="통신사"
            options={filterOptions.carrier}
            selectedValues={selectedFilters.carrier}
            onValueChange={(value) =>
              handleFilterChange('carrier', value, false)
            }
            multiSelect={false}
          />

          <FilterGroup
            title="데이터량"
            options={filterOptions.dataAmount}
            selectedValues={selectedFilters.dataAmount}
            onValueChange={(value) =>
              handleFilterChange('dataAmount', value, true)
            }
            multiSelect={true}
          />

          <FilterGroup
            title="가격"
            options={filterOptions.price}
            selectedValues={selectedFilters.price}
            onValueChange={(value) => handleFilterChange('price', value, true)}
            multiSelect={true}
          />
        </div>

        <FilterButtons onReset={resetFilters} onApply={applyFilters} />
      </div>
    </section>
  );
}
