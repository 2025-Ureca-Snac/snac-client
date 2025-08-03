'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

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
    try {
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
    loadInitialBalance(); // 잔액 한 번만 로드
    loadPointData(); // 거래 내역 로드
  }, []);

  // 탭 변경 시 해당 탭의 내역 데이터 로드
  useEffect(() => {
    if (!isLoading) {
      loadPointData();
    }
  }, [activeTab]);

  // 포인트 탭에서 월별 조회 변경 시 데이터 다시 로드
  useEffect(() => {
    if (activeTab === 'POINT' && !isLoading) {
      loadPointData();
    }
  }, [selectedYear, selectedMonth]);

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
  const handleRefreshData = async () => {
    try {
      // 내역만 새로고침
      await loadPointData();
      console.log('데이터 새로고침 완료');
    } catch (error) {
      console.error('데이터 새로고침 실패:', error);
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

  const tabs = [
    { id: 'POINT', label: '포인트' },
    { id: 'MONEY', label: '머니' },
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
  const ErrorState = () => (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="p-6">
        <div className="text-center py-8">
          <div className="text-red-500 mb-2">오류가 발생했습니다</div>
          <div className="text-gray-500 mb-4">{error}</div>
          <button
            onClick={loadPointData}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            다시 시도
          </button>
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

            <section
              className="w-full max-w-full"
              aria-labelledby="point-history-title"
            >
              {isLoading ? (
                <LoadingState />
              ) : error ? (
                <ErrorState />
              ) : (
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
                  onYearChange={setSelectedYear}
                  onMonthChange={setSelectedMonth}
                  onRefreshData={handleRefreshData}
                />
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
