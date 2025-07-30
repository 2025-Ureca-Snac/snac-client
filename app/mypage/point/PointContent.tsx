'use client';

import React, { useState, useMemo } from 'react';
import TabNavigation from '@/app/(shared)/components/TabNavigation';
import RechargeModal from '@/app/(shared)/components/recharge-modal';
import TransferModal from '@/app/(shared)/components/transfer-modal';
import {
  PointHistoryItem,
  AssetType,
  BalanceResponse,
} from '@/app/(shared)/types/point-history';

interface PointContentProps {
  tabs: { id: string; label: string }[];
  activeTab: AssetType;
  setActiveTab: (tabId: AssetType) => void;
  pointsHistory: PointHistoryItem[];
  moneyHistory: PointHistoryItem[];
  hasMore: boolean;
  onLoadMore: () => void;
  isLoading: boolean;
  balance: BalanceResponse;
}

type FilterType = 'all' | 'earned' | 'spent';

export default function PointContent({
  tabs,
  activeTab,
  setActiveTab,
  pointsHistory,
  moneyHistory,
  hasMore,
  onLoadMore,
  isLoading,
  balance,
}: PointContentProps) {
  const [pointsFilter, setPointsFilter] = useState<FilterType>('all');
  const [moneyFilter, setMoneyFilter] = useState<FilterType>('all');
  const [isRechargeModalOpen, setIsRechargeModalOpen] = useState(false);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);

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

  // 필터링된 거래 내역
  const filteredPointsHistory = useMemo(() => {
    if (pointsFilter === 'all') return pointsHistory;
    return pointsHistory.filter(
      (item) => getTransactionType(item.signedAmount) === pointsFilter
    );
  }, [pointsHistory, pointsFilter]);

  const filteredMoneyHistory = useMemo(() => {
    if (moneyFilter === 'all') return moneyHistory;
    return moneyHistory.filter(
      (item) => getTransactionType(item.signedAmount) === moneyFilter
    );
  }, [moneyHistory, moneyFilter]);

  // 포인트 필터 버튼 컴포넌트
  const PointsFilterButtons = () => (
    <div className="flex gap-2 mb-4">
      <button
        onClick={() => setPointsFilter('all')}
        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
          pointsFilter === 'all'
            ? 'bg-gray-800 text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        전체
      </button>
      <button
        onClick={() => setPointsFilter('earned')}
        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
          pointsFilter === 'earned'
            ? 'bg-green-600 text-white'
            : 'bg-green-50 text-green-700 hover:bg-green-100 border border-green-200'
        }`}
      >
        충전
      </button>
      <button
        onClick={() => setPointsFilter('spent')}
        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
          pointsFilter === 'spent'
            ? 'bg-orange-600 text-white'
            : 'bg-orange-50 text-orange-700 hover:bg-orange-100 border border-orange-200'
        }`}
      >
        사용
      </button>
    </div>
  );

  // 머니 필터 버튼 컴포넌트
  const MoneyFilterButtons = () => (
    <div className="flex gap-2 mb-4">
      <button
        onClick={() => setMoneyFilter('all')}
        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
          moneyFilter === 'all'
            ? 'bg-gray-800 text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        전체
      </button>
      <button
        onClick={() => setMoneyFilter('earned')}
        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
          moneyFilter === 'earned'
            ? 'bg-green-600 text-white'
            : 'bg-green-50 text-green-700 hover:bg-green-100 border border-green-200'
        }`}
      >
        충전
      </button>
      <button
        onClick={() => setMoneyFilter('spent')}
        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
          moneyFilter === 'spent'
            ? 'bg-orange-600 text-white'
            : 'bg-orange-50 text-orange-700 hover:bg-orange-100 border border-orange-200'
        }`}
      >
        사용
      </button>
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      {/* 탭 네비게이션 */}
      <TabNavigation
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={(tabId) => setActiveTab(tabId as AssetType)}
        activeTextColor="text-blue-600"
        inactiveTextColor="text-gray-500"
        underlineColor="bg-blue-600"
      />

      <div className="p-6">
        {activeTab === 'POINT' ? (
          <div>
            {/* Snac 포인트 더 모으기 */}
            <div className="bg-green-500 rounded-lg p-4 mb-6 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-white">🥔</span>
                <span className="text-white font-medium">
                  Snac 포인트 더 모으기
                </span>
              </div>
              <span className="text-white">▶</span>
            </div>

            {/* 필터 버튼 */}
            <PointsFilterButtons />

            {/* 거래 내역 */}
            <div className="space-y-4">
              {filteredPointsHistory.length > 0 ? (
                filteredPointsHistory.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 p-3">
                    <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-900">
                          {item.title}
                        </span>
                        <div className="text-right">
                          <span
                            className={`font-semibold block ${
                              getTransactionType(item.signedAmount) === 'earned'
                                ? 'text-green-600'
                                : 'text-pink-600'
                            }`}
                          >
                            {getTransactionType(item.signedAmount) === 'earned'
                              ? '+'
                              : ''}
                            {getAmountValue(item.signedAmount).toLocaleString()}
                            P
                          </span>
                          <span className="text-xs text-gray-400">
                            잔액: {item.balanceAfter.toLocaleString()}P
                          </span>
                        </div>
                      </div>
                      <span className="text-sm text-gray-500">
                        {item.createdAt}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  {pointsFilter === 'all'
                    ? '거래 내역이 없습니다.'
                    : `${pointsFilter === 'earned' ? '충전' : '사용'} 내역이 없습니다.`}
                </div>
              )}

              {/* 더보기 버튼 */}
              {activeTab === 'POINT' && hasMore && (
                <div className="text-center pt-4">
                  <button
                    onClick={onLoadMore}
                    disabled={isLoading}
                    className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                      isLoading
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
                    }`}
                  >
                    {isLoading ? '로딩 중...' : '더보기'}
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div>
            {/* 충전/송금 버튼 */}
            <div className="flex gap-3 mb-6">
              <button
                onClick={() => setIsRechargeModalOpen(true)}
                className="flex-1 bg-green-500 text-white py-4 rounded-lg font-medium hover:bg-green-600 transition-colors"
              >
                충전
              </button>
              <button
                onClick={() => setIsTransferModalOpen(true)}
                className="flex-1 bg-blue-500 text-white py-4 rounded-lg font-medium hover:bg-blue-600 transition-colors"
              >
                송금
              </button>
            </div>

            {/* 필터 버튼 */}
            <MoneyFilterButtons />

            {/* 거래 내역 */}
            <div className="space-y-4">
              {filteredMoneyHistory.length > 0 ? (
                filteredMoneyHistory.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 p-3">
                    <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-900">
                          {item.title}
                        </span>
                        <div className="text-right">
                          <span
                            className={`font-semibold block ${
                              getTransactionType(item.signedAmount) === 'earned'
                                ? 'text-green-600'
                                : 'text-pink-600'
                            }`}
                          >
                            {getTransactionType(item.signedAmount) === 'earned'
                              ? '+'
                              : ''}
                            {getAmountValue(item.signedAmount).toLocaleString()}
                            S
                          </span>
                          <span className="text-xs text-gray-400">
                            잔액: {item.balanceAfter.toLocaleString()}S
                          </span>
                        </div>
                      </div>
                      <span className="text-sm text-gray-500">
                        {item.createdAt}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  {moneyFilter === 'all'
                    ? '거래 내역이 없습니다.'
                    : `${moneyFilter === 'earned' ? '충전' : '사용'} 내역이 없습니다.`}
                </div>
              )}

              {/* 더보기 버튼 */}
              {activeTab === 'MONEY' && hasMore && (
                <div className="text-center pt-4">
                  <button
                    onClick={onLoadMore}
                    disabled={isLoading}
                    className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                      isLoading
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-green-500 text-white hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2'
                    }`}
                  >
                    {isLoading ? '로딩 중...' : '더보기'}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 충전 모달 */}
      <RechargeModal
        open={isRechargeModalOpen}
        onClose={() => setIsRechargeModalOpen(false)}
        currentPoints={0}
        shortage={0}
        onRechargeSuccess={(amount) => {
          console.log('충전 성공:', amount);
          setIsRechargeModalOpen(false);
          // 필요시 페이지 새로고침 또는 데이터 다시 로드
        }}
      />

      {/* 송금 모달 */}
      <TransferModal
        open={isTransferModalOpen}
        onClose={() => setIsTransferModalOpen(false)}
        currentMoney={balance.money}
        onTransferSuccess={(amount, recipientId) => {
          console.log('송금 성공:', amount, recipientId);
          setIsTransferModalOpen(false);
          // 필요시 페이지 새로고침 또는 데이터 다시 로드
        }}
      />
    </div>
  );
}
