'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '../(shared)/components/Header';
import { Footer } from '../(shared)/components/Footer';
import FilterSection, {
  SellerRegistrationInfo,
} from './components/FilterSection';
import ResultSection from './components/ResultSection';
import IncomingRequestsPanel from './components/IncomingRequestsPanel';
import MatchSuccessPanel from './components/MatchSuccessPanel';
import BuyerMatchingStatus from './components/BuyerMatchingStatus';
import TradeConfirmationModal from './components/TradeConfirmationModal';
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
  const [incomingRequests, setIncomingRequests] = useState<TradeRequest[]>([]);
  const [sellerInfo, setSellerInfo] = useState<SellerRegistrationInfo>({
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
  const handleFilterChange = (filters: Filters) => setPendingFilters(filters);

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

      // 2초 후 검색 완료 (Mock)
      setTimeout(() => {
        setActiveSellers(ALL_USERS.filter((user) => user.type === 'seller'));
        setMatchingStatus('idle');
        // Mock: 실시간 판매자 목록 업데이트
        triggerMockSellerUpdate();
      }, 2000);
    } else {
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
    // pendingFilters는 유지해서 사용자가 이전 선택을 볼 수 있도록 함
  };

  // 판매자 정보 관리
  const handleSellerInfoChange = (info: SellerRegistrationInfo) => {
    setSellerInfo(info);
  };

  const handleToggleSellerStatus = () => {
    const newInfo = { ...sellerInfo, isActive: !sellerInfo.isActive };
    setSellerInfo(newInfo);

    console.log('🔥 판매자 상태 변경:', newInfo);

    if (newInfo.isActive) {
      console.log('📢 새로운 판매자 등록됨! 구매자들에게 알림 발송');
      alert('판매 상태가 활성화되었습니다! 구매자들이 볼 수 있습니다.');

      setTimeout(() => triggerMockSellerUpdate(), 500);
    } else {
      console.log('📢 판매자가 비활성화됨');
      alert('판매 상태가 비활성화되었습니다.');
    }
  };

  // 판매자 클릭 처리 (구매자용)
  async function handleSellerClick(seller: User) {
    console.log('🔥 판매자 클릭됨:', seller);

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

    console.log('🔥 거래 요청 발송:', {
      buyerId: 'user_123',
      sellerId: selectedSeller.id,
      sellerName: selectedSeller.name,
      dataAmount: selectedSeller.data,
      price: selectedSeller.price,
    });

    alert(`${selectedSeller.name}님에게 거래 요청을 보냈습니다!`);

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
      setTimeout(() => router.push('/match/trading'), 1000);
    }, 2000);

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
        {/* 필터 섹션 (판매자 모드이거나 구매자가 아직 검색하지 않았을 때만 표시) */}
        {(userRole === 'seller' ||
          userRole !== 'buyer' ||
          appliedFilters.transactionType.length === 0) && (
          <FilterSection
            onFilterChange={handleFilterChange}
            onApply={handleApplyFilters}
            onReset={handleResetFilters}
            currentFilters={pendingFilters}
            onSellerInfoChange={handleSellerInfoChange}
            onToggleSellerStatus={handleToggleSellerStatus}
            sellerInfo={sellerInfo}
          />
        )}

        {/* 구매자 매칭 상태 */}
        <BuyerMatchingStatus
          appliedFilters={appliedFilters}
          isSearching={matchingStatus === 'searching'}
          foundUsersCount={filteredUsers.length}
          onGoBack={handleGoBackToSearch}
        />

        {/* 판매자 모드: 들어온 거래 요청 */}
        {userRole === 'seller' && (
          <IncomingRequestsPanel
            requests={incomingRequests}
            sellerInfo={sellerInfo}
            onRequestResponse={handleTradeRequestResponse}
          />
        )}

        {/* 매칭 완료 상태 */}
        <MatchSuccessPanel isVisible={matchingStatus === 'matched'} />

        {<ResultSection users={filteredUsers} onUserClick={userClickHandler} />}

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
