'use client';

import React, { useState } from 'react';
import CategoryFilter from './CategoryFilter';
import UserList from './UserList';
import LoadingSpinner from '@/app/(shared)/components/LoadingSpinner';

interface User {
  id: number;
  type: 'buyer' | 'seller';
  name: string;
  carrier: string;
  data: string;
  price: string;
}

interface ResultSectionProps {
  users?: User[];
  isLoading?: boolean;
  onUserClick?: (user: User) => void;
}

const categories = [
  { id: 'all', label: '모두 보기' },
  { id: 'seller', label: '판매자' },
  { id: 'buyer', label: '구매자' },
];

const defaultUsers: User[] = [
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
];

export default function ResultSection({
  users = defaultUsers,
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
    <section className="bg-white py-8 px-6">
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
