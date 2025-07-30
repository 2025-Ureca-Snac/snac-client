'use client';

import { useState, useEffect, useCallback } from 'react';
import SideMenu from './SideMenu';
import TabNavigation from './TabNavigation';
import AnimatedTabContent from './AnimatedTabContent';
import HistoryDetailModal from './HistoryDetailModal';
import { HistoryItem } from '../types/history-card';
import { api, handleApiError } from '../utils/api';
import { ApiResponse } from '../types/api';
import Link from 'next/link';

// 공통 타입 정의
interface TradingHistoryResponse {
  trades: TradingHistoryItem[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

interface TradingHistoryItem {
  tradeId: number;
  buyer: string;
  seller: string;
  carrier: string;
  dataAmount: number;
  priceGb: number;
  status: string;
  tradeType: string;
  createdAt: string;
  phone: string | null;
  cancelReason?: string;
}

// 거래 내역 타입
export type TradingType = 'purchase' | 'sales';

// 컴포넌트 Props
interface TradingHistoryPageProps {
  type: TradingType;
  selectedId?: string;
}

// 거래 내역 API 함수
const getTradingHistory = async (
  type: TradingType
): Promise<TradingHistoryResponse> => {
  const queryParams = new URLSearchParams();
  queryParams.append('side', type === 'purchase' ? 'BUY' : 'SELL');

  const response = await api.get<ApiResponse<TradingHistoryResponse>>(
    `/trades/scroll?${queryParams.toString()}`
  );

  return response.data.data;
};

export default function TradingHistoryPage({
  type,
  selectedId,
}: TradingHistoryPageProps) {
  const isPurchase = type === 'purchase';

  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'completed'>(
    'all'
  );
  const [selectedItem, setSelectedItem] = useState<HistoryItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tradingHistory, setTradingHistory] = useState<TradingHistoryItem[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 거래 내역 데이터 로드
  const loadTradingHistory = useCallback(
    async (status: string) => {
      try {
        setIsLoading(true);
        setError(null);

        console.log('API 호출 시작:', { type, status });

        const response = await getTradingHistory(type);

        console.log('API 응답:', response);
        console.log('응답 content:', response.trades);

        // status에 따라 필터링
        let filteredData = response.trades;
        if (status === 'active') {
          filteredData = response.trades.filter(
            (item) =>
              item.status === 'BUY_REQUESTED' ||
              item.status === 'ACCEPTED' ||
              item.status === 'PAYMENT_CONFIRMED' ||
              item.status === 'DATA_SENT'
          );
        } else if (status === 'completed') {
          filteredData = response.trades.filter(
            (item) =>
              item.status === 'COMPLETED' ||
              item.status === 'CANCELED' ||
              item.status === 'AUTO_REFUND' ||
              item.status === 'AUTO_PAYOUT'
          );
        }

        // 정렬: 진행중인 거래가 맨 위로, 그 다음 최신순
        const sortedData = filteredData.sort((a, b) => {
          // 진행중인 거래 상태 우선 정렬
          const aIsActive =
            a.status === 'BUY_REQUESTED' ||
            a.status === 'ACCEPTED' ||
            a.status === 'PAYMENT_CONFIRMED' ||
            a.status === 'DATA_SENT';
          const bIsActive =
            b.status === 'BUY_REQUESTED' ||
            b.status === 'ACCEPTED' ||
            b.status === 'PAYMENT_CONFIRMED' ||
            b.status === 'DATA_SENT';

          if (aIsActive && !bIsActive) return -1;
          if (!aIsActive && bIsActive) return 1;

          // 둘 다 활성 상태이거나 둘 다 완료 상태인 경우 최신순 정렬
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        });

        setTradingHistory(sortedData);

        console.log('상태 업데이트 완료');
      } catch (err) {
        const errorMessage = handleApiError(err);
        setError(errorMessage);
        console.error(`${isPurchase ? '구매' : '판매'} 내역 로드 실패:`, err);
      } finally {
        setIsLoading(false);
      }
    },
    [type, isPurchase]
  );

  // 탭 변경 시 데이터 로드
  useEffect(() => {
    loadTradingHistory(activeTab);
  }, [activeTab, type, loadTradingHistory]);

  // selectedId가 있으면 해당 아이템의 모달을 열기
  useEffect(() => {
    if (selectedId && tradingHistory.length > 0) {
      const targetItem = tradingHistory.find(
        (item) => item.tradeId.toString() === selectedId
      );
      if (targetItem) {
        handleCardClick(targetItem);
      }
    }
  }, [selectedId, tradingHistory]);

  // 디버깅용: 상태 변화 확인
  useEffect(() => {
    console.log('상태 변화:', {
      isLoading,
      error,
      tradingHistoryLength: tradingHistory?.length,
      activeTab,
      type,
      selectedId,
    });
  }, [isLoading, error, tradingHistory, activeTab, type, selectedId]);

  const handleCardClick = (item: TradingHistoryItem) => {
    // TradingHistoryItem을 HistoryItem으로 변환
    const historyItem: HistoryItem = {
      id: item.tradeId,
      date: new Date(item.createdAt).toLocaleDateString('ko-KR'),
      title: `${item.carrier} ${item.dataAmount}GB`,
      price: item.priceGb,
      status: item.status as HistoryItem['status'], // 새로운 상태값을 그대로 사용
      transactionNumber: `#${item.tradeId.toString().padStart(4, '0')}`,
      carrier: item.carrier,
      dataAmount: `${item.dataAmount}GB`,
      phoneNumber: item.phone || '',
    };
    setSelectedItem(historyItem);
    setIsModalOpen(true);

    // URL 업데이트
    if (type === 'sales') {
      window.history.pushState({}, '', `/mypage/sales-history/${item.tradeId}`);
    } else if (type === 'purchase') {
      window.history.pushState(
        {},
        '',
        `/mypage/purchase-history/${item.tradeId}`
      );
    }
  };

  const handleCardKeyDown = (
    event: React.KeyboardEvent,
    item: TradingHistoryItem
  ) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleCardClick(item);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);

    // URL에서 id 파라미터가 있으면 기본 페이지로 리다이렉트
    if (selectedId) {
      if (type === 'sales') {
        window.history.pushState({}, '', `/mypage/sales-history`);
      } else if (type === 'purchase') {
        window.history.pushState({}, '', `/mypage/purchase-history`);
      }
    }
  };

