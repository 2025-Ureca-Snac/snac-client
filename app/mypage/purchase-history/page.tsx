'use client';

import { useState } from 'react';
import SideMenu from '@/app/(shared)/components/SideMenu';
import TabNavigation from '@/app/(shared)/components/TabNavigation';
import AnimatedTabContent from '@/app/(shared)/components/AnimatedTabContent';
import HistoryDetailModal from '@/app/(shared)/components/HistoryDetailModal';
import { HistoryItem } from '@/app/(shared)/components/HistoryCard';
import Link from 'next/link';

export default function PurchaseHistoryPage() {
  const [activeTab, setActiveTab] = useState<
    'all' | 'purchasing' | 'completed'
  >('all');
  const [selectedItem, setSelectedItem] = useState<HistoryItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const purchaseHistory: HistoryItem[] = [
    {
      id: 1,
      date: '2025.07.04',
      title: '통신사 2GB',
      price: 2000,
      status: 'purchasing',
      transactionNumber: '#0123_45678',
      carrier: 'SKT',
      dataAmount: '2GB',
      phoneNumber: '010-0000-0000',
    },
    {
      id: 2,
      date: '2025.07.03',
      title: '통신사 2GB',
      price: 2000,
      status: 'completed',
      transactionNumber: '#0123_45679',
      carrier: 'SKT',
      dataAmount: '2GB',
    },
    {
      id: 3,
      date: '2025.07.02',
      title: '통신사 5GB',
      price: 5000,
      status: 'completed',
      transactionNumber: '#0123_45680',
      carrier: 'KT',
      dataAmount: '5GB',
    },
    {
      id: 4,
      date: '2025.07.01',
      title: '통신사 1GB',
      price: 1000,
      status: 'completed',
      transactionNumber: '#0123_45681',
      carrier: 'LGU+',
      dataAmount: '1GB',
    },
  ];

  const filteredPurchases = purchaseHistory.filter((item) => {
    if (activeTab === 'all') return true;
    return item.status === activeTab;
  });

  const handleCardClick = (item: HistoryItem) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  const tabs = [
    { id: 'all', label: '전체' },
    { id: 'purchasing', label: '구매 중' },
    { id: 'completed', label: '구매 완료' },
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
        <span className="text-gray-900 font-medium">구매 내역</span>
      </div>

      {/* 제목과 설명 */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">구매 내역</h1>
        <p className="text-gray-600 text-lg">
          내가 구매한 상품들의 내역을 확인하세요
        </p>
      </div>
    </div>
  );

  // 모바일 헤더
  const MobileHeader = () => (
    <div className="md:hidden mb-6">
      {/* 네비게이션 */}
      <div className="flex items-center gap-2 mb-4">
        <Link
          href="/mypage"
          className="text-gray-500 hover:text-gray-700 text-sm transition-colors"
        >
          마이페이지
        </Link>
        <span className="text-gray-400">/</span>
        <span className="text-gray-900 font-medium">구매 내역</span>
      </div>

      {/* 제목 */}
      <h1 className="text-xl font-bold text-gray-900">구매 내역</h1>
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
              <div className="bg-white rounded-lg shadow-sm border">
                {/* 탭 네비게이션 */}
                <TabNavigation
                  tabs={tabs}
                  activeTab={activeTab}
                  onTabChange={(tabId: string) =>
                    setActiveTab(tabId as typeof activeTab)
                  }
                  activeTextColor="text-blue-600"
                  inactiveTextColor="text-gray-500"
                  underlineColor="bg-blue-600"
                />

                {/* 구매 내역 리스트 */}
                <AnimatedTabContent key={activeTab}>
                  <div className="p-6">
                    {filteredPurchases.length > 0 ? (
                      <div className="space-y-4">
                        {filteredPurchases.map((item) => (
                          <div
                            key={item.id}
                            className="bg-gray-50 rounded-lg p-4 flex items-start gap-3 cursor-pointer hover:bg-gray-100 transition-colors"
                            onClick={() => handleCardClick(item)}
                          >
                            {/* 아이콘 */}
                            <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                              <span className="text-blue-600 font-bold text-lg">
                                T
                              </span>
                            </div>

                            {/* 내용 */}
                            <div className="flex-1">
                              <div className="text-sm text-gray-500 mb-1">
                                {item.date}
                              </div>
                              <div className="font-semibold text-gray-900 mb-1">
                                {item.title}
                              </div>
                              <div className="flex items-center gap-2">
                                <span
                                  className={`text-white text-xs px-2 py-1 rounded ${
                                    item.status === 'completed'
                                      ? 'bg-black'
                                      : 'bg-red-500'
                                  }`}
                                >
                                  {item.status === 'completed'
                                    ? '거래완료'
                                    : '구매요청'}
                                </span>
                                <span className="text-gray-900">
                                  {item.price.toLocaleString()}원
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        {activeTab === 'all'
                          ? '구매 내역이 없습니다.'
                          : activeTab === 'purchasing'
                            ? '구매 중인 상품이 없습니다.'
                            : '구매 완료된 상품이 없습니다.'}
                      </div>
                    )}
                  </div>
                </AnimatedTabContent>
              </div>
            </section>
          </div>
        </main>
      </div>

      {/* 상세 정보 모달 */}
      <HistoryDetailModal
        open={isModalOpen}
        onClose={handleCloseModal}
        item={selectedItem}
        type="purchase"
      />
    </div>
  );
}
