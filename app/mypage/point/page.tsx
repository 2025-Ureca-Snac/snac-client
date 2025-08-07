'use client';

import {
  useState,
  useEffect,
  Suspense,
  useRef,
  useMemo,
  useCallback,
} from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import TabNavigation from '@/app/(shared)/components/TabNavigation';
import AnimatedTabContent from '@/app/(shared)/components/AnimatedTabContent';
import { useSwipeNavigation } from '@/app/(shared)/hooks/useSwipeNavigation';

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
import RechargeModal from '@/app/(shared)/components/recharge-modal';
import SettlementModal from '@/app/(shared)/components/settlement-modal';
import CancelModal from '@/app/(shared)/components/cancel-modal';

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
    url += `&yearMonth=${year}-${month.toString().padStart(2, '0')}`;
  }

  const response = await api.get<ApiResponse<PointHistoryResponse>>(url);
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

  // 모달 상태 관리
  const [isRechargeModalOpen, setIsRechargeModalOpen] = useState(false);
  const [isSettlementModalOpen, setIsSettlementModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [selectedCancelAmount, setSelectedCancelAmount] = useState<number>(0);
  const [selectedCancelPaymentKey, setSelectedCancelPaymentKey] =
    useState<string>('');

  // 잔액 조회 API 함수
  const getBalance = async (): Promise<BalanceResponse> => {
    const response =
      await api.get<ApiResponse<BalanceResponse>>('/wallets/summary');
    return response.data.data;
  };

  // 초기 잔액 로드 (한 번만 호출)
  const loadInitialBalance = useCallback(async () => {
    try {
      const balanceResponse = await getBalance();
      setBalance(balanceResponse);
    } catch {
      // 잔액 로드 실패 처리
    }
  }, []);

  // 포인트/머니 데이터 로드 (거래 내역만)
  const loadPointData = useCallback(async () => {
    // 무한 로딩 방지
    if (isLoadingRef.current) {
      return;
    }

    try {
      isLoadingRef.current = true;
      setIsLoading(true);
      // 포인트와 머니 모두 20개씩 불러오기
      const size = 20;
      setCurrentSize(size);
      setError(null);

      // 현재 활성 탭에 따른 내역 조회 (포인트는 월별 조회, 머니는 전체 조회)
      const historyResponse =
        activeTab === 'POINT'
          ? await getHistory(activeTab, size, selectedYear, selectedMonth)
          : await getHistory(activeTab, size);

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
      } else if (activeTab === 'POINT' && newHistory.length === 0) {
        // 해당 월에 거래 내역이 없으면 이전 상태 유지
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
        }
      }
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
      isLoadingRef.current = false;
    }
  }, [activeTab, selectedYear, selectedMonth]); // balance.money 의존성 제거로 무한 observer 재설정 방지

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
        await loadInitialBalance(); // 잔액 한 번만 로드
        await loadPointData(); // 거래 내역 로드
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, [loadInitialBalance, loadPointData]); // 의존성 배열 수정

  // 탭 변경 또는 포인트 월별 조회 변경 시 데이터 로드 (초기 중복 방지)
  const prevValuesRef = useRef({ activeTab, selectedYear, selectedMonth });
  useEffect(() => {
    const currentValues = { activeTab, selectedYear, selectedMonth };
    const prevValues = prevValuesRef.current;

    // 값이 실제로 변경되었고, 초기 로드가 완료된 경우에만 실행
    const hasChanged =
      prevValues.activeTab !== currentValues.activeTab ||
      prevValues.selectedYear !== currentValues.selectedYear ||
      prevValues.selectedMonth !== currentValues.selectedMonth;

    if (!isInitialLoadRef.current || !hasChanged) {
      prevValuesRef.current = currentValues; // 값 업데이트
      return; // 초기 로드 미완료 또는 값 변경 없음
    }

    loadPointData();

    // 이전 값 업데이트
    prevValuesRef.current = currentValues;
  }, [activeTab, selectedYear, selectedMonth, loadPointData]); // 실제 변경되는 값들 의존성

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
      } else if (activeTab === 'POINT' && newHistory.length === 0) {
        // 해당 월에 거래 내역이 없으면 이전 상태 유지
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
        }
      }
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
    } finally {
      setIsLoadingMore(false);
    }
  };

  // 현재 탭에 따른 내역 (API에서 이미 필터링됨)
  const currentHistory = allHistory;

  // 데이터 새로고침 함수
  const handleRefreshData = async () => {
    try {
      // 내역만 새로고침
      await loadPointData();
    } catch {
      // 데이터 새로고침 실패 처리
    }
  };

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
  const handleTabChange = useCallback((newTab: AssetType) => {
    setActiveTab(newTab);
    // URL 업데이트 (브라우저 히스토리에 추가)
    const url = new URL(window.location.href);
    url.searchParams.set('type', newTab);
    window.history.pushState({}, '', url.toString());
  }, []);

  // 스와이프 네비게이션 훅
  const { onTouchStart, onTouchEnd } = useSwipeNavigation({
    onSwipeLeft: () => {
      if (activeTab === 'POINT') {
        handleTabChange('MONEY');
      }
    },
    onSwipeRight: () => {
      if (activeTab === 'MONEY') {
        handleTabChange('POINT');
      }
    },
    threshold: 50,
  });

  const tabs = useMemo(
    () => [
      { id: 'POINT', label: '포인트' },
      { id: 'MONEY', label: '머니' },
    ],
    []
  );

  // PC 헤더
  const DesktopHeader = () => (
    <div className="hidden md:block mb-8">
      {/* 네비게이션 */}
      <nav aria-label="페이지 네비게이션">
        <div className="flex items-center gap-2 mb-4">
          <Link
            href="/mypage"
            className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
          >
            마이페이지
          </Link>
          <span className="text-gray-400 dark:text-gray-500" aria-hidden="true">
            /
          </span>
          <span className="text-gray-900 dark:text-white font-medium">
            포인트 • 머니
          </span>
        </div>
      </nav>

      {/* 제목과 설명 */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          포인트 • 머니
        </h1>
        <p className="text-gray-600 dark:text-gray-300 text-lg">
          스낵 포인트와 머니를 관리하세요
        </p>
      </div>

      {/* 요약 카드 */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Image
              src="/snac-price.svg"
              alt="스낵 포인트"
              width={20}
              height={20}
              className="w-5 h-5"
            />
            <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
              스낵 포인트
            </span>
          </div>
          <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
            {balance.point?.toLocaleString()}P
          </div>
        </div>
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Image
              src="/snac-price.svg"
              alt="스낵 머니"
              width={20}
              height={20}
              className="w-5 h-5"
            />
            <span className="text-sm font-medium text-green-700 dark:text-green-300">
              스낵 머니
            </span>
          </div>
          <div className="text-2xl font-bold text-green-900 dark:text-green-100">
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
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <Image
              src="/snac-price.svg"
              alt="스낵 포인트"
              width={16}
              height={16}
              className="w-4 h-4"
            />
            <span className="text-xs font-medium text-blue-700 dark:text-blue-300">
              스낵 포인트
            </span>
          </div>
          <div className="text-lg font-bold text-blue-900 dark:text-blue-100">
            {balance.point?.toLocaleString()}P
          </div>
        </div>
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <Image
              src="/snac-price.svg"
              alt="스낵 머니"
              width={16}
              height={16}
              className="w-4 h-4"
            />
            <span className="text-xs font-medium text-green-700 dark:text-green-300">
              스낵 머니
            </span>
          </div>
          <div className="text-lg font-bold text-green-900 dark:text-green-100">
            {balance.money?.toLocaleString()}S
          </div>
        </div>
      </div>
    </div>
  );

  // 로딩 컴포넌트
  const LoadingState = () => (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="p-6">
        <div className="space-y-4">
          {[...Array(3)].map((_, index) => (
            <div
              key={index}
              className="flex items-center gap-3 p-3 animate-pulse"
            >
              <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
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
      toast.error('로그인 후 이용이 가능합니다.');
      router.push('/login');
    }, []);

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
              aria-labelledby="point-history-title"
            >
              {isLoading ? (
                <LoadingState />
              ) : error ? (
                <ErrorState />
              ) : (
                <div className="space-y-6">
                  {/* 탭 네비게이션 - 고정 */}
                  <TabNavigation
                    tabs={tabs}
                    activeTab={activeTab}
                    onTabChange={(tabId: string) =>
                      handleTabChange(tabId as AssetType)
                    }
                    disableDrag={true}
                  />

                  {/* 스와이프 가능한 콘텐츠 영역 */}
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                    <AnimatedTabContent tabKey={activeTab}>
                      <motion.div
                        className="select-none overflow-hidden"
                        drag="x"
                        dragConstraints={{ left: 0, right: 0 }}
                        dragElastic={0.2}
                        onTouchStart={onTouchStart}
                        onTouchEnd={onTouchEnd}
                        onDragEnd={(event, info) => {
                          const deltaX = info.offset.x;
                          const threshold = 100; // PC에서는 더 큰 임계값

                          if (Math.abs(deltaX) > threshold) {
                            if (deltaX > 0 && activeTab === 'MONEY') {
                              handleTabChange('POINT');
                            } else if (deltaX < 0 && activeTab === 'POINT') {
                              handleTabChange('MONEY');
                            }
                          }
                        }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{
                          type: 'spring',
                          stiffness: 200,
                          damping: 25,
                        }}
                      >
                        <PointContent
                          activeTab={activeTab}
                          pointsHistory={
                            activeTab === 'POINT' ? currentHistory : []
                          }
                          moneyHistory={
                            activeTab === 'MONEY' ? currentHistory : []
                          }
                          hasNext={hasNext}
                          onLoadMore={handleLoadMore}
                          isLoadingMore={isLoadingMore}
                          balance={balance}
                          selectedYear={selectedYear}
                          selectedMonth={selectedMonth}
                          onYearChange={handleYearChange}
                          onMonthChange={setSelectedMonth}
                          onRefreshData={handleRefreshData}
                          onRechargeClick={() => setIsRechargeModalOpen(true)}
                          onSettlementClick={() =>
                            setIsSettlementModalOpen(true)
                          }
                          onCancelClick={(amount, paymentKey) => {
                            setSelectedCancelAmount(amount);
                            setSelectedCancelPaymentKey(paymentKey);
                            setIsCancelModalOpen(true);
                          }}
                        />
                      </motion.div>
                    </AnimatedTabContent>
                  </div>
                </div>
              )}
            </section>
          </div>
        </main>
      </div>

      {/* 모달들을 motion.div 완전히 밖으로 이동 */}
      <RechargeModal
        open={isRechargeModalOpen}
        onClose={() => setIsRechargeModalOpen(false)}
        currentMoney={balance.money}
        onRefreshData={handleRefreshData}
      />
      <SettlementModal
        open={isSettlementModalOpen}
        onClose={() => setIsSettlementModalOpen(false)}
        currentMoney={balance.money}
        onSettlementSuccess={() => {
          setIsSettlementModalOpen(false);
          handleRefreshData?.();
        }}
      />
      <CancelModal
        open={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        amount={selectedCancelAmount}
        paymentKey={selectedCancelPaymentKey}
        onCancelSuccess={() => {
          setIsCancelModalOpen(false);
        }}
        onRefreshData={handleRefreshData}
      />
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
