'use client';

import React, { useState } from 'react';
import CategoryFilter from './CategoryFilter';
import UserList from './user/UserList';
import LoadingSpinner from '@/app/(shared)/components/LoadingSpinner';
import { User, CategoryOption } from '../types';

interface ResultSectionProps {
  users: User[];
  isLoading?: boolean;
  onUserClick?: (user: User) => void;
}

const CATEGORIES: CategoryOption[] = [
  { id: 'all', label: '모두 보기' },
  { id: 'seller', label: '판매자' },
  { id: 'buyer', label: '구매자' },
];

export default function ResultSection({
  users,
  isLoading = false,
  onUserClick,
}: ResultSectionProps) {
  const [activeCategory, setActiveCategory] = useState('all');

  const filteredUsers =
    activeCategory === 'all'
      ? users
      : users.filter((user) => user.type === activeCategory);

  const handleCategoryChange = (categoryId: string) => {
    setActiveCategory(categoryId);
  };

  return (
    <section className="relative bg-black py-8 px-6 min-h-[30vh] overflow-hidden">
      {/* 배경 글로우 효과 */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-green-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
        <div className="absolute bottom-1/3 left-1/3 w-48 h-48 bg-cyan-400 rounded-full mix-blend-multiply filter blur-3xl opacity-8 animate-pulse delay-1000"></div>
      </div>

      {/* 그리드 패턴 */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `linear-gradient(rgba(34, 197, 94, 0.3) 1px, transparent 1px),
                         linear-gradient(90deg, rgba(34, 197, 94, 0.3) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      ></div>

      <div className="relative max-w-4xl mx-auto">
        {/* 상단 글로우 라인 */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-green-400 to-transparent opacity-60 mb-6"></div>

        <CategoryFilter
          categories={CATEGORIES}
          activeCategory={activeCategory}
          onCategoryChange={handleCategoryChange}
        />

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            {/* 사이버펑크 스타일 로딩 */}
            <div className="relative">
              <div className="animate-spin rounded-full h-12 w-12 border-2 border-transparent border-t-green-400 border-r-cyan-400"></div>
              <div
                className="absolute inset-0 animate-spin rounded-full h-12 w-12 border-2 border-transparent border-b-purple-400 border-l-green-400"
                style={{
                  animationDirection: 'reverse',
                  animationDuration: '1.5s',
                }}
              ></div>
              <div className="absolute inset-2 bg-green-400/20 rounded-full animate-pulse"></div>
            </div>
          </div>
        ) : (
          <UserList users={filteredUsers} onUserClick={onUserClick} />
        )}

        {/* 하단 글로우 라인 */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-2/3 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-40 mt-6"></div>
      </div>
    </section>
  );
}
