'use client';

import React, { useState } from 'react';
import CategoryFilter from './CategoryFilter';
import UserList from './UserList';
import LoadingSpinner from '@/app/(shared)/components/LoadingSpinner';
import { User, CategoryOption } from '../types';

interface ResultSectionProps {
  users: User[];
  isLoading?: boolean;
  onUserClick?: (user: User) => void;
}

const categories: CategoryOption[] = [
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
    <section className="bg-white py-8 px-6 min-h-[30vh]">
      <div className="max-w-4xl mx-auto">
        <CategoryFilter
          categories={categories}
          activeCategory={activeCategory}
          onCategoryChange={handleCategoryChange}
        />

        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <UserList users={filteredUsers} onUserClick={onUserClick} />
        )}
      </div>
    </section>
  );
}
