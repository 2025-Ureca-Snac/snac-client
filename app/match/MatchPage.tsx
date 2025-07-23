'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '../(shared)/components/Header';
import { Footer } from '../(shared)/components/Footer';
import MatchContent from './components/MatchContent';
import TradeConfirmationModal from './components/modal/TradeConfirmationModal';
import TestPanel from './components/TestPanel';
import { Filters } from './types';
import { User, TradeRequest } from './types/match';
import { useMatchStore } from '../(shared)/stores/match-store';
import { useRealTimeMatching } from '../(shared)/utils/realtime';
import { useUserFiltering } from './hooks/useUserFiltering';
import { useMatchingEvents } from './hooks/useMatchingEvents';

// 타입 정의
type MatchingStatus =
  | 'idle'
  | 'searching'
  | 'requesting'
  | 'requested'
  | 'matched';

// 샘플 유저 데이터 (테스트용)
const ALL_USERS: User[] = [
  {
    id: 1,
    type: 'seller',
    name: 'user04',
    carrier: 'SKT',
    data: 1,
    price: 1500,
    rating: 4.8,
    transactionCount: 125,
  },
  {
    id: 2,
    type: 'seller',
    name: 'user05',
    carrier: 'SKT',
    data: 1,
    price: 1600,
    rating: 4.6,
    transactionCount: 89,
  },
  {
    id: 3,
    type: 'seller',
    name: 'user06',
    carrier: 'KT',
    data: 2,
    price: 2000,
    rating: 4.9,
    transactionCount: 156,
  },
];