  // 테마 설정
  const theme = {
    primaryColor: isPurchase ? 'blue' : 'green',
    primaryColorClass: isPurchase ? 'blue' : 'green',
    focusRingColor: isPurchase ? 'ring-blue-500' : 'ring-green-500',
    buttonColor: isPurchase
      ? 'bg-blue-600 hover:bg-blue-700'
      : 'bg-green-600 hover:bg-green-700',
    iconColor: isPurchase ? 'text-blue-600' : 'text-green-600',
  };

  const tabs = [
    { id: 'all', label: '전체' },
    { id: 'active', label: isPurchase ? '구매 중' : '판매 거래 중' },
    { id: 'completed', label: isPurchase ? '구매 완료' : '판매 거래 완료' },
  ];

  const pageTitle = isPurchase ? '구매 내역' : '판매 내역';
  const pageDescription = isPurchase
    ? '내가 구매한 상품들의 내역을 확인하세요'
    : '내가 판매한 상품들의 내역을 확인하세요';

  // PC 헤더
  const DesktopHeader = () => (
    <div className="hidden md:block mb-8">
      {/* 네비게이션 */}
      <nav aria-label="페이지 네비게이션">
        <div className="flex items-center gap-2 mb-4">
          <Link
            href="/mypage"
            className={`text-gray-500 hover:text-gray-700 text-sm transition-colors focus:outline-none focus:ring-2 focus:${theme.focusRingColor} focus:ring-offset-2 rounded`}
          >
            마이페이지
          </Link>
          <span className="text-gray-400" aria-hidden="true">
            /
          </span>
          <span className="text-gray-900 font-medium">{pageTitle}</span>
        </div>
      </nav>

      {/* 제목과 설명 */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{pageTitle}</h1>
        <p className="text-gray-600 text-lg">{pageDescription}</p>
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
            className={`text-gray-500 hover:text-gray-700 text-sm transition-colors focus:outline-none focus:ring-2 focus:${theme.focusRingColor} focus:ring-offset-2 rounded`}
          >
            마이페이지
          </Link>
          <span className="text-gray-400" aria-hidden="true">
            /
          </span>
          <span className="text-gray-900 font-medium">{pageTitle}</span>
        </div>
      </nav>

      {/* 제목 */}
      <h1 className="text-xl font-bold text-gray-900">{pageTitle}</h1>
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
          onClick={() => loadTradingHistory(activeTab)}
          className={`px-4 py-2 ${theme.buttonColor} text-white rounded-lg focus:outline-none focus:ring-2 focus:${theme.focusRingColor} focus:ring-offset-2 transition-colors`}
        >
          다시 시도
        </button>
      </div>
    </div>
  );

  // 상태 텍스트 매핑
  const getStatusText = (status: string) => {
    switch (status) {
      case 'BUY_REQUESTED':
        return '거래 요청';
      case 'SELL_REQUESTED':
        return '판매 요청';
      case 'ACCEPTED':
        return '거래 수락';
      case 'PAYMENT_CONFIRMED':
        return '돈 입금';
      case 'DATA_SENT':
        return '데이터 보냄';
      case 'COMPLETED':
        return '거래 완료';
      case 'CANCELED':
        return '거래 취소';
      case 'AUTO_REFUND':
        return '자동 환불';
      case 'AUTO_PAYOUT':
        return '자동 확정';
      default:
        return '거래 완료';
    }
  };

  // 빈 상태 메시지
  const getEmptyMessage = () => {
    if (activeTab === 'all') {
      return `${isPurchase ? '구매' : '판매'} 내역이 없습니다.`;
    } else if (activeTab === 'active') {
      return `${isPurchase ? '구매 중' : '판매 중'}인 상품이 없습니다.`;
    } else {
      return `${isPurchase ? '구매' : '판매'} 완료된 상품이 없습니다.`;
    }
  };

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
              aria-labelledby={`${type}-history-title`}
            >
              <div className="bg-white rounded-lg shadow-sm border">
                {/* 탭 네비게이션 */}
                <TabNavigation
                  tabs={tabs}
                  activeTab={activeTab}
                  onTabChange={(tabId: string) =>
                    setActiveTab(tabId as typeof activeTab)
                  }
                  activeTextColor={`text-${theme.primaryColorClass}-600`}
                  inactiveTextColor="text-gray-500"
                  underlineColor={`bg-${theme.primaryColorClass}-600`}
                />

                {/* 거래 내역 리스트 */}
                <AnimatedTabContent tabKey={activeTab}>
                  {isLoading ? (
                    <LoadingState />
                  ) : error ? (
                    <ErrorState />
                  ) : (
                    <div className="p-6">
                      {tradingHistory?.length > 0 ? (
                        <div
                          className="space-y-4"
                          role="list"
                          aria-label={`${activeTab === 'all' ? '전체' : activeTab === 'active' ? (isPurchase ? '구매 중' : '판매 중') : isPurchase ? '구매 완료' : '판매 완료'} ${isPurchase ? '구매' : '판매'} 내역`}
                        >
                          {tradingHistory.map((item) => (
                            <div
                              key={item.tradeId}
                              role="listitem"
                              tabIndex={0}
                              className={`bg-gray-50 rounded-lg p-4 flex items-start gap-3 cursor-pointer hover:bg-gray-100 focus:bg-gray-100 focus:outline-none focus:ring-2 focus:${theme.focusRingColor} focus:ring-offset-2 transition-colors`}
                              onClick={() => handleCardClick(item)}
                              onKeyDown={(e) => handleCardKeyDown(e, item)}
                              aria-label={`${item.carrier} ${item.dataAmount}GB ${isPurchase ? '구매' : '판매'} 내역 - ${new Date(item.createdAt).toLocaleDateString('ko-KR')} - ${item.priceGb.toLocaleString()}원 - ${getStatusText(item.status)}`}
                            >
                              {/* 아이콘 */}
                              <div
                                className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0"
                                aria-hidden="true"
                              >
                                <span
                                  className={`${theme.iconColor} font-bold text-lg`}
                                >
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
                                      item.status === 'BUY_REQUESTED' ||
                                      item.status === 'ACCEPTED' ||
                                      item.status === 'PAYMENT_CONFIRMED' ||
                                      item.status === 'DATA_SENT'
                                        ? 'bg-orange-500'
                                        : item.status === 'COMPLETED' ||
                                            item.status === 'AUTO_PAYOUT'
                                          ? 'bg-green-500'
                                          : item.status === 'CANCELED' ||
                                              item.status === 'AUTO_REFUND'
                                            ? 'bg-red-500'
                                            : 'bg-black'
                                    }`}
                                    aria-label={`상태: ${getStatusText(item.status)}`}
                                  >
                                    {getStatusText(item.status)}
                                  </span>
                                  <span className="text-gray-900">
                                    {item.priceGb.toLocaleString()}원
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
                          {getEmptyMessage()}
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
        type={type}
      />
    </div>
  );
}
