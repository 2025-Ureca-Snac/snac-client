'use client';

import {
  useState,
  useEffect,
  Suspense,
  useCallback,
  useRef,
  useMemo,
} from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

import SideMenu from '@/app/(shared)/components/SideMenu';
import { api, handleApiError } from '@/app/(shared)/utils/api';
import { ApiResponse } from '@/app/(shared)/types/api';
import {
  PointHistoryItem,
  BalanceResponse,
  PointHistoryResponse,
  AssetType,
} from '@/app/(shared)/types/point-history';
import Link from 'next/link';
import PointContent from './PointContent';

// 포인트/머니 관련 타입 정의

// 내역 조회 API 함수
const getHistory = async (
  assetType: AssetType,
  size: number = 20,
  year?: number,
  month?: number
) => {
  let url = `/asset-histories/me?assetType=${assetType}&size=${size}`;

  if (year && month) {
    url += `&year=${year}&month=${month}`;
  }

  const response = await api.get<ApiResponse<PointHistoryResponse>>(url);
  console.log(
    `${assetType} 내역 API 응답 (size: ${size}, year: ${year}, month: ${month}):`,
    response
  );
  return response.data.data;
};

function PointPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const typeParam = searchParams.get('type') as AssetType;

  // 유효한 타입인지 확인
  const isValidType = (type: string): type is AssetType => {
    return type === 'POINT' || type === 'MONEY';
  };

  const [activeTab, setActiveTab] = useState<AssetType>(
    typeParam && isValidType(typeParam) ? typeParam : 'POINT'
  );
  const [balance, setBalance] = useState<BalanceResponse>({
    point: 0,
    money: 0,
  });
  const [allHistory, setAllHistory] = useState<PointHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentSize, setCurrentSize] = useState(20);
  const [hasNext, setHasNext] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [selectedYear, setSelectedYear] = useState<number>(
    new Date().getFullYear()
  );
  const [selectedMonth, setSelectedMonth] = useState<number>(
    new Date().getMonth() + 1
  );

  // 중복 호출 방지를 위한 ref
  const isInitialLoadRef = useRef(false);
  // 무한 로딩 방지를 위한 ref
  const isLoadingRef = useRef(false);

  // 슬라이드 관련 상태
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [currentX, setCurrentX] = useState(0);

  // 잔액 조회 API 함수
  const getBalance = async (): Promise<BalanceResponse> => {
    const response =
      await api.get<ApiResponse<BalanceResponse>>('/wallets/summary');
    return response.data.data;
  };

  // 초기 잔액 로드 (한 번만 호출)
  const loadInitialBalance = async () => {
    try {
      const balanceResponse = await getBalance();
      setBalance(balanceResponse);
      console.log('초기 잔액 로드 완료:', balanceResponse);
    } catch (err) {
      console.error('잔액 로드 실패:', err);
    }
  };

  // 포인트/머니 데이터 로드 (거래 내역만)
  const loadPointData = async () => {
    // 무한 로딩 방지
    if (isLoadingRef.current) {
      console.log('이미 로딩 중이므로 중복 호출을 방지합니다.');
      return;
    }

    try {
      isLoadingRef.current = true;
      setIsLoading(true);
      // 포인트와 머니 모두 20개씩 불러오기
      const size = 20;
      setCurrentSize(size);
      setError(null);

      console.log('포인트/머니 거래 내역 API 호출 시작');

      // 현재 활성 탭에 따른 내역 조회 (포인트는 월별 조회, 머니는 전체 조회)
      const historyResponse =
        activeTab === 'POINT'
          ? await getHistory(activeTab, size, selectedYear, selectedMonth)
          : await getHistory(activeTab, size);
      console.log(
        `${activeTab} 내역 API 응답 (size: ${size}):`,
        historyResponse
      );

      const newHistory = historyResponse.contents || [];
      setAllHistory(newHistory);

      // hasNext 값에 따라 더보기 여부 결정
      setHasNext(historyResponse.hasNext);

      // 포인트 탭에서 월별 조회 시 잔액 업데이트
      if (activeTab === 'POINT' && newHistory.length > 0) {
        // 해당 월의 가장 최신 거래 내역의 balanceAfter로 잔액 업데이트
        const latestTransaction = newHistory[0];
        const balanceAfterValue =
          typeof latestTransaction.balanceAfter === 'number'
            ? latestTransaction.balanceAfter
            : parseFloat(latestTransaction.balanceAfter.replace(/,/g, ''));

        setBalance((prev) => ({
          ...prev,
          point: balanceAfterValue,
        }));

        console.log(`포인트 잔액 업데이트: ${balanceAfterValue}P`);
      } else if (activeTab === 'POINT' && newHistory.length === 0) {
        // 해당 월에 거래 내역이 없으면 이전 상태 유지
        console.log('해당 월에 포인트 거래 내역이 없어 잔액을 유지합니다.');
      }

      // 머니 탭에서 전체 조회 시 잔액 업데이트 (최신 값과 다르면)
      if (activeTab === 'MONEY' && newHistory.length > 0) {
        const latestTransaction = newHistory[0];
        const balanceAfterValue =
          typeof latestTransaction.balanceAfter === 'number'
            ? latestTransaction.balanceAfter
            : parseFloat(latestTransaction.balanceAfter.replace(/,/g, ''));

        // 현재 잔액과 다르면 업데이트
        if (balance.money !== balanceAfterValue) {
          setBalance((prev) => ({
            ...prev,
            money: balanceAfterValue,
          }));

          console.log(
            `머니 잔액 업데이트: ${balance.money}S → ${balanceAfterValue}S`
          );
        }
      }

      console.log(`${activeTab} 내역 저장 완료 (총 ${newHistory.length}개)`);
      console.log('상태 업데이트 완료');
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      console.error('포인트/머니 데이터 로드 실패:', err);
    } finally {
      setIsLoading(false);
      isLoadingRef.current = false;
    }
  };

  // URL 파라미터 변경 시 activeTab 업데이트
  useEffect(() => {
    if (typeParam && typeParam !== activeTab) {
      setActiveTab(typeParam);
    }
  }, [typeParam, activeTab]);

  // 컴포넌트 마운트 시 초기 데이터 로드
  useEffect(() => {
    // 이미 초기 로드가 완료되었으면 중복 호출 방지
    if (isInitialLoadRef.current) {
      return;
    }

    let isMounted = true;
    isInitialLoadRef.current = true;

    const loadData = async () => {
      if (isMounted) {
        console.log('포인트/머니 초기 로드 시작');
        await loadInitialBalance(); // 잔액 한 번만 로드
        await loadPointData(); // 거래 내역 로드
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, []); // 빈 의존성 배열로 마운트 시에만 실행

  // 탭 변경 또는 포인트 월별 조회 변경 시 데이터 로드
  useEffect(() => {
    // 초기 로드가 완료된 후에만 탭/월 변경 시 데이터 로드
    if (isInitialLoadRef.current) {
      loadPointData();
    }
  }, [activeTab, selectedYear, selectedMonth]);

  // 무한 스크롤 더보기 함수
  const handleLoadMore = async () => {
    if (isLoadingMore || !hasNext) return;

    try {
      setIsLoadingMore(true);
      setError(null);

      // 포인트와 머니 모두 20개씩 추가
      const increment = 20;
      const newSize = currentSize + increment;
      setCurrentSize(newSize);

      // 더보기 API 호출 (포인트는 월별 조회, 머니는 전체 조회)
      const historyResponse =
        activeTab === 'POINT'
          ? await getHistory(activeTab, newSize, selectedYear, selectedMonth)
          : await getHistory(activeTab, newSize);
      console.log(
        `${activeTab} 더보기 API 응답 (size: ${newSize}):`,
        historyResponse
      );

      const newHistory = historyResponse.contents || [];
      setAllHistory(newHistory);

      // hasNext 값에 따라 더보기 여부 결정
      setHasNext(historyResponse.hasNext);

      // 포인트 탭에서 더보기 시에도 잔액 업데이트
      if (activeTab === 'POINT' && newHistory.length > 0) {
        // 해당 월의 가장 최신 거래 내역의 balanceAfter로 잔액 업데이트
        const latestTransaction = newHistory[0];
        const balanceAfterValue =
          typeof latestTransaction.balanceAfter === 'number'
            ? latestTransaction.balanceAfter
            : parseFloat(latestTransaction.balanceAfter.replace(/,/g, ''));

        setBalance((prev) => ({
          ...prev,
          point: balanceAfterValue,
        }));

        console.log(`포인트 잔액 업데이트 (더보기): ${balanceAfterValue}P`);
      } else if (activeTab === 'POINT' && newHistory.length === 0) {
        // 해당 월에 거래 내역이 없으면 이전 상태 유지
        console.log(
          '해당 월에 포인트 거래 내역이 없어 잔액을 유지합니다. (더보기)'
        );
      }

      // 머니 탭에서 더보기 시에도 잔액 업데이트 (최신 값과 다르면)
      if (activeTab === 'MONEY' && newHistory.length > 0) {
        const latestTransaction = newHistory[0];
        const balanceAfterValue =
          typeof latestTransaction.balanceAfter === 'number'
            ? latestTransaction.balanceAfter
            : parseFloat(latestTransaction.balanceAfter.replace(/,/g, ''));

        // 현재 잔액과 다르면 업데이트
        if (balance.money !== balanceAfterValue) {
          setBalance((prev) => ({
            ...prev,
            money: balanceAfterValue,
          }));

          console.log(
            `머니 잔액 업데이트 (더보기): ${balance.money}S → ${balanceAfterValue}S`
          );
        }
      }

      console.log(`${activeTab} 더보기 완료 (총 ${newHistory.length}개)`);
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      console.error('더보기 로드 실패:', err);
    } finally {
      setIsLoadingMore(false);
    }
  };

  // 디버깅용: 상태 변화 확인
  useEffect(() => {
    console.log('상태 변화:', {
      isLoading,
      error,
      balance,
      allHistoryLength: allHistory?.length,
      activeTab,
    });
  }, [isLoading, error, balance, allHistory, activeTab]);

  // 현재 탭에 따른 내역 (API에서 이미 필터링됨)
  const currentHistory = allHistory;

  // 데이터 새로고침 함수
  const handleRefreshData = useCallback(async () => {
    try {
      // 내역만 새로고침
      await loadPointData();
      console.log('데이터 새로고침 완료');
    } catch (error) {
      console.error('데이터 새로고침 실패:', error);
    }
  }, []);

  // 연도 변경 핸들러
  const handleYearChange = (year: number) => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;

    setSelectedYear(year);

    // 현재 연도로 변경된 경우, 현재 월보다 큰 월이 선택되어 있다면 현재 월로 조정
    if (year === currentYear && selectedMonth > currentMonth) {
      setSelectedMonth(currentMonth);
    }
  };

  // 탭 변경 핸들러
  const handleTabChange = (newTab: AssetType) => {
    setActiveTab(newTab);
    // URL 업데이트 (브라우저 히스토리에 추가)
    const url = new URL(window.location.href);
    url.searchParams.set('type', newTab);
    window.history.pushState({}, '', url.toString());
  };

  const tabs = useMemo(
    () => [
      { id: 'POINT', label: '포인트' },
      { id: 'MONEY', label: '머니' },
    ],
    []
  );

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
      const currentIndex = tabs.findIndex((tab) => tab.id === activeTab);

      if (deltaX > 0 && currentIndex > 0) {
        // 오른쪽으로 스와이프 - 이전 탭
        handleTabChange(tabs[currentIndex - 1].id as AssetType);
      } else if (deltaX < 0 && currentIndex < tabs.length - 1) {
        // 왼쪽으로 스와이프 - 다음 탭
        handleTabChange(tabs[currentIndex + 1].id as AssetType);
      }
    }

    setIsDragging(false);
  }, [isDragging, currentX, startX, activeTab, tabs]);

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
          <span className="text-gray-900 font-medium">포인트 • 머니</span>
        </div>
      </nav>

      {/* 제목과 설명 */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">포인트 • 머니</h1>
        <p className="text-gray-600 text-lg">스낵 포인트와 머니를 관리하세요</p>
      </div>

      {/* 요약 카드 */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <img src="/snac-price.svg" alt="스낵 포인트" className="w-5 h-5" />
            <span className="text-sm font-medium text-blue-700">
              스낵 포인트
            </span>
          </div>
          <div className="text-2xl font-bold text-blue-900">
            {balance.point?.toLocaleString()}P
          </div>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <img src="/snac-price.svg" alt="스낵 머니" className="w-5 h-5" />
            <span className="text-sm font-medium text-green-700">
              스낵 머니
            </span>
          </div>
          <div className="text-2xl font-bold text-green-900">
            {balance.money?.toLocaleString()}S
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
            <img src="/snac-price.svg" alt="스낵 포인트" className="w-4 h-4" />
            <span className="text-xs font-medium text-blue-700">
              스낵 포인트
            </span>
          </div>
          <div className="text-lg font-bold text-blue-900">
            {balance.point?.toLocaleString()}P
          </div>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <img src="/snac-price.svg" alt="스낵 머니" className="w-4 h-4" />
            <span className="text-xs font-medium text-green-700">
              스낵 머니
            </span>
          </div>
          <div className="text-lg font-bold text-green-900">
            {balance.money?.toLocaleString()}S
          </div>
        </div>
      </div>
    </div>
  );

  // 로딩 컴포넌트
  const LoadingState = () => (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="p-6">
        <div className="space-y-4">
          {[...Array(3)].map((_, index) => (
            <div
              key={index}
              className="flex items-center gap-3 p-3 animate-pulse"
            >
              <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-32"></div>
                <div className="h-3 bg-gray-200 rounded w-20"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // 에러 컴포넌트
  const ErrorState = () => {
    // 에러 발생 시 바로 로그인 페이지로 이동
    useEffect(() => {
      console.log('포인트 페이지 에러 발생, 로그인 페이지로 이동:', error);
      toast.error('로그인 후 이용이 가능합니다.');
      router.push('/login');
    }, [error, router]);

    return (
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6">
          <div className="text-center py-8">
            <div className="text-gray-500">로그인 페이지로 이동 중...</div>
          </div>
        </div>
      </div>
    );
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
              aria-labelledby="point-history-title"
            >
              {isLoading ? (
                <LoadingState />
              ) : error ? (
                <ErrorState />
              ) : (
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
                  <PointContent
                    tabs={tabs}
                    activeTab={activeTab}
                    setActiveTab={handleTabChange}
                    pointsHistory={activeTab === 'POINT' ? currentHistory : []}
                    moneyHistory={activeTab === 'MONEY' ? currentHistory : []}
                    hasNext={hasNext}
                    onLoadMore={handleLoadMore}
                    isLoadingMore={isLoadingMore}
                    balance={balance}
                    selectedYear={selectedYear}
                    selectedMonth={selectedMonth}
                    onYearChange={handleYearChange}
                    onMonthChange={setSelectedMonth}
                    onRefreshData={handleRefreshData}
                    isDragging={isDragging}
                  />
                </motion.div>
              )}
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}

// 로딩 컴포넌트
function LoadingFallback() {
  return (
    <div className="min-h-screen bg-white w-full">
      <div className="flex w-full min-h-screen">
        <div className="hidden md:block w-64 flex-shrink-0 md:pt-8 md:pl-4">
          <SideMenu />
        </div>
        <main className="flex-1 flex flex-col md:pt-8 pt-4 md:px-6 px-2">
          <div className="max-w-4xl mx-auto w-full">
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-6">
                <div className="space-y-4">
                  {[...Array(3)].map((_, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 animate-pulse"
                    >
                      <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-32"></div>
                        <div className="h-3 bg-gray-200 rounded w-20"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

/**
 * @author 이승우
 * @description 포인트/머니 내역 페이지 컴포넌트
 * @returns 포인트와 머니 거래 내역을 탭으로 구분하여 표시하는 페이지
 */
export default function PointPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <PointPageContent />
    </Suspense>
  );
}
