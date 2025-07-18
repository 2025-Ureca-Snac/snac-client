'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

const menuItems = [
  '구매 정보',
  '판매 내역',
  '구매 내역',
  '단골 목록',
  '포인트',
];

interface SideMenuProps {
  onFavoriteClick?: () => void;
}

export default function SideMenu({ onFavoriteClick }: SideMenuProps) {
  const router = useRouter();

  const handleMenuClick = (item: string) => {
    if (item === '단골 목록') {
      onFavoriteClick?.();
    } else if (item === '포인트') {
      router.push('/mypage/point');
    } else if (item === '판매 내역') {
      router.push('/mypage/sales-history');
    } else if (item === '구매 내역') {
      router.push('/mypage/purchase-history');
    } else if (item === '구매 정보') {
      router.push('/mypage/purchase-history');
    }
  };

  return (
    <aside
      className="w-64 h-fit bg-white border border-gray-200 rounded-lg p-7 flex flex-col gap-1"
      style={{
        boxShadow:
          '0 2px 8px rgba(0, 0, 0, 0.08), 0 1px 4px rgba(0, 0, 0, 0.04)',
      }}
    >
      <button onClick={() => router.push('/mypage')} className="text-left">
        <h2 className="text-lg font-extrabold mb-5 text-black select-none hover:text-gray-700 transition-colors">
          마이 페이지
        </h2>
      </button>
      <nav className="flex flex-col gap-0">
        {menuItems.map((item) => (
          <button
            key={item}
            className="text-left py-2 px-2 rounded text-base font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
            onClick={() => handleMenuClick(item)}
            type="button"
          >
            {item}
          </button>
        ))}
      </nav>
    </aside>
  );
}
