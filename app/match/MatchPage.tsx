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
import TestPanel from './components/TestPanel';
import { Filters } from './types';
import { User, TradeRequest } from './types/match';
import { useMatchStore } from '../(shared)/stores/match-store';
import { useRealTimeMatching } from '../(shared)/utils/realtime';
import { useUserFiltering } from './hooks/useUserFiltering';
import { useMatchingEvents } from './hooks/useMatchingEvents';

// 타입 정의
type MatchingStatus = 'idle' | 'requesting' | 'requested' | 'matched';

// 샘플 유저 데이터 (사용자가 빈 배열로 설정함)
const ALL_USERS: User[] = [];

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
  const userClickHandler =
    userRole === 'buyer' ? handleSendTradeRequest : undefined;

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
    }

    setAppliedFilters(pendingFilters);

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

  // 거래 요청 발송 (구매자용)
  async function handleSendTradeRequest(seller: User) {
    if (userRole !== 'buyer') {
      alert('구매자만 거래를 요청할 수 있습니다.');
      return;
    }

    if (seller.type !== 'seller') {
      alert('판매자에게만 거래 요청이 가능합니다.');
      return;
    }

    setMatchingStatus('requesting');

    console.log('🔥 거래 요청 발송:', {
      buyerId: 'user_123',
      sellerId: seller.id,
      sellerName: seller.name,
      dataAmount: seller.data,
      price: seller.price,
    });

    alert(`${seller.name}님에게 거래 요청을 보냈습니다!`);

    // Mock: 2초 후 자동 수락 시뮬레이션
    setTimeout(() => {
      setMatchingStatus('matched');
      foundMatch({
        id: String(seller.id),
        name: seller.name,
        carrier: seller.carrier,
        data: seller.data,
        price: seller.price,
        rating: seller.rating || 4.5,
        transactionCount: seller.transactionCount || 0,
        type: 'seller',
      });
      setTimeout(() => router.push('/match/trading'), 1000);
    }, 2000);
  }

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
        {/* 필터 섹션 */}
        <FilterSection
          onFilterChange={handleFilterChange}
          onApply={handleApplyFilters}
          onReset={handleResetFilters}
          currentFilters={pendingFilters}
          onSellerInfoChange={handleSellerInfoChange}
          onToggleSellerStatus={handleToggleSellerStatus}
          sellerInfo={sellerInfo}
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

        {/* 결과 섹션 */}
        <ResultSection users={filteredUsers} onUserClick={userClickHandler} />

        {/* 테스트 패널 */}
        <TestPanel
          userRole={userRole}
          onTriggerMockTradeRequest={triggerMockTradeRequest}
          onTriggerMockSellerUpdate={triggerMockSellerUpdate}
          onTriggerMockTradeResponse={triggerMockTradeResponse}
        />
      </main>
      <Footer />
    </div>
  );
}
