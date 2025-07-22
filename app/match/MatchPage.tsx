'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '../(shared)/components/Header';
import { Footer } from '../(shared)/components/Footer';
import FilterSection, {
  SellerRegistrationInfo,
} from './components/FilterSection';
import ResultSection from './components/ResultSection';
import { Filters } from './types';
import { User } from './types/match';
import { useMatchStore } from '../(shared)/stores/match-store';
import { useRealTimeMatching } from '../(shared)/utils/realtime';

// 실시간 매칭 상태 타입
type MatchingStatus = 'idle' | 'requesting' | 'requested' | 'matched';

interface TradeRequest {
  id: string;
  buyerId: string;
  buyerName: string;
  sellerId: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
}

// 샘플 유저 데이터
const ALL_USERS: User[] = [
  {
    id: 1,
    type: 'buyer',
    name: 'user04',
    carrier: 'SKT',
    data: 1,
    price: 1500,
    rating: 4.8,
    transactionCount: 125,
  },
  {
    id: 2,
    type: 'buyer',
    name: 'user02',
    carrier: 'SKT',
    data: 0.5,
    price: 1400,
    rating: 4.6,
    transactionCount: 89,
  },
  {
    id: 3,
    type: 'seller',
    name: 'user07',
    carrier: 'KT',
    data: 2,
    price: 2000,
    rating: 4.9,
    transactionCount: 156,
  },
  {
    id: 4,
    type: 'seller',
    name: 'user10',
    carrier: 'LG U+',
    data: 1,
    price: 1200,
    rating: 4.5,
    transactionCount: 67,
  },
  {
    id: 5,
    type: 'buyer',
    name: 'user15',
    carrier: 'KT',
    data: 1.5,
    price: 1600,
    rating: 4.7,
    transactionCount: 98,
  },
];

