'use client';

import React, {
  useState,
  useMemo,
  useEffect,
  useRef,
  useCallback,
} from 'react';

import { PointHistoryItem } from '@/app/(shared)/types/point-history';
import {
  PointContentProps,
  MoneyFilterType,
  PointFilterType,
} from '@/app/(shared)/types/point-content';

/**
 * @author 이승우
 * @description 포인트/머니 내역 컨텐츠 컴포넌트
 * @param props - 컴포넌트 props
 * @returns 포인트와 머니 거래 내역을 표시하는 컨텐츠
 */
export default function PointContent({
  activeTab,
  pointsHistory,
  moneyHistory,
  hasNext,
  onLoadMore,
  isLoadingMore,
  selectedYear,
  selectedMonth,
  onYearChange,
  onMonthChange,
  onRechargeClick,
  onSettlementClick,
  onCancelClick,
}: PointContentProps) {
  const [pointsFilter, setPointsFilter] = useState<PointFilterType>('all');
  const [moneyFilter, setMoneyFilter] = useState<MoneyFilterType>('all');

  // 무한 스크롤을 위한 ref
  const observerRef = useRef<HTMLDivElement>(null);

  // Intersection Observer 콜백
  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const target = entries[0];
      if (target.isIntersecting && hasNext && !isLoadingMore) {
        onLoadMore();
      }
    },
    [hasNext, isLoadingMore, onLoadMore]
  );

  // Intersection Observer 설정
  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, {
      threshold: 0.1,
    });

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => observer.disconnect();
  }, [handleObserver]);

  // 탭이 바뀔 때 필터 초기화
  React.useEffect(() => {
    if (activeTab === 'POINT') setPointsFilter('all');
    if (activeTab === 'MONEY') setMoneyFilter('all');
  }, [activeTab]);

  // signedAmount의 부호에 따라 충전/사용 판단하는 함수
  const getTransactionType = (signedAmount: string): 'earned' | 'spent' => {
    // 쉼표 제거 후 파싱
    const cleanAmount = signedAmount.replace(/,/g, '');
    const amount = parseFloat(cleanAmount);
    return amount >= 0 ? 'earned' : 'spent';
  };

  // signedAmount에서 숫자만 추출하는 함수
  const getAmountValue = (signedAmount: string): number => {
    // 쉼표 제거 후 파싱
    const cleanAmount = signedAmount.replace(/,/g, '');
    return Math.abs(parseFloat(cleanAmount));
  };

  // balanceAfter를 안전하게 숫자로 변환하는 함수
  const getBalanceAfterValue = (balanceAfter: string | number): number => {
    if (typeof balanceAfter === 'number') {
      return balanceAfter;
    }
    // 문자열인 경우 쉼표 제거 후 파싱
    return parseFloat(balanceAfter.replace(/,/g, ''));
  };

  // 필터링된 거래 내역
  const filteredPointsHistory = useMemo(() => {
    if (pointsFilter === 'all') return pointsHistory;
    return pointsHistory.filter((item) => item.category === pointsFilter);
  }, [pointsHistory, pointsFilter]);

  const filteredMoneyHistory = useMemo(() => {
    if (moneyFilter === 'all') return moneyHistory;
    return moneyHistory.filter((item) => item.category === moneyFilter);
  }, [moneyHistory, moneyFilter]);

  // 포인트 필터 버튼 컴포넌트
  const PointsFilterButtons = () => (
    <div className="flex flex-wrap gap-2 py-1">
      <button
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          setPointsFilter('all');
        }}
        onMouseDown={(e) => e.stopPropagation()}
        className={`px-3 py-1 text-sm rounded-full transition-colors ${
          pointsFilter === 'all'
            ? 'bg-blue-600 text-white'
            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
        } disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        전체
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          setPointsFilter('적립');
        }}
        onMouseDown={(e) => e.stopPropagation()}
        onTouchStart={(e) => e.stopPropagation()}
        className={`px-3 py-1 text-sm rounded-full transition-colors ${
          pointsFilter === '적립'
            ? 'bg-blue-600 text-white'
            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
        } disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        적립
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          setPointsFilter('포인트 사용');
        }}
        onMouseDown={(e) => e.stopPropagation()}
        onTouchStart={(e) => e.stopPropagation()}
        className={`px-3 py-1 text-sm rounded-full transition-colors ${
          pointsFilter === '포인트 사용'
            ? 'bg-blue-600 text-white'
            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
        } disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        포인트 사용
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          setPointsFilter('취소');
        }}
        onMouseDown={(e) => e.stopPropagation()}
        onTouchStart={(e) => e.stopPropagation()}
        className={`px-3 py-1 text-sm rounded-full transition-colors ${
          pointsFilter === '취소'
            ? 'bg-blue-600 text-white'
            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
        } disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        취소
      </button>

      {/* 포인트 적립 버튼 */}
      {/* <button
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          // TODO: 포인트 적립 기능 구현 예정
          console.log('포인트 적립 버튼 클릭');
        }}
        onMouseDown={(e) => e.stopPropagation()}
        onTouchStart={(e) => e.stopPropagation()}
        className="ml-auto px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Image src="/snac-price.svg" alt="스낵" width={16} height={16} />
        적립
      </button> */}
    </div>
  );

  // 머니 필터 버튼 컴포넌트
  const MoneyFilterButtons = () => (
    <div className="flex flex-wrap gap-2 py-1">
      <button
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          setMoneyFilter('all');
        }}
        onMouseDown={(e) => e.stopPropagation()}
        className={`px-3 py-1 text-sm rounded-full transition-colors ${
          moneyFilter === 'all'
            ? 'bg-green-600 text-white'
            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
        } disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        전체
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          setMoneyFilter('충전');
        }}
        onMouseDown={(e) => e.stopPropagation()}
        onTouchStart={(e) => e.stopPropagation()}
        className={`px-3 py-1 text-sm rounded-full transition-colors ${
          moneyFilter === '충전'
            ? 'bg-green-600 text-white'
            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
        } disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        충전
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          setMoneyFilter('머니 구매');
        }}
        onMouseDown={(e) => e.stopPropagation()}
        onTouchStart={(e) => e.stopPropagation()}
        className={`px-3 py-1 text-sm rounded-full transition-colors ${
          moneyFilter === '머니 구매'
            ? 'bg-green-600 text-white'
            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
        } disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        구매
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          setMoneyFilter('판매');
        }}
        onMouseDown={(e) => e.stopPropagation()}
        onTouchStart={(e) => e.stopPropagation()}
        className={`px-3 py-1 text-sm rounded-full transition-colors ${
          moneyFilter === '판매'
            ? 'bg-green-600 text-white'
            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
        } disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        판매
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          setMoneyFilter('취소');
        }}
        onMouseDown={(e) => e.stopPropagation()}
        onTouchStart={(e) => e.stopPropagation()}
        className={`px-3 py-1 text-sm rounded-full transition-colors ${
          moneyFilter === '취소'
            ? 'bg-green-600 text-white'
            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
        }`}
      >
        취소
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          setMoneyFilter('정산');
        }}
        onMouseDown={(e) => e.stopPropagation()}
        onTouchStart={(e) => e.stopPropagation()}
        className={`px-3 py-1 text-sm rounded-full transition-colors ${
          moneyFilter === '정산'
            ? 'bg-green-600 text-white'
            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
        }`}
      >
        정산
      </button>

      {/* 머니 충전 및 정산 버튼 */}
      <div className="ml-auto flex gap-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            onRechargeClick?.();
          }}
          onMouseDown={(e) => e.stopPropagation()}
          className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          충전
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            onSettlementClick?.();
          }}
          onMouseDown={(e) => e.stopPropagation()}
          className="px-4 py-2 bg-orange-600 text-white text-sm rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          정산
        </button>
      </div>
    </div>
  );

  // 거래 내역 아이템 컴포넌트
  const HistoryItem = ({ item }: { item: PointHistoryItem }) => {
    const isPositive = getTransactionType(item.signedAmount) === 'earned';
    const amount = getAmountValue(item.signedAmount);
    const balanceAfter = getBalanceAfterValue(item.balanceAfter);

    return (
      <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-700 last:border-b-0">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              {item.title}
            </span>
            <span className="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
              {item.category}
            </span>
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {new Date(item.createdAt).toLocaleDateString('ko-KR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </div>
        </div>
        <div className="text-right">
          <div
            className={`text-lg font-semibold ${
              isPositive ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {isPositive ? '+' : '-'}
            {amount.toLocaleString()}
            {activeTab === 'POINT' ? 'P' : 'S'}
          </div>
          {activeTab === 'MONEY' && (
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {balanceAfter.toLocaleString()}S
            </div>
          )}
          {/* 머니 탭에서 충전 내역인 경우 취소 버튼 표시 */}
          {activeTab === 'MONEY' && isPositive && item.category === '충전' && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                onCancelClick?.(amount, item.paymentKey || item.id.toString());
              }}
              onMouseDown={(e) => e.stopPropagation()}
              className="text-xs px-2 py-1 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded hover:bg-red-200 dark:hover:bg-red-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-1"
            >
              취소
            </button>
          )}
        </div>
      </div>
    );
  };

  // 월별 선택 컴포넌트
  const MonthSelector = () => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;

    // 선택된 연도가 현재 연도인지 확인
    const isCurrentYear = selectedYear === currentYear;

    return (
      <div className="flex items-center gap-3 py-1">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          조회 기간:
        </span>
        <select
          value={selectedYear}
          onChange={(e) => {
            e.stopPropagation();
            onYearChange?.(Number(e.target.value));
          }}
          onMouseDown={(e) => e.stopPropagation()}
          className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        >
          {Array.from({ length: 5 }, (_, i) => currentYear - i).map((year) => (
            <option key={year} value={year}>
              {year}년
            </option>
          ))}
        </select>
        <select
          value={selectedMonth}
          onChange={(e) => {
            e.stopPropagation();
            onMonthChange?.(Number(e.target.value));
          }}
          onMouseDown={(e) => e.stopPropagation()}
          className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        >
          {Array.from({ length: 12 }, (_, i) => i + 1)
            .filter((month) => {
              // 현재 연도인 경우 현재 월까지만 선택 가능
              if (isCurrentYear) {
                return month <= currentMonth;
              }
              // 이전 연도인 경우 모든 월 선택 가능
              return true;
            })
            .map((month) => (
              <option key={month} value={month}>
                {month}월
              </option>
            ))}
        </select>
      </div>
    );
  };

  // 포인트 탭 컨텐츠
  const PointsTabContent = () => (
    <div className="space-y-4">
      <div className="px-4">
        <MonthSelector />
      </div>
      <div className="px-4">
        <PointsFilterButtons />
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        {filteredPointsHistory.length === 0 ? (
          <div className="p-6 text-center text-gray-500 dark:text-gray-400">
            {pointsFilter === 'all'
              ? '포인트 내역이 없습니다.'
              : '해당 카테고리의 포인트 내역이 없습니다.'}
          </div>
        ) : (
          <div>
            {filteredPointsHistory.map((item) => (
              <HistoryItem key={item.id} item={item} />
            ))}
            {/* 무한 스크롤 관찰자 */}
            {hasNext && (
              <div ref={observerRef} className="p-4 text-center">
                {isLoadingMore && (
                  <div className="text-gray-500 dark:text-gray-400">
                    로딩 중...
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );

  // 머니 탭 컨텐츠
  const MoneyTabContent = () => (
    <div className="space-y-4">
      <div className="px-4">
        <MoneyFilterButtons />
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        {filteredMoneyHistory.length === 0 ? (
          <div className="p-6 text-center text-gray-500 dark:text-gray-400">
            {moneyFilter === 'all'
              ? '머니 내역이 없습니다.'
              : '해당 카테고리의 머니 내역이 없습니다.'}
          </div>
        ) : (
          <div>
            {filteredMoneyHistory.map((item) => (
              <HistoryItem key={item.id} item={item} />
            ))}
            {/* 무한 스크롤 관찰자 */}
            {hasNext && (
              <div ref={observerRef} className="p-4 text-center">
                {isLoadingMore && (
                  <div className="text-gray-500 dark:text-gray-400">
                    로딩 중...
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6 p-4">
      {/* 탭별 컨텐츠 */}
      {activeTab === 'POINT' ? <PointsTabContent /> : <MoneyTabContent />}
    </div>
  );
}
