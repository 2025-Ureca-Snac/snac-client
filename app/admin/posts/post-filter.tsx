import React from 'react';
export function PostFilters() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <input
        type="text"
        placeholder="제목 또는 내용으로 검색..."
        className="md:col-span-2 w-full py-2 px-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
      />
      <select className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-gray-500">
        <option>모든 카테고리</option>
        <option>마케팅</option>
        <option>데이터분석</option>
        <option>트렌드</option>
        <option>브랜딩</option>
        <option>소셜미디어</option>
        <option>고객경험</option>
        <option>콘텐츠마케팅</option>
        <option>SEO</option>
        <option>이메일마케팅</option>
      </select>
    </div>
  );
}
