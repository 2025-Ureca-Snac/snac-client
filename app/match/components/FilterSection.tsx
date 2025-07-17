'use client';

import React, { useState } from 'react';

interface Filters {
  transactionType: string[];
  carrier: string[];
  dataAmount: string[];
  price: string[];
}

interface FilterSectionProps {
  onFilterChange?: (filters: Filters) => void;
}

export default function FilterSection({ onFilterChange }: FilterSectionProps) {
  const [selectedFilters, setSelectedFilters] = useState<Filters>({
    transactionType: [],
    carrier: [],
    dataAmount: [],
    price: [],
  });

  const handleFilterChange = (category: string, value: string) => {
    const newFilters = {
      ...selectedFilters,
      [category]: selectedFilters[
        category as keyof typeof selectedFilters
      ].includes(value)
        ? selectedFilters[category as keyof typeof selectedFilters].filter(
            (item) => item !== value
          )
        : [...selectedFilters[category as keyof typeof selectedFilters], value],
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
  };

  return (
    <section className="bg-gradient-to-b from-green-900 to-black text-white py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-center mb-8">
          실시간 매칭 조건을 선택해주세요
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* 거래 방식 */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg">거래 방식</h3>
            <div className="space-y-2">
              {['판매자', '구매자'].map((type) => (
                <label
                  key={type}
                  className="flex items-center space-x-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedFilters.transactionType.includes(type)}
                    onChange={() => handleFilterChange('transactionType', type)}
                    className="w-4 h-4 text-green-600 bg-gray-700 rounded focus:ring-green-500"
                  />
                  <span className="text-sm">{type}</span>
                </label>
              ))}
            </div>
          </div>

          {/* 통신사 */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg">통신사</h3>
            <div className="space-y-2">
              {['SKT', 'KT', 'LG U+'].map((carrier) => (
                <label
                  key={carrier}
                  className="flex items-center space-x-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedFilters.carrier.includes(carrier)}
                    onChange={() => handleFilterChange('carrier', carrier)}
                    className="w-4 h-4 text-green-600 bg-gray-700 rounded focus:ring-green-500"
                  />
                  <span className="text-sm">{carrier}</span>
                </label>
              ))}
            </div>
          </div>

          {/* 데이터량 */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg">데이터량</h3>
            <div className="space-y-2">
              {['1GB 미만', '1GB 이상', '2GB 이상'].map((amount) => (
                <label
                  key={amount}
                  className="flex items-center space-x-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedFilters.dataAmount.includes(amount)}
                    onChange={() => handleFilterChange('dataAmount', amount)}
                    className="w-4 h-4 text-green-600 bg-gray-700 rounded focus:ring-green-500"
                  />
                  <span className="text-sm">{amount}</span>
                </label>
              ))}
            </div>
          </div>

          {/* 가격 */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg">가격</h3>
            <div className="space-y-2">
              {[
                '0 - 999',
                '1,000 - 1,499',
                '1,500 - 1,999',
                '2,000 - 2,499',
                '2,500 이상',
              ].map((price) => (
                <label
                  key={price}
                  className="flex items-center space-x-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedFilters.price.includes(price)}
                    onChange={() => handleFilterChange('price', price)}
                    className="w-4 h-4 text-green-600 bg-gray-700 rounded focus:ring-green-500"
                  />
                  <span className="text-sm">{price}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* 버튼들 */}
        <div className="flex justify-center gap-4 mt-8">
          <button
            onClick={resetFilters}
            className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            초기화
          </button>
          <button className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            검색/적용
          </button>
        </div>
      </div>
    </section>
  );
}