export default function MatchPage() {
  const router = useRouter();
  const { foundMatch } = useMatchStore();
  const {
    triggerMockTradeRequest,
    triggerMockTradeResponse,
    triggerMockSellerUpdate,
  } = useRealTimeMatching();

  // 상태 관리
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
  const [matchingStatus, setMatchingStatus] = useState<MatchingStatus>('idle');
  const [activeSellers, setActiveSellers] = useState<User[]>([]);
  const [hasStartedSearch, setHasStartedSearch] = useState(false); // 검색 시작 여부 추적
  const [incomingRequests, setIncomingRequests] = useState<TradeRequest[]>([
    // 임시 Mock 거래 요청 데이터 (테스트용)
    {
      id: 'mock_request_1',
      buyerId: 'buyer_001',
      buyerName: '김구매',
      sellerId: 'seller_123',
      status: 'pending',
      createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(), // 5분 전
    },
    {
      id: 'mock_request_2',
      buyerId: 'buyer_002',
      buyerName: '이구매',
      sellerId: 'seller_123',
      status: 'pending',
      createdAt: new Date(Date.now() - 2 * 60 * 1000).toISOString(), // 2분 전
    },
    {
      id: 'mock_request_3',
      buyerId: 'buyer_003',
      buyerName: '박구매',
      sellerId: 'seller_123',
      status: 'pending',
      createdAt: new Date(Date.now() - 30 * 1000).toISOString(), // 30초 전
    },
  ]);
  const [sellerInfo, setSellerInfo] = useState({
    dataAmount: 1,
    price: 1500,
    carrier: 'SKT',
    isActive: false,
  });

  // 거래 확인 모달 상태
  const [selectedSeller, setSelectedSeller] = useState<User | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // 커스텀 훅 사용
  const filteredUsers = useUserFiltering(
    appliedFilters,
    activeSellers,
    ALL_USERS
  );
  const userRole =
    appliedFilters.transactionType[0] === '구매자'
      ? 'buyer'
      : appliedFilters.transactionType[0] === '판매자'
        ? 'seller'
        : null;

  // 클릭 핸들러 - 더 유연하게 수정
  const userClickHandler =
    userRole === 'buyer'
      ? handleSellerClick
      : process.env.NODE_ENV === 'development'
        ? handleSellerClick
        : undefined;

  // 실시간 이벤트 처리
  useMatchingEvents({
    userRole,
    appliedFilters,
    setIncomingRequests,
    setActiveSellers,
    setMatchingStatus,
  });

  // 필터 핸들러
  const handleFilterChange = (filters: Filters) => {
    setPendingFilters(filters);

    // 거래 방식이 변경되면 바로 appliedFilters도 업데이트
    if (filters.transactionType.length > 0) {
      setAppliedFilters(filters);
    }
  };

  const handleApplyFilters = () => {
    if (pendingFilters.transactionType[0] === '구매자') {
      const hasRequired =
        pendingFilters.transactionType.length > 0 &&
        pendingFilters.carrier.length > 0 &&
        pendingFilters.dataAmount.length > 0 &&
        pendingFilters.price.length > 0;

      if (!hasRequired) {
        alert('모든 필터 조건을 선택해주세요.');
        return;
      }

      // 구매자 검색 시작
      setMatchingStatus('searching');
      setAppliedFilters(pendingFilters);
      setHasStartedSearch(true); // 검색 시작 표시

      // 2초 후 검색 완료 (Mock)
      setTimeout(() => {
        setActiveSellers(ALL_USERS.filter((user) => user.type === 'seller'));
        setMatchingStatus('idle');
        // Mock: 실시간 판매자 목록 업데이트
        triggerMockSellerUpdate();
      }, 2000);
    } else if (pendingFilters.transactionType[0] === '판매자') {
      // 판매자 모드일 때도 appliedFilters 업데이트
      setAppliedFilters(pendingFilters);
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
    setMatchingStatus('idle');
    setHasStartedSearch(false); // 검색 시작 상태 초기화
  };

  // 구매자 매칭 상태에서 뒤로가기
  const handleGoBackToSearch = () => {
    // 검색 결과 초기화하고 필터 섹션으로 돌아가기
    const emptyFilters = {
      transactionType: [],
      carrier: [],
      dataAmount: [],
      price: [],
    };
    setAppliedFilters(emptyFilters);
    setActiveSellers([]);
    setMatchingStatus('idle');
    setHasStartedSearch(false); // 검색 시작 상태 초기화
    // pendingFilters는 유지해서 사용자가 이전 선택을 볼 수 있도록 함
  };

  // 판매자 정보 관리
  const handleSellerInfoChange = (info: {
    dataAmount: number;
    price: number;
    carrier: string;
    isActive: boolean;
  }) => {
    setSellerInfo(info);
  };

  const handleToggleSellerStatus = () => {
    const newInfo = { ...sellerInfo, isActive: !sellerInfo.isActive };
    setSellerInfo(newInfo);

    if (newInfo.isActive) {
      setTimeout(() => triggerMockSellerUpdate(), 500);
    } else {
      alert('판매 상태가 비활성화되었습니다.');
    }
  };

  // 판매자 클릭 처리 (구매자용)
  async function handleSellerClick(seller: User) {
    if (seller.type !== 'seller') {
      alert('판매자에게만 거래 요청이 가능합니다.');
      return;
    }

    // 거래 확인 모달 표시
    setSelectedSeller(seller);
    setShowConfirmModal(true);
  }

  // 거래 확인 모달에서 확인 버튼 클릭
  const handleConfirmTrade = async () => {
    if (!selectedSeller) return;
    setShowConfirmModal(false);
    setMatchingStatus('requesting');

    // Mock: 2초 후 자동 수락 시뮬레이션
    setTimeout(() => {
      setMatchingStatus('matched');
      foundMatch({
        id: String(selectedSeller.id),
        name: selectedSeller.name,
        carrier: selectedSeller.carrier,
        data: selectedSeller.data,
        price: selectedSeller.price,
        rating: selectedSeller.rating || 4.5,
        transactionCount: selectedSeller.transactionCount || 0,
        type: 'seller',
      });
      setTimeout(() => router.push('/match/trading'), 100);
    }, 1000);

    setSelectedSeller(null);
  };

  // 거래 확인 모달에서 취소 버튼 클릭
  const handleCancelTrade = () => {
    setShowConfirmModal(false);
    setSelectedSeller(null);
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
        <MatchContent
          userRole={userRole}
          appliedFilters={appliedFilters}
          pendingFilters={pendingFilters}
          onFilterChange={handleFilterChange}
          onApply={handleApplyFilters}
          onReset={handleResetFilters}
          onSellerInfoChange={handleSellerInfoChange}
          onToggleSellerStatus={handleToggleSellerStatus}
          sellerInfo={sellerInfo}
          matchingStatus={matchingStatus}
          hasStartedSearch={hasStartedSearch}
          onGoBackToSearch={handleGoBackToSearch}
          filteredUsers={filteredUsers}
          onUserClick={userClickHandler}
          incomingRequests={incomingRequests}
          onRequestResponse={handleTradeRequestResponse}
        />

        {/* 거래 확인 모달 */}
        <TradeConfirmationModal
          isOpen={showConfirmModal}
          seller={selectedSeller}
          onConfirm={handleConfirmTrade}
          onCancel={handleCancelTrade}
        />

        {/* 테스트 패널 */}
        <TestPanel
          userRole={userRole}
          onTriggerMockTradeRequest={triggerMockTradeRequest}
          onTriggerMockSellerUpdate={triggerMockSellerUpdate}
          onTriggerMockTradeResponse={triggerMockTradeResponse}
        />

        {/* 개발 모드에서 모달 테스트 버튼 */}
        {process.env.NODE_ENV === 'development' && (
          <div className="fixed bottom-4 left-4 z-50">
            <button
              onClick={() => {
                setSelectedSeller(ALL_USERS[0]);
                setShowConfirmModal(true);
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700"
            >
              🔧 모달 테스트
            </button>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
