'use client';

import React, { useState, useMemo } from 'react';
import TabNavigation from '@/app/(shared)/components/TabNavigation';

interface HistoryItem {
  id: number;
  description: string;
  amount: number;
  type: 'earned' | 'spent';
  date: string;
}

interface PointContentProps {
  tabs: { id: string; label: string }[];
  activeTab: 'points' | 'money';
  setActiveTab: (tabId: 'points' | 'money') => void;
  pointsHistory: HistoryItem[];
  moneyHistory: HistoryItem[];
}

type FilterType = 'all' | 'earned' | 'spent';

export default function PointContent({
  tabs,
  activeTab,
  setActiveTab,
  pointsHistory,
  moneyHistory,
}: PointContentProps) {
  const [pointsFilter, setPointsFilter] = useState<FilterType>('all');
  const [moneyFilter, setMoneyFilter] = useState<FilterType>('all');

  // 탭이 바뀔 때 필터 초기화
  React.useEffect(() => {
    if (activeTab === 'points') setPointsFilter('all');
    if (activeTab === 'money') setMoneyFilter('all');
  }, [activeTab]);

  // 필터링된 거래 내역
  const filteredPointsHistory = useMemo(() => {
    if (pointsFilter === 'all') return pointsHistory;
    return pointsHistory.filter((item) => item.type === pointsFilter);
  }, [pointsHistory, pointsFilter]);

  const filteredMoneyHistory = useMemo(() => {
    if (moneyFilter === 'all') return moneyHistory;
    return moneyHistory.filter((item) => item.type === moneyFilter);
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
        onTabChange={(tabId) => setActiveTab(tabId as 'points' | 'money')}
        activeTextColor="text-blue-600"
        inactiveTextColor="text-gray-500"
        underlineColor="bg-blue-600"
      />

      <div className="p-6">
        {activeTab === 'points' ? (
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
                          {item.description}
                        </span>
                        <span
                          className={`font-semibold ${
                            item.type === 'earned'
                              ? 'text-green-600'
                              : 'text-pink-600'
                          }`}
                        >
                          {item.type === 'earned' ? '+' : ''}
                          {item.amount}P
                        </span>
                      </div>
                      <span className="text-sm text-gray-500">{item.date}</span>
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
            </div>
          </div>
        ) : (
          <div>
            {/* 충전 버튼 */}
            <button className="w-full bg-green-500 text-white py-4 rounded-lg font-medium mb-6">
              충전
            </button>

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
                          {item.description}
                        </span>
                        <span
                          className={`font-semibold ${
                            item.type === 'earned'
                              ? 'text-green-600'
                              : 'text-pink-600'
                          }`}
                        >
                          {item.type === 'earned' ? '+' : ''}
                          {item.amount.toLocaleString()}S
                        </span>
                      </div>
                      <span className="text-sm text-gray-500">{item.date}</span>
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
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
