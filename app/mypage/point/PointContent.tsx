'use client';

import React, {
  useState,
  useMemo,
  useEffect,
  useRef,
  useCallback,
} from 'react';
import TabNavigation from '@/app/(shared)/components/TabNavigation';
import RechargeModal from '@/app/(shared)/components/recharge-modal';
import SettlementModal from '@/app/(shared)/components/settlement-modal';
import RefundModal from '@/app/(shared)/components/refund-modal';
import {
  PointHistoryItem,
  AssetType,
} from '@/app/(shared)/types/point-history';
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
  tabs,
  activeTab,
  setActiveTab,
  pointsHistory,
  moneyHistory,
  hasNext,
  onLoadMore,
  isLoadingMore,
  balance,
  selectedYear,
  selectedMonth,
  onYearChange,
  onMonthChange,
}: PointContentProps) {
  const [pointsFilter, setPointsFilter] = useState<PointFilterType>('all');
  const [moneyFilter, setMoneyFilter] = useState<MoneyFilterType>('all');
  const [isRechargeModalOpen, setIsRechargeModalOpen] = useState(false);
  const [isSettlementModalOpen, setIsSettlementModalOpen] = useState(false);
  const [isRefundModalOpen, setIsRefundModalOpen] = useState(false);
  const [selectedRefundAmount, setSelectedRefundAmount] = useState<number>(0);
  const [selectedRefundPaymentKey, setSelectedRefundPaymentKey] =
    useState<string>('');

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

  // URL 파라미터에서 모달 타입 확인
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const modalType = urlParams.get('modal');

    if (modalType === 'settlement') {
      setIsSettlementModalOpen(true);
      // URL에서 모달 파라미터 제거
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.delete('modal');
      window.history.replaceState({}, '', newUrl.toString());
    } else if (modalType === 'recharge') {
      setIsRechargeModalOpen(true);
      // URL에서 모달 파라미터 제거
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.delete('modal');
      window.history.replaceState({}, '', newUrl.toString());
    }
  }, []);

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
    <div className="flex flex-wrap gap-2 mb-4">
      <button
        onClick={() => setPointsFilter('all')}
        className={`px-3 py-1 text-sm rounded-full transition-colors ${
          pointsFilter === 'all'
            ? 'bg-blue-600 text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        전체
      </button>
      <button
        onClick={() => setPointsFilter('적립')}
        className={`px-3 py-1 text-sm rounded-full transition-colors ${
          pointsFilter === '적립'
            ? 'bg-blue-600 text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        적립
      </button>
      <button
        onClick={() => setPointsFilter('포인트 사용')}
        className={`px-3 py-1 text-sm rounded-full transition-colors ${
          pointsFilter === '포인트 사용'
            ? 'bg-blue-600 text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        포인트 사용
      </button>
      <button
        onClick={() => setPointsFilter('취소')}
        className={`px-3 py-1 text-sm rounded-full transition-colors ${
          pointsFilter === '취소'
            ? 'bg-blue-600 text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        취소
      </button>
    </div>
  );

  // 머니 필터 버튼 컴포넌트
  const MoneyFilterButtons = () => (
    <div className="flex flex-wrap gap-2 mb-4">
      <button
        onClick={() => setMoneyFilter('all')}
        className={`px-3 py-1 text-sm rounded-full transition-colors ${
          moneyFilter === 'all'
            ? 'bg-green-600 text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        전체
      </button>
      <button
        onClick={() => setMoneyFilter('충전')}
        className={`px-3 py-1 text-sm rounded-full transition-colors ${
          moneyFilter === '충전'
            ? 'bg-green-600 text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        충전
      </button>
      <button
        onClick={() => setMoneyFilter('머니 구매')}
        className={`px-3 py-1 text-sm rounded-full transition-colors ${
          moneyFilter === '머니 구매'
            ? 'bg-green-600 text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        구매
      </button>
      <button
        onClick={() => setMoneyFilter('판매')}
        className={`px-3 py-1 text-sm rounded-full transition-colors ${
          moneyFilter === '판매'
            ? 'bg-green-600 text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        판매
      </button>
      <button
        onClick={() => setMoneyFilter('취소')}
        className={`px-3 py-1 text-sm rounded-full transition-colors ${
          moneyFilter === '취소'
            ? 'bg-green-600 text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        취소
      </button>
      <button
        onClick={() => setMoneyFilter('정산')}
        className={`px-3 py-1 text-sm rounded-full transition-colors ${
          moneyFilter === '정산'
            ? 'bg-green-600 text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        정산
      </button>
    </div>
  );

  // 거래 내역 아이템 컴포넌트
  const HistoryItem = ({ item }: { item: PointHistoryItem }) => {
    const isPositive = getTransactionType(item.signedAmount) === 'earned';
    const amount = getAmountValue(item.signedAmount);
    const balanceAfter = getBalanceAfterValue(item.balanceAfter);

    return (
      <div className="flex items-center justify-between p-4 border-b border-gray-100 last:border-b-0">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-medium text-gray-900">
              {item.title}
            </span>
            <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">
              {item.category}
            </span>
          </div>
          <div className="text-sm text-gray-500">
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
            <div className="text-sm text-gray-500">
              {balanceAfter.toLocaleString()}S
            </div>
          )}
          {/* 머니 탭에서 충전 내역인 경우 환불 버튼 표시 */}
          {activeTab === 'MONEY' && isPositive && item.category === '충전' && (
            <button
              onClick={() => {
                setSelectedRefundAmount(amount);
                setSelectedRefundPaymentKey(
                  item.paymentKey || item.id.toString()
                );
                setIsRefundModalOpen(true);
              }}
              className="text-xs bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition-colors mt-1"
            >
              환불
            </button>
          )}
        </div>
      </div>
    );
  };

  // 월별 선택 컴포넌트
  const MonthSelector = () => (
    <div className="flex items-center gap-3 mb-4">
      <span className="text-sm font-medium text-gray-700">조회 기간:</span>
      <select
        value={selectedYear}
        onChange={(e) => onYearChange?.(Number(e.target.value))}
        className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map(
          (year) => (
            <option key={year} value={year}>
              {year}년
            </option>
          )
        )}
      </select>
      <select
        value={selectedMonth}
        onChange={(e) => onMonthChange?.(Number(e.target.value))}
        className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
          <option key={month} value={month}>
            {month}월
          </option>
        ))}
      </select>
    </div>
  );

  // 포인트 탭 컨텐츠
  const PointsTabContent = () => (
    <div>
      <MonthSelector />
      <PointsFilterButtons />
      <div className="bg-white rounded-lg shadow-sm border">
        {filteredPointsHistory.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            {pointsFilter === 'all'
              ? '거래 내역이 없습니다.'
              : '해당 카테고리의 거래 내역이 없습니다.'}
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
                  <div className="text-gray-500">로딩 중...</div>
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
    <div>
      <MoneyFilterButtons />
      <div className="bg-white rounded-lg shadow-sm border">
        {filteredMoneyHistory.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            {moneyFilter === 'all'
              ? '거래 내역이 없습니다.'
              : '해당 카테고리의 거래 내역이 없습니다.'}
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
                  <div className="text-gray-500">로딩 중...</div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* 탭 네비게이션 */}
      <TabNavigation
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={(tabId: string) => setActiveTab(tabId as AssetType)}
      />

      {/* 탭별 컨텐츠 */}
      {activeTab === 'POINT' ? <PointsTabContent /> : <MoneyTabContent />}

      {/* 모달들 */}
      <RechargeModal
        open={isRechargeModalOpen}
        onClose={() => setIsRechargeModalOpen(false)}
        currentPoints={balance.point}
        onRechargeSuccess={(amount) => {
          console.log('충전 성공:', amount);
          setIsRechargeModalOpen(false);
        }}
      />
      <SettlementModal
        open={isSettlementModalOpen}
        onClose={() => setIsSettlementModalOpen(false)}
        currentMoney={balance.money}
        onSettlementSuccess={(amount, type) => {
          console.log('정산 성공:', amount, type);
          setIsSettlementModalOpen(false);
        }}
      />
      <RefundModal
        open={isRefundModalOpen}
        onClose={() => setIsRefundModalOpen(false)}
        amount={selectedRefundAmount}
        paymentKey={selectedRefundPaymentKey}
        onRefundSuccess={(amount) => {
          console.log('환불 성공:', amount);
          setIsRefundModalOpen(false);
        }}
      />
    </div>
  );
}
