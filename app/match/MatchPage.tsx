'use client';

import React, { useState, useMemo } from 'react';
import { Header } from '../(shared)/components/Header';
import { Footer } from '../(shared)/components/Footer';
import FilterSection from './components/FilterSection';
import ResultSection from './components/ResultSection';

interface Filters {
  transactionType: string[];
  carrier: string[];
  dataAmount: string[];
  price: string[];
}

interface User {
  id: number;
  type: 'buyer' | 'seller';
  name: string;
  carrier: string;
  data: string;
  price: string;
}

// 샘플 유저 데이터
const allUsers: User[] = [
  {
    id: 1,
    type: 'buyer',
    name: 'user04',
    carrier: 'SKT',
    data: '1GB',
    price: '1,500원',
  },
  {
    id: 2,
    type: 'buyer',
    name: 'user02',
    carrier: 'SKT',
    data: '1GB',
    price: '1,400원',
  },
  {
    id: 3,
    type: 'seller',
    name: 'user07',
    carrier: 'KT',
    data: '2GB',
    price: '2,000원',
  },
  {
    id: 4,
    type: 'seller',
    name: 'user10',
    carrier: 'LG U+',
    data: '1GB',
    price: '1,200원',
  },
  {
    id: 5,
    type: 'buyer',
    name: 'user15',
    carrier: 'KT',
    data: '1GB',
    price: '1,600원',
  },
];

export default function MatchPage() {
  const [pendingFilters, setPendingFilters] = useState<Filters>({
    transactionType: [],
    carrier: [],
    dataAmount: [],
    price: [],
  });

  const [appliedFilters, setAppliedFilters] = useState<Filters>({
    transactionType: [],
    carrier: [],
    dataAmount: [],
    price: [],
  });

  // 필터링된 유저 목록 (appliedFilters 사용)
  const filteredUsers = useMemo(() => {
    // 초기화 상태인지 확인
    if (appliedFilters.transactionType.includes('__RESET__')) {
      return [];
    }

    return allUsers.filter((user) => {
      // 거래 방식 필터
      if (appliedFilters.transactionType.length > 0) {
        const userType = user.type === 'buyer' ? '구매자' : '판매자';
        if (!appliedFilters.transactionType.includes(userType)) {
          return false;
        }
      }

      // 통신사 필터
      if (appliedFilters.carrier.length > 0) {
        if (!appliedFilters.carrier.includes(user.carrier)) {
          return false;
        }
      }

      // 데이터량 필터
      if (appliedFilters.dataAmount.length > 0) {
        const userData = user.data;
        const matchesDataFilter = appliedFilters.dataAmount.some((filter) => {
          if (filter === '1GB 미만') return userData === '1GB';
          if (filter === '1GB 이상')
            return userData === '1GB' || userData === '2GB';
          if (filter === '2GB 이상') return userData === '2GB';
          return false;
        });
        if (!matchesDataFilter) return false;
      }

      // 가격 필터
      if (appliedFilters.price.length > 0) {
        const userPrice = parseInt(user.price.replace(/[^0-9]/g, ''));
        const matchesPriceFilter = appliedFilters.price.some((filter) => {
          if (filter === '0 - 999') return userPrice >= 0 && userPrice <= 999;
          if (filter === '1,000 - 1,499')
            return userPrice >= 1000 && userPrice <= 1499;
          if (filter === '1,500 - 1,999')
            return userPrice >= 1500 && userPrice <= 1999;
          if (filter === '2,000 - 2,499')
            return userPrice >= 2000 && userPrice <= 2499;
          if (filter === '2,500 이상') return userPrice >= 2500;
          return false;
        });
        if (!matchesPriceFilter) return false;
      }

      return true;
    });
  }, [appliedFilters]);

  const handleFilterChange = (filters: Filters) => {
    setPendingFilters(filters);
    console.log('Filters changed (pending):', filters);
  };

  const handleApplyFilters = () => {
    setAppliedFilters(pendingFilters);
    console.log('Filters applied:', pendingFilters);
  };

  const handleResetFilters = () => {
    const emptyFilters = {
      transactionType: [],
      carrier: [],
      dataAmount: [],
      price: [],
    };
    setPendingFilters(emptyFilters);
    // 초기화할 때는 appliedFilters를 비워서 결과를 숨김
    setAppliedFilters({
      transactionType: ['__RESET__'], // 특별한 값으로 초기화 상태 표시
      carrier: [],
      dataAmount: [],
      price: [],
    });
    console.log('Filters reset');
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-1">
        <FilterSection
          onFilterChange={handleFilterChange}
          onApply={handleApplyFilters}
          onReset={handleResetFilters}
          currentFilters={pendingFilters}
        />
        <ResultSection users={filteredUsers} />
      </main>
      <Footer />
    </div>
  );
}