export default function MatchPage() {
  const router = useRouter();
  const { foundMatch } = useMatchStore();
  const { connect, disconnect, addEventListener, removeEventListener } =
    useRealTimeMatching();

  // 필터링 상태
  const [pendingFilters, setPendingFilters] = useState<Filters>({
    transactionType: [],
    carrier: [],
    dataAmount: [],
    price: [],
  });

  const [appliedFilters, setAppliedFilters] = useState<Filters>({
    transactionType: [],
    carrier: [],
    dataAmount: [],
    price: [],
  });

  // 실시간 매칭 상태
  const [matchingStatus, setMatchingStatus] = useState<MatchingStatus>('idle');
  const [activeSellers, setActiveSellers] = useState<User[]>([]);
  const [incomingRequests, setIncomingRequests] = useState<TradeRequest[]>([]);

  // 판매자 등록 정보
  const [sellerInfo, setSellerInfo] = useState<SellerRegistrationInfo>({
    dataAmount: 1,
    price: 1500,
    carrier: 'SKT',
    isActive: false,
  });

  // 현재 사용자 역할
  const userRole =
    appliedFilters.transactionType[0] === '구매자'
      ? 'buyer'
      : appliedFilters.transactionType[0] === '판매자'
        ? 'seller'
        : null;

  // 필터링된 유저 목록
  const filteredUsers = useMemo(() => {
    if (appliedFilters.transactionType.includes('__RESET__')) {
      return [];
    }

    const sourceUsers = activeSellers.length > 0 ? activeSellers : ALL_USERS;

    return sourceUsers.filter((user) => {
      // 거래 방식 필터
      if (appliedFilters.transactionType.length > 0) {
        const userType = user.type === 'buyer' ? '구매자' : '판매자';
        if (!appliedFilters.transactionType.includes(userType)) {
          return false;
        }
      }

      // 통신사 필터
      if (appliedFilters.carrier.length > 0) {
        if (!appliedFilters.carrier.includes(user.carrier)) {
          return false;
        }
      }

      // 데이터량 필터
      if (appliedFilters.dataAmount.length > 0) {
        const userData = user.data;
        const matchesDataFilter = appliedFilters.dataAmount.some((filter) => {
          if (filter === '1GB 미만') return userData < 1;
          if (filter === '1GB 이상') return userData >= 1;
          if (filter === '2GB 이상') return userData >= 2;
          return false;
        });
        if (!matchesDataFilter) return false;
      }

      // 가격 필터
      if (appliedFilters.price.length > 0) {
        const userPrice = user.price;
        const matchesPriceFilter = appliedFilters.price.some((filter) => {
          if (filter === '0 - 999') return userPrice >= 0 && userPrice <= 999;
          if (filter === '1,000 - 1,499')
            return userPrice >= 1000 && userPrice <= 1499;
          if (filter === '1,500 - 1,999')
            return userPrice >= 1500 && userPrice <= 1999;
          if (filter === '2,000 - 2,499')
            return userPrice >= 2000 && userPrice <= 2499;
          if (filter === '2,500 이상') return userPrice >= 2500;
          return false;
        });
        if (!matchesPriceFilter) return false;
      }

      return true;
    });
  }, [appliedFilters, activeSellers]);

  // 실시간 연결 설정
  useEffect(() => {
    const userId = 'user_123';
    connect(userId);

    const handleTradeRequest = (event: { data: Record<string, unknown> }) => {
      const request = event.data as unknown as TradeRequest;
      if (userRole === 'seller') {
        setIncomingRequests((prev) => [...prev, request]);
      }
    };

    const handleTradeResponse = (event: { data: Record<string, unknown> }) => {
      const { status, matchData } = event.data as {
        status: string;
        matchData: Record<string, unknown>;
      };
      if (status === 'accepted') {
        setMatchingStatus('matched');
        foundMatch({
          id: String(matchData.partnerId || ''),
          name: String(matchData.partnerName || ''),
          carrier: String(matchData.carrier || 'SKT'),
          data: Number(matchData.dataAmount || 1),
          price: Number(matchData.price || 0),
          rating: Number(matchData.rating || 4.5),
          transactionCount: Number(matchData.transactionCount || 0),
          type: userRole === 'seller' ? 'buyer' : 'seller',
        });
        setTimeout(() => router.push('/match/trading'), 1000);
      } else if (status === 'rejected') {
        setMatchingStatus('idle');
        alert('거래 요청이 거부되었습니다.');
      }
    };

    const handleSellerUpdate = (event: { data: Record<string, unknown> }) => {
      const updatedSellers = event.data as unknown as User[];
      setActiveSellers(updatedSellers);
    };

    addEventListener('trade_request', handleTradeRequest);
    addEventListener('trade_response', handleTradeResponse);
    addEventListener('seller_update', handleSellerUpdate);

    return () => {
      removeEventListener('trade_request', handleTradeRequest);
      removeEventListener('trade_response', handleTradeResponse);
      removeEventListener('seller_update', handleSellerUpdate);
      disconnect();
    };
  }, [
    userRole,
    connect,
    disconnect,
    addEventListener,
    removeEventListener,
    foundMatch,
    router,
  ]);

  // 필터 핸들러
  const handleFilterChange = (filters: Filters) => {
    setPendingFilters(filters);
  };

  const handleApplyFilters = () => {
    // 구매자의 경우 모든 필터 조건 확인
    if (pendingFilters.transactionType[0] === '구매자') {
      const hasTransactionType = pendingFilters.transactionType.length > 0;
      const hasCarrier = pendingFilters.carrier.length > 0;
      const hasDataAmount = pendingFilters.dataAmount.length > 0;
      const hasPrice = pendingFilters.price.length > 0;

      if (!hasTransactionType || !hasCarrier || !hasDataAmount || !hasPrice) {
        alert('모든 필터 조건을 선택해주세요.');
        return;
      }
    }

    setAppliedFilters(pendingFilters);

    // 실시간 판매자 목록 시뮬레이션 (구매자인 경우)
    if (pendingFilters.transactionType[0] === '구매자') {
      setActiveSellers(ALL_USERS.filter((user) => user.type === 'seller'));
    }
  };

  const handleResetFilters = () => {
    const emptyFilters = {
      transactionType: [],
      carrier: [],
      dataAmount: [],
      price: [],
    };
    setPendingFilters(emptyFilters);
    setAppliedFilters({
      transactionType: ['__RESET__'],
      carrier: [],
      dataAmount: [],
      price: [],
    });
    setActiveSellers([]);
  };

  // 판매자 정보 변경 핸들러
  const handleSellerInfoChange = (info: SellerRegistrationInfo) => {
    setSellerInfo(info);
    // 실제 API 호출
    // await updateSellerStatus(info);
  };

  const handleToggleSellerStatus = () => {
    // 실제 API 호출
    // await toggleSellerStatus();
  };

  // 거래 요청 응답 (판매자용)
  const handleTradeRequestResponse = async (
    requestId: string,
    accept: boolean
  ) => {
    const request = incomingRequests.find((req) => req.id === requestId);
    if (!request) return;

    setIncomingRequests((prev) => prev.filter((req) => req.id !== requestId));

    if (accept) {
      setMatchingStatus('matched');
      const buyer = { id: request.buyerId, name: request.buyerName };
      foundMatch({
        id: buyer.id,
        name: buyer.name,
        carrier: 'SKT',
        data: sellerInfo.dataAmount,
        price: sellerInfo.price,
        rating: 4.5,
        transactionCount: 0,
        type: 'buyer',
      });
      setTimeout(() => router.push('/match/trading'), 1000);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-1">
        {/* 개선된 FilterSection */}
        <FilterSection
          onFilterChange={handleFilterChange}
          onApply={handleApplyFilters}
          onReset={handleResetFilters}
          currentFilters={pendingFilters}
          onSellerInfoChange={handleSellerInfoChange}
          onToggleSellerStatus={handleToggleSellerStatus}
          sellerInfo={sellerInfo}
        />

        {/* 판매자 모드: 들어온 거래 요청 표시 */}
        {userRole === 'seller' && incomingRequests.length > 0 && (
          <div className="px-4 py-6">
            <div className="max-w-4xl mx-auto">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <h3 className="text-lg font-bold text-yellow-800 mb-4">
                  📩 거래 요청 ({incomingRequests.length}개)
                </h3>
                <div className="space-y-3">
                  {incomingRequests.map((request) => (
                    <div
                      key={request.id}
                      className="bg-white border border-yellow-200 rounded-lg p-4"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-800">
                            {request.buyerName}님의 거래 요청
                          </p>
                          <p className="text-sm text-gray-600">
                            {sellerInfo.dataAmount}GB •{' '}
                            {sellerInfo.price.toLocaleString()}원
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(request.createdAt).toLocaleString()}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() =>
                              handleTradeRequestResponse(request.id, true)
                            }
                            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                          >
                            수락
                          </button>
                          <button
                            onClick={() =>
                              handleTradeRequestResponse(request.id, false)
                            }
                            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                          >
                            거부
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 매칭 완료 상태 */}
        {matchingStatus === 'matched' && (
          <div className="px-4 py-6">
            <div className="max-w-4xl mx-auto">
              <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                <div className="animate-bounce mb-4">
                  <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto">
                    <span className="text-2xl">🎉</span>
                  </div>
                </div>
                <h3 className="text-lg font-bold text-green-800 mb-2">
                  매칭 완료!
                </h3>
                <p className="text-green-700">거래 페이지로 이동합니다...</p>
              </div>
            </div>
          </div>
        )}

        {/* 결과 섹션 */}
        <ResultSection users={filteredUsers} />
      </main>
      <Footer />
    </div>
  );
}
