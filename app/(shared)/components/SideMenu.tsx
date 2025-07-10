import React from 'react';

const menuItems = [
  '구매 정보',
  '판매 내역',
  '구매 내역',
  '단골 목록',
  '포인트',
];

export default function SideMenu() {
  return (
    <aside className="w-48 min-h-[600px] bg-white border-r border-gray-200 py-12 px-6 flex flex-col gap-2">
      <h2 className="text-lg font-bold mb-8">마이 페이지</h2>
      <nav className="flex flex-col gap-2">
        {menuItems.map((item) => (
          <button
            key={item}
            className="text-left py-2 px-2 rounded-lg hover:bg-gray-100 text-base font-medium text-gray-800"
          >
            {item}
          </button>
        ))}
      </nav>
    </aside>
  );
}
