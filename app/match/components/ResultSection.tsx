'use client';

import React, { useState } from 'react';

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
}: ResultSectionProps) {
  const [activeCategory, setActiveCategory] = useState('all');

  const filteredUsers =
    activeCategory === 'all'
      ? users
      : users.filter((user) => user.type === activeCategory);

  return (
    <section className="bg-white py-8 px-6">
      <div className="max-w-4xl mx-auto">
        {/* 카테고리 필터 */}
        <div className="flex border-b border-gray-200 mb-6">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeCategory === cat.id
                  ? 'border-green-600 text-black'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* 유저 리스트 */}
        <div className="space-y-4">
          {filteredUsers.map((user) => (
            <div
              key={user.id}
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <div className="flex items-center space-x-4">
                <button
                  className={`px-4 py-2 rounded-lg text-white font-medium ${
                    user.type === 'buyer' ? 'bg-green-500' : 'bg-pink-500'
                  }`}
                >
                  {user.type === 'buyer' ? '구매' : '판매'}
                </button>
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 rounded-full bg-amber-600"></div>
                  <span className="font-medium">{user.name}</span>
                  <span className="text-gray-500">|</span>
                  <span>
                    {user.carrier} | {user.data} | {user.price}
                  </span>
                </div>
              </div>
              <svg
                className="w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          ))}

          {/* 로딩 스피너 */}
          {isLoading && (
            <div className="flex justify-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
