'use client';

import { useState, useEffect } from 'react';
import SideMenu from '@/app/(shared)/components/SideMenu';
import TabNavigation from '@/app/(shared)/components/TabNavigation';
import AnimatedTabContent from '@/app/(shared)/components/AnimatedTabContent';
import HistoryDetailModal from '@/app/(shared)/components/HistoryDetailModal';
import { HistoryItem } from '@/app/(shared)/types/history-card';
import { api, handleApiError } from '@/app/(shared)/utils/api';
import { ApiResponse } from '@/app/(shared)/types/api';
import Link from 'next/link';

// 구매 내역 관련 타입 정의
interface PurchaseHistoryParams {
  status?: 'all' | 'purchasing' | 'completed';
  page?: number;
  size?: number;
}

interface PurchaseHistoryResponse {
  cardResponseList: PurchaseHistoryItem[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

interface PurchaseHistoryItem {
  id: number;
  name: string;
  email: string;
  ratingScore: number;
  sellStatus: string;
  cardCategory: string;
  carrier: string;
  dataAmount: number;
  price: number;
  createdAt: string;
  updatedAt: string;
}

// 구매 내역 API 함수
const getPurchaseHistory = async (
  params: PurchaseHistoryParams = {}
): Promise<PurchaseHistoryResponse> => {
  const { status = 'all', page = 0, size = 10 } = params;

  console.log(status, page, size);

  const queryParams = new URLSearchParams();

  queryParams.append('cardCategory', 'SELL');

  const response = await api.get<ApiResponse<PurchaseHistoryResponse>>(
    `/cards?${queryParams.toString()}`
  );

  return response.data.data;
};

export default function PurchaseHistoryPage() {
  const [activeTab, setActiveTab] = useState<
    'all' | 'purchasing' | 'completed'
  >('all');
  const [selectedItem, setSelectedItem] = useState<HistoryItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [purchaseHistory, setPurchaseHistory] = useState<PurchaseHistoryItem[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 구매 내역 데이터 로드
  const loadPurchaseHistory = async (status: string) => {
    try {
      setIsLoading(true);
      setError(null);

      console.log('API 호출 시작:', { status });

      const response = await getPurchaseHistory({
        status:
          status === 'all' ? undefined : (status as 'purchasing' | 'completed'),
      });

      console.log('API 응답:', response);
      console.log('응답 content:', response.cardResponseList);

      // sellStatus에 따라 필터링
      let filteredData = response.cardResponseList;
      if (status === 'purchasing') {
        filteredData = response.cardResponseList.filter(
          (item) =>
            item.sellStatus === 'SELLING' || item.sellStatus === 'PURCHASING'
        );
      } else if (status === 'completed') {
        filteredData = response.cardResponseList.filter(
          (item) =>
            item.sellStatus !== 'SELLING' && item.sellStatus !== 'PURCHASING'
        );
      }

      setPurchaseHistory(filteredData);

      console.log('상태 업데이트 완료');
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      console.error('구매 내역 로드 실패:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // 탭 변경 시 데이터 로드
  useEffect(() => {
    loadPurchaseHistory(activeTab);
  }, [activeTab]);

  // 디버깅용: 상태 변화 확인
  useEffect(() => {
    console.log('상태 변화:', {
      isLoading,
      error,
      purchaseHistoryLength: purchaseHistory?.length,
      activeTab,
    });
  }, [isLoading, error, purchaseHistory, activeTab]);

  const handleCardClick = (item: PurchaseHistoryItem) => {
    // PurchaseHistoryItem을 HistoryItem으로 변환
    const historyItem: HistoryItem = {
      id: item.id,
      date: new Date(item.createdAt).toLocaleDateString('ko-KR'),
      title: `${item.carrier} ${item.dataAmount}GB`,
      price: item.price,
      status:
        item.sellStatus === 'SELLING' || item.sellStatus === 'PURCHASING'
          ? 'purchasing'
          : 'completed',
      transactionNumber: `#${item.id.toString().padStart(4, '0')}`,
      carrier: item.carrier,
      dataAmount: `${item.dataAmount}GB`,
      phoneNumber: item.email,
    };
    setSelectedItem(historyItem);
    setIsModalOpen(true);
  };

  const handleCardKeyDown = (
    event: React.KeyboardEvent,
    item: PurchaseHistoryItem
  ) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleCardClick(item);
    }
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
      <nav aria-label="페이지 네비게이션">
        <div className="flex items-center gap-2 mb-4">
          <Link
            href="/mypage"
            className="text-gray-500 hover:text-gray-700 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
          >
            마이페이지
          </Link>
          <span className="text-gray-400" aria-hidden="true">
            /
          </span>
          <span className="text-gray-900 font-medium">구매 내역</span>
        </div>
      </nav>

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
      <nav aria-label="페이지 네비게이션">
        <div className="flex items-center gap-2 mb-4">
          <Link
            href="/mypage"
            className="text-gray-500 hover:text-gray-700 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
          >
            마이페이지
          </Link>
          <span className="text-gray-400" aria-hidden="true">
            /
          </span>
          <span className="text-gray-900 font-medium">구매 내역</span>
        </div>
      </nav>

      {/* 제목 */}
      <h1 className="text-xl font-bold text-gray-900">구매 내역</h1>
    </div>
  );

  // 로딩 컴포넌트
  const LoadingState = () => (
    <div className="p-6">
      <div className="space-y-4">
        {[...Array(3)].map((_, index) => (
          <div
            key={index}
            className="bg-gray-50 rounded-lg p-4 flex items-start gap-3 animate-pulse"
          >
            <div className="w-12 h-12 bg-gray-200 rounded-lg flex-shrink-0"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-20"></div>
              <div className="h-5 bg-gray-200 rounded w-32"></div>
              <div className="h-4 bg-gray-200 rounded w-24"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // 에러 컴포넌트
  const ErrorState = () => (
    <div className="p-6">
      <div className="text-center py-8">
        <div className="text-red-500 mb-2">오류가 발생했습니다</div>
        <div className="text-gray-500 mb-4">{error}</div>
        <button
          onClick={() => loadPurchaseHistory(activeTab)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
          다시 시도
        </button>
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

            <section
              className="w-full max-w-full"
              aria-labelledby="purchase-history-title"
            >
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
                <AnimatedTabContent tabKey={activeTab}>
                  {isLoading ? (
                    <LoadingState />
                  ) : error ? (
                    <ErrorState />
                  ) : (
                    <div className="p-6">
                      {purchaseHistory?.length > 0 ? (
                        <div
                          className="space-y-4"
                          role="list"
                          aria-label={`${activeTab === 'all' ? '전체' : activeTab === 'purchasing' ? '구매 중' : '구매 완료'} 구매 내역`}
                        >
                          {purchaseHistory.map((item) => (
                            <div
                              key={item.id}
                              role="listitem"
                              tabIndex={0}
                              className="bg-gray-50 rounded-lg p-4 flex items-start gap-3 cursor-pointer hover:bg-gray-100 focus:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                              onClick={() => handleCardClick(item)}
                              onKeyDown={(e) => handleCardKeyDown(e, item)}
                              aria-label={`${item.carrier} ${item.dataAmount}GB 구매 내역 - ${new Date(item.createdAt).toLocaleDateString('ko-KR')} - ${item.price.toLocaleString()}원 - ${item.sellStatus === 'SELLING' ? '구매요청' : '거래완료'}`}
                            >
                              {/* 아이콘 */}
                              <div
                                className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0"
                                aria-hidden="true"
                              >
                                <span className="text-blue-600 font-bold text-lg">
                                  T
                                </span>
                              </div>

                              {/* 내용 */}
                              <div className="flex-1">
                                <div className="text-sm text-gray-500 mb-1">
                                  {new Date(item.createdAt).toLocaleDateString(
                                    'ko-KR'
                                  )}
                                </div>
                                <div className="font-semibold text-gray-900 mb-1">
                                  {item.carrier} {item.dataAmount}GB
                                </div>
                                <div className="flex items-center gap-2">
                                  <span
                                    className={`text-white text-xs px-2 py-1 rounded ${
                                      item.sellStatus === 'SELLING' ||
                                      item.sellStatus === 'PURCHASING'
                                        ? 'bg-orange-500'
                                        : 'bg-black'
                                    }`}
                                    aria-label={`상태: ${item.sellStatus === 'SELLING' || item.sellStatus === 'PURCHASING' ? '구매요청' : '거래완료'}`}
                                  >
                                    {item.sellStatus === 'SELLING' ||
                                    item.sellStatus === 'PURCHASING'
                                      ? '구매요청'
                                      : '거래완료'}
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
                        <div
                          className="text-center py-8 text-gray-500"
                          role="status"
                          aria-live="polite"
                        >
                          {activeTab === 'all'
                            ? '구매 내역이 없습니다.'
                            : activeTab === 'purchasing'
                              ? '구매 중인 상품이 없습니다.'
                              : '구매 완료된 상품이 없습니다.'}
                        </div>
                      )}
                    </div>
                  )}
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
