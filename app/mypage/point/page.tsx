'use client';

import { useState } from 'react';
import { useUserStore } from '@/app/(shared)/stores/user-store';
import SideMenu from '@/app/(shared)/components/SideMenu';
import Link from 'next/link';
import PointContent from './PointContent';

interface HistoryItem {
  id: number;
  description: string;
  amount: number;
  type: 'earned' | 'spent';
  date: string;
}

export default function PointPage() {
  const [activeTab, setActiveTab] = useState<'points' | 'money'>('points');
  const { profile } = useUserStore();

  const tabs = [
    { id: 'points', label: '포인트' },
    { id: 'money', label: '머니' },
  ];

  const pointsHistory = [
    {
      id: 1,
      type: 'earned',
      amount: 2,
      description: '출석체크',
      date: '2025.07.03',
    },
    {
      id: 2,
      type: 'spent',
      amount: -100,
      description: 'KT 1GB 구매',
      date: '2025.07.03',
    },
    {
      id: 3,
      type: 'earned',
      amount: 2,
      description: '출석체크',
      date: '2025.07.03',
    },
    {
      id: 4,
      type: 'earned',
      amount: 200,
      description: '가입환영 포인트',
      date: '2025.07.03',
    },
  ];

  const moneyHistory = [
    {
      id: 1,
      type: 'earned',
      amount: 2000,
      description: 'SKT 2GB 판매',
      date: '2025.07.03',
    },
    {
      id: 2,
      type: 'spent',
      amount: -1000,
      description: 'KT 1GB 구매',
      date: '2025.07.03',
    },
    {
      id: 3,
      type: 'earned',
      amount: 5000,
      description: '스낵 머니 충전',
      date: '2025.07.01',
    },
  ];

  // PC 헤더
  const DesktopHeader = () => (
    <div className="hidden md:block mb-8">
      {/* 네비게이션 */}
      <div className="flex items-center gap-2 mb-4">
        <Link
          href="/mypage"
          className="text-gray-500 hover:text-gray-700 text-sm transition-colors"
        >
          마이페이지
        </Link>
        <span className="text-gray-400">/</span>
        <span className="text-gray-900 font-medium">포인트 • 머니</span>
      </div>

      {/* 제목과 설명 */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">포인트 • 머니</h1>
        <p className="text-gray-600 text-lg">스낵 포인트와 머니를 관리하세요</p>
      </div>

      {/* 요약 카드 */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-blue-600">🥔</span>
            <span className="text-sm font-medium text-blue-700">
              스낵 포인트
            </span>
          </div>
          <div className="text-2xl font-bold text-blue-900">
            {profile?.points || 104}P
          </div>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-green-600">💰</span>
            <span className="text-sm font-medium text-green-700">
              스낵 머니
            </span>
          </div>
          <div className="text-2xl font-bold text-green-900">
            {(profile?.money || 6000).toLocaleString()}S
          </div>
        </div>
      </div>
    </div>
  );

  // 모바일 헤더
  const MobileHeader = () => (
    <div className="md:hidden mb-6">
      {/* 요약 카드 */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-blue-600 text-sm">🥔</span>
            <span className="text-xs font-medium text-blue-700">
              스낵 포인트
            </span>
          </div>
          <div className="text-lg font-bold text-blue-900">
            {profile?.points || 104}P
          </div>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-green-600 text-sm">💰</span>
            <span className="text-xs font-medium text-green-700">
              스낵 머니
            </span>
          </div>
          <div className="text-lg font-bold text-green-900">
            {(profile?.money || 6000).toLocaleString()}S
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white w-full">
      <div className="flex w-full min-h-screen">
        {/* 좌측 메뉴 (데스크탑만) */}
        <div className="hidden md:block w-64 flex-shrink-0 md:pt-8 md:pl-4">
          <SideMenu />
        </div>

        {/* 메인 컨텐츠 */}
        <main className="flex-1 flex flex-col md:pt-8 pt-4 md:px-6 px-2">
          <div className="max-w-4xl mx-auto w-full">
            {/* PC 헤더 */}
            <DesktopHeader />

            {/* 모바일 헤더 */}
            <MobileHeader />

            <section className="w-full max-w-full">
              <PointContent
                tabs={tabs}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                pointsHistory={pointsHistory as HistoryItem[]}
                moneyHistory={moneyHistory as HistoryItem[]}
              />
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
