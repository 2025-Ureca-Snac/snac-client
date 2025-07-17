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
