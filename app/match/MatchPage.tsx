'use client';

import React from 'react';
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
  const handleFilterChange = (filters: Filters) => {
    // 여기서 실제 필터링 로직을 구현할 수 있습니다
    console.log('Filters changed:', filters);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-1">
        <FilterSection onFilterChange={handleFilterChange} />
        <ResultSection />
      </main>
      <Footer />
    </div>
  );
}
