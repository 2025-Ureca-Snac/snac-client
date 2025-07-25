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
    <div className="flex border-b border-gray-200 mb-6">
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onCategoryChange(cat.id)}
          className={`px-6 py-3 text-lg md:text-2xl font-medium border-b-2 transition-colors ${
            activeCategory === cat.id
              ? 'border-green-600 text-black'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          {cat.label}
        </button>
      ))}
    </div>
  );
}
