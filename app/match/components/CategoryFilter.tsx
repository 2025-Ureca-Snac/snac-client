'use client';

import React from 'react';
import { CategoryOption } from '../types';

interface CategoryFilterProps {
  categories: CategoryOption[];
  activeCategory: string;
  onCategoryChange: (categoryId: string) => void;
}

export default function CategoryFilter({
  categories,
  activeCategory,
  onCategoryChange,
}: CategoryFilterProps) {
  return (
    <div className="relative flex border-b border-gray-700/50 mb-6">
      {/* 배경 글로우 라인 */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent opacity-30"></div>

      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onCategoryChange(cat.id)}
          className={`relative px-6 py-3 text-lg md:text-2xl font-medium border-b-2 transition-all duration-300 group ${
            activeCategory === cat.id
              ? 'border-green-400 text-green-400 shadow-lg'
              : 'border-transparent text-gray-400 hover:text-cyan-400 hover:border-cyan-400/50'
          }`}
        >
          {/* 활성화된 버튼에 글로우 효과 */}
          {activeCategory === cat.id && (
            <div className="absolute inset-0 bg-green-400/5 rounded-t-lg"></div>
          )}

          {/* 호버 시 글로우 효과 */}
          <div className="absolute inset-0 bg-cyan-400/0 rounded-t-lg transition-all duration-300 group-hover:bg-cyan-400/5"></div>

          <span className="relative z-10">{cat.label}</span>

          {/* 활성화된 버튼에 추가 글로우 */}
          {activeCategory === cat.id && (
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-full h-px bg-green-400 animate-pulse"></div>
          )}
        </button>
      ))}
    </div>
  );
}
