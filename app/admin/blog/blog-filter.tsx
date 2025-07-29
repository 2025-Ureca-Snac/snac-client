'use client';

import React, { useState } from 'react';

export function BlogFilters() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    '마케팅',
    '데이터분석',
    '트렌드',
    '브랜딩',
    '소셜미디어',
    '고객경험',
    '콘텐츠마케팅',
    'SEO',
    '이메일마케팅',
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <input
        type="text"
        placeholder="제목 또는 내용으로 검색..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="md:col-span-2 w-full py-2 px-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
      />
      <div>
        <label htmlFor="category-select" className="sr-only">
          카테고리 선택
        </label>
        <select
          id="category-select"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500"
        >
          <option value="all">모든 카테고리</option>

          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
