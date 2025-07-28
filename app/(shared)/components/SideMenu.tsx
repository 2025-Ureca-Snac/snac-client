'use client';

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { menuItems, type MenuItem } from '../constants/side-menu-data';

/**
 * @author 이승우
 * @description 사이드 메뉴 컴포넌트{@link menuItems ( 구매 정보, 판매 내역, 신고 내역, 포인트 )}
 */
export default function SideMenu() {
  const router = useRouter();
  const pathname = usePathname();

  // 현재 활성 메뉴 아이템 확인
  const isActiveMenu = (item: MenuItem) => {
    return pathname === item.path;
  };

  // 메뉴 클릭 핸들러
  const handleMenuClick = (item: MenuItem) => {
    if (item.disabled) return;
    router.push(item.path);
  };

  return (
    <aside
      className="w-64 h-fit bg-white border border-gray-200 rounded-lg p-7 flex flex-col gap-1"
      style={{
        boxShadow:
          '0 2px 8px rgba(0, 0, 0, 0.08), 0 1px 4px rgba(0, 0, 0, 0.04)',
      }}
    >
      <button
        onClick={() => router.push('/mypage')}
        className="text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded px-2 py-1"
        aria-label="마이페이지 홈으로 이동"
      >
        <h2 className="text-lg font-extrabold mb-5 text-black select-none hover:text-gray-700 transition-colors">
          마이 페이지
        </h2>
      </button>
      <nav className="flex flex-col gap-0">
        {menuItems.map((item) => {
          const isActive = isActiveMenu(item);
          return (
            <button
              key={item.id}
              className={`text-left py-2 px-2 rounded text-base font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                isActive
                  ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-500'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              } ${item.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={() => handleMenuClick(item)}
              disabled={item.disabled}
              type="button"
              tabIndex={item.disabled ? -1 : 0}
              aria-label={`${item.label} 페이지로 이동`}
            >
              <div className="flex items-center justify-between">
                <span>{item.label}</span>
                {item.badge && (
                  <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                    {item.badge}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
