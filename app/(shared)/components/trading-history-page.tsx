'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { ApiResponse } from '../types/api';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { HistoryItem } from '../types/history-card';
import { api, handleApiError } from '../utils/api';
import { getCarrierImageUrl } from '../utils/carrier-utils';
import { getHistoryStatusText } from '../utils/history-status';
import { useSwipeNavigation } from '../hooks/useSwipeNavigation';
import AnimatedTabContent from './AnimatedTabContent';
import HistoryDetailModal from './HistoryDetailModal';
import SideMenu from './SideMenu';
import TabNavigation from './TabNavigation';
import { TradingHistoryCard } from './TradingHistoryCard';

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
  partnerId?: number;
  partnerFavorite: boolean;
  partnerNickname: string;
  cancelReason?: string;
  cancelRequested: boolean;
  cancelRequestReason: string | null;
  cancelRequestStatus: string | null;
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
  const router = useRouter();
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

  // 스와이프 네비게이션 훅
  const { onTouchStart, onTouchEnd } = useSwipeNavigation({
    onSwipeLeft: () => {
      if (activeTab === 'all') setActiveTab('active');
      else if (activeTab === 'active') setActiveTab('completed');
    },
    onSwipeRight: () => {
      if (activeTab === 'completed') setActiveTab('active');
      else if (activeTab === 'active') setActiveTab('all');
    },
    threshold: 50,
  });

  // 슬라이드 관련 상태
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [currentX, setCurrentX] = useState(0);

  // 거래 내역 데이터 로드 (useCallback으로 안정화)
  const loadTradingHistory = useCallback(
    async (status: string) => {
      try {
        setIsLoading(true);
        setError(null);

        //.log('API 호출 시작:', { type, status });

        const response = await getTradingHistory(type);

        //.log('API 응답:', response);
        //.log('응답 content:', response.trades);

        // status에 따라 필터링
        let filteredData = response.trades;
        if (status === 'active') {
          filteredData = response.trades.filter(
            (item) =>
              item.status === 'BUY_REQUESTED' ||
              item.status === 'ACCEPTED' ||
              item.status === 'PAYMENT_CONFIRMED' ||
              item.status === 'PAYMENT_CONFIRMED_ACCEPTED' ||
              item.status === 'DATA_SENT' ||
              item.status === 'REPORTED'
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
            a.status === 'DATA_SENT' ||
            a.status === 'REPORTED';
          const bIsActive =
            b.status === 'BUY_REQUESTED' ||
            b.status === 'ACCEPTED' ||
            b.status === 'PAYMENT_CONFIRMED' ||
            b.status === 'DATA_SENT' ||
            b.status === 'REPORTED';

          if (aIsActive && !bIsActive) return -1;
          if (!aIsActive && bIsActive) return 1;

          // 둘 다 활성 상태이거나 둘 다 완료 상태인 경우 최신순 정렬
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        });

        setTradingHistory(sortedData);

        //.log('상태 업데이트 완료');
      } catch (err) {
        const errorMessage = handleApiError(err);
        setError(errorMessage);
        //.error(`${isPurchase ? '구매' : '판매'} 내역 로드 실패:`, err);
      } finally {
        setIsLoading(false);
      }
    },
    [type]
  );

  // 데이터 로드 (초기 로드 + 탭 변경)
  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      if (isMounted) {
        //.log('거래 내역 로드 시작');
        await loadTradingHistory(activeTab);
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, [activeTab, loadTradingHistory]); // loadTradingHistory 의존성 추가

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
  }, [selectedId, tradingHistory.length]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleCardClick = useCallback(
    (item: TradingHistoryItem) => {
      // 슬라이드 중에는 모달 열지 않음
      if (isDragging) return;

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
        cancelReason: item.cancelReason || '',
        cancelRequested: item.cancelRequested || false,
        cancelRequestStatus: item.cancelRequestStatus || null,
        cancelRequestReason: item.cancelRequestReason || null,
        partnerId: item.partnerId || undefined,
        partnerFavorite: item.partnerFavorite || false,
        partnerNickname: item.partnerNickname || '',
      };
      setSelectedItem(historyItem);
      setIsModalOpen(true);

      // URL 업데이트
      if (type === 'sales') {
        window.history.pushState(
          {},
          '',
          `/mypage/sales-history/${item.tradeId}`
        );
      } else if (type === 'purchase') {
        window.history.pushState(
          {},
          '',
          `/mypage/purchase-history/${item.tradeId}`
        );
      }
    },
    [isDragging, setSelectedItem, setIsModalOpen, type]
  );

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

  // 슬라이드 핸들러
  const handleDragStart = useCallback((clientX: number) => {
    setIsDragging(true);
    setStartX(clientX);
    setCurrentX(clientX);
  }, []);

  const handleDragMove = useCallback(
    (clientX: number) => {
      if (!isDragging) return;
      setCurrentX(clientX);
    },
    [isDragging]
  );

  const handleDragEnd = useCallback(() => {
    if (!isDragging) return;

    const deltaX = currentX - startX;
    const threshold = 100; // 슬라이드 감지 임계값

    if (Math.abs(deltaX) > threshold) {
      // tabs는 나중에 정의되므로 여기서 직접 정의
      const tabs = [
        { id: 'all', label: '전체' },
        { id: 'active', label: isPurchase ? '구매 거래 중' : '판매 거래 중' },
        {
          id: 'completed',
          label: isPurchase ? '구매 거래 완료' : '판매 거래 완료',
        },
      ];

      const currentIndex = tabs.findIndex((tab) => tab.id === activeTab);

      if (deltaX > 0 && currentIndex > 0) {
        // 오른쪽으로 스와이프 - 이전 탭
        setActiveTab(tabs[currentIndex - 1].id as typeof activeTab);
      } else if (deltaX < 0 && currentIndex < tabs.length - 1) {
        // 왼쪽으로 스와이프 - 다음 탭
        setActiveTab(tabs[currentIndex + 1].id as typeof activeTab);
      }
    }

    setIsDragging(false);
  }, [isDragging, currentX, startX, activeTab, isPurchase]);

  // 슬라이드 방향 감지
  const getSlideDirection = () => {
    const deltaX = currentX - startX;
    if (Math.abs(deltaX) < 20) return null;
    return deltaX > 0 ? 'right' : 'left';
  };

  // 슬라이드 방향에 따른 애니메이션 설정
  const getSlideAnimation = () => {
    const deltaX = currentX - startX;

    if (Math.abs(deltaX) < 20) return { x: 0 };

    if (deltaX > 0) {
      // 오른쪽으로 슬라이드 - 현재 화면이 오른쪽으로 나감
      const progress = Math.min(Math.abs(deltaX) / 150, 1);
      return {
        x: Math.min(deltaX * 0.3, 200), // 더 부드러운 이동
        opacity: 1 - progress * 0.3, // 약간 투명해짐
      };
    } else {
      // 왼쪽으로 슬라이드 - 현재 화면이 왼쪽으로 나감
      const progress = Math.min(Math.abs(deltaX) / 150, 1);
      return {
        x: Math.max(deltaX * 0.3, -200), // 더 부드러운 이동
        opacity: 1 - progress * 0.3, // 약간 투명해짐
      };
    }
  };

  // 터치 이벤트 핸들러
  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      e.preventDefault();
      handleDragStart(e.touches[0].clientX);
    },
    [handleDragStart]
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (isDragging) {
        e.preventDefault();
      }
      handleDragMove(e.touches[0].clientX);
    },
    [handleDragMove, isDragging]
  );

  const handleTouchEnd = useCallback(() => {
    handleDragEnd();
  }, [handleDragEnd]);

  // 마우스 이벤트 핸들러
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      handleDragStart(e.clientX);
    },
    [handleDragStart]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      handleDragMove(e.clientX);
    },
    [handleDragMove]
  );

  const handleMouseUp = useCallback(() => {
    handleDragEnd();
  }, [handleDragEnd]);

  const handleMouseLeave = useCallback(() => {
    if (isDragging) {
      handleDragEnd();
    }
  }, [isDragging, handleDragEnd]);

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
    { id: 'active', label: isPurchase ? '구매 거래 중' : '판매 거래 중' },
    {
      id: 'completed',
      label: isPurchase ? '구매 거래 완료' : '판매 거래 완료',
    },
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
            className={`text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 text-sm transition-colors focus:outline-none focus:ring-2 focus:${theme.focusRingColor} focus:ring-offset-2 rounded`}
          >
            마이페이지
          </Link>
          <span className="text-gray-400 dark:text-gray-500" aria-hidden="true">
            /
          </span>
          <span className="text-gray-900 dark:text-white font-medium">
            {pageTitle}
          </span>
        </div>
      </nav>

      {/* 제목과 설명 */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {pageTitle}
        </h1>
        <p className="text-gray-600 dark:text-gray-300 text-lg">
          {pageDescription}
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
            className={`text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 text-sm transition-colors focus:outline-none focus:ring-2 focus:${theme.focusRingColor} focus:ring-offset-2 rounded`}
          >
            마이페이지
          </Link>
          <span className="text-gray-400 dark:text-gray-500" aria-hidden="true">
            /
          </span>
          <span className="text-gray-900 dark:text-white font-medium">
            {pageTitle}
          </span>
        </div>
      </nav>

      {/* 제목 */}
      <h1 className="text-xl font-bold text-gray-900 dark:text-white">
        {pageTitle}
      </h1>
    </div>
  );

  // 로딩 컴포넌트
  const LoadingState = () => (
    <div className="p-6">
      <div className="space-y-4">
        {[...Array(3)].map((_, index) => (
          <div
            key={index}
            className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 flex items-start gap-3 animate-pulse"
          >
            <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg flex-shrink-0"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
              <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // 에러 컴포넌트
  const ErrorState = () => {
    // 에러 발생 시 바로 로그인 페이지로 이동
    useEffect(() => {
      //.log('거래 내역 페이지 에러 발생, 로그인 페이지로 이동:', error);
      toast.error('로그인 후 이용이 가능합니다.');
      router.push('/login');
    }, []);

    return (
      <div className="p-6">
        <div className="text-center py-8">
          <div className="text-gray-500 dark:text-gray-400">
            로그인 페이지로 이동 중...
          </div>
        </div>
      </div>
    );
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
    <div className="min-h-screen bg-white dark:bg-gray-900 w-full">
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
              onTouchStart={onTouchStart}
              onTouchEnd={onTouchEnd}
            >
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
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
                  disableDrag={true}
                />

                {/* 거래 내역 리스트 */}
                <motion.div
                  className="select-none overflow-hidden"
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.2}
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseLeave}
                  animate={
                    isDragging ? getSlideAnimation() : { x: 0, opacity: 1 }
                  }
                  transition={{
                    type: 'spring',
                    stiffness: 200,
                    damping: 25,
                  }}
                >
                  <AnimatedTabContent
                    tabKey={activeTab}
                    slideDirection={getSlideDirection()}
                  >
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
                              <TradingHistoryCard
                                key={item.tradeId}
                                item={item}
                                isPurchase={isPurchase}
                                theme={theme}
                                onCardClick={handleCardClick}
                                onCardKeyDown={handleCardKeyDown}
                                getCarrierImageUrl={getCarrierImageUrl}
                                getStatusText={(status: string) =>
                                  getHistoryStatusText(type, status)
                                }
                                partnerNickname={item.partnerNickname}
                                partnerFavorite={item.partnerFavorite}
                                isDragging={isDragging}
                              />
                            ))}
                          </div>
                        ) : (
                          <div
                            className="text-center py-8 text-gray-500 dark:text-gray-400"
                            role="status"
                            aria-live="polite"
                          >
                            {getEmptyMessage()}
                          </div>
                        )}
                      </div>
                    )}
                  </AnimatedTabContent>
                </motion.div>
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
