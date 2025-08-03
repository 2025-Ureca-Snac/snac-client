'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import MatchContent from './components/MatchContent';
import TradeConfirmationModal from './components/modal/TradeConfirmationModal';
import TestPanel from './components/TestPanel';
import TestButton from './components/TestButton';
import { Filters } from './types';
import { User, TradeRequest } from './types/match';
import { useGlobalWebSocket } from '../(shared)/hooks/useGlobalWebSocket';
import { useMatchStore } from '../(shared)/stores/match-store';
//import { useAuthStore } from '../(shared)/stores/auth-store';
import TradeCancelModal from '../(shared)/components/TradeCancelModal';

interface ServerTradeData {
  tradeId: number;
  cardId: number;
  status: string;
  seller: string;
  buyer: string;
  carrier: string;
  dataAmount: number;
  priceGb?: number;
  point?: number;
  phone?: string;
  cancelReason?: string;
}

// 타입 정의
type MatchingStatus =
  | 'idle'
  | 'searching'
  | 'requesting'
  | 'requested'
  | 'matched';

export default function MatchPage() {
  const router = useRouter();
  const { foundMatch } = useMatchStore();
  // const { user } = useAuthStore();
  // const { profile } = useUserStore();

  // 상태 관리
  const initialFilters: Filters = {
    transactionType: [],
    carrier: [],
    dataAmount: [],
    price: [],
  };
  const [pendingFilters, setPendingFilters] = useState<Filters>(initialFilters);
  const [appliedFilters, setAppliedFilters] = useState<Filters>(initialFilters);
  const [matchingStatus, setMatchingStatus] = useState<MatchingStatus>('idle');
  const [activeSellers, setActiveSellers] = useState<User[]>([]);
  const [hasStartedSearch, setHasStartedSearch] = useState(false); // 검색 시작 여부 추적
  const [incomingRequests, setIncomingRequests] = useState<TradeRequest[]>([]);
  const [connectedUsers, setConnectedUsers] = useState<number>(0); // 접속자 수
  const [sellerInfo, setSellerInfo] = useState({
    dataAmount: 1,
    price: 1500,
    carrier: 'SKT',
    isActive: false,
  });

  // 거래 확인 모달 상태
  const [selectedSeller, setSelectedSeller] = useState<User | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [currentTradeStatus, setCurrentTradeStatus] = useState<string | null>(
    null
  );

  // 서버에서 실시간으로 받은 판매자 목록을 직접 사용
  const filteredUsers = activeSellers;

  // store에서 userRole 가져오기
  const { userRole, setUserRole } = useMatchStore();

  // 판매자 클릭 처리 (구매자용) - 먼저 정의
  const handleSellerClick = useCallback(async (seller: User) => {
    if (seller.type !== 'seller') {
      alert('판매자에게만 거래 요청이 가능합니다.');
      return;
    }

    // 거래 확인 모달 표시
    setSelectedSeller(seller);
    setShowConfirmModal(true);
  }, []);

  // 클릭 핸들러 - 더 유연하게 수정
  const userClickHandler =
    userRole === 'buyer'
      ? handleSellerClick
      : process.env.NODE_ENV === 'development'
        ? handleSellerClick
        : undefined;

  // 거래 상태 변경 핸들러
  const handleTradeStatusChange = useCallback(
    (status: string, tradeData: ServerTradeData) => {
      console.log('🔄 거래 상태 변경:', status, tradeData);
      setCurrentTradeStatus(status);

      if (status === 'ACCEPTED') {
        // 거래 수락 시 2초 후 모달 닫고 거래 페이지로 이동
        setTimeout(() => {
          setShowConfirmModal(false);
          setSelectedSeller(null);
          setCurrentTradeStatus(null);
        }, 2000);
      }
    },
    []
  );

  const { setWebSocketFunctions } = useMatchStore();

  // 실시간 이벤트 처리 (전역 WebSocket 훅)
  const {
    isConnected,
    registerSellerCard,
    deleteSellerCard,
    registerBuyerFilter,
    respondToTrade,
    createTrade,
    sendPayment,
    sendTradeConfirm,
    activatePage,
    deactivatePage,
  } = useGlobalWebSocket({
    appliedFilters,
    setIncomingRequests,
    setActiveSellers,
    setMatchingStatus,
    setConnectedUsers,
    onTradeStatusChange: handleTradeStatusChange, // 거래 상태 변경 콜백 추가
  });

  // MatchPage 활성화
  useEffect(() => {
    activatePage('match', handleTradeStatusChange);
    return () => {
      deactivatePage('match');
    };
  }, [activatePage, deactivatePage, handleTradeStatusChange]);

  // WebSocket 함수들을 store에 저장
  useEffect(() => {
    setWebSocketFunctions({ sendPayment, sendTradeConfirm });
  }, [sendPayment, sendTradeConfirm, setWebSocketFunctions]);

  // userRole이 변경될 때마다 로그 출력
  useEffect(() => {
    console.log(
      '🔄 MatchPage userRole 변경:',
      userRole,
      '타입:',
      typeof userRole
    );
  }, [userRole]);

  // 필터 핸들러
  const handleFilterChange = useCallback(
    (filters: Filters) => {
      setPendingFilters(filters);

      // 거래 방식이 변경되면 바로 appliedFilters도 업데이트
      if (filters.transactionType.length > 0) {
        setAppliedFilters(filters);

        // userRole이 변경될 때마다 store에 즉시 업데이트
        const newUserRole =
          filters.transactionType[0] === '구매자'
            ? 'buyer'
            : filters.transactionType[0] === '판매자'
              ? 'seller'
              : null;
        console.log('🎯 필터 변경 시 userRole 업데이트:', newUserRole);
        setUserRole(newUserRole);
      }
    },
    [setUserRole]
  );

  const handleApplyFilters = useCallback(() => {
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

      // 구매자 검색 시작 - 기존 결과 초기화
      setMatchingStatus('searching');
      setAppliedFilters(pendingFilters);
      setHasStartedSearch(true);
      setActiveSellers([]); // 🔧 기존 판매자 목록 초기화

      // 서버에 필터 등록 후 WebSocket을 통해 매칭 결과 수신 대기
      registerBuyerFilter(pendingFilters);

      // 검색 상태를 일정 시간 후 해제 (서버 응답이 없을 경우 대비)
      setTimeout(() => {
        if (matchingStatus === 'searching') {
          setMatchingStatus('idle');
        }
      }, 5000); // 5초 타임아웃
    } else if (pendingFilters.transactionType[0] === '판매자') {
      // 판매자 모드일 때도 appliedFilters 업데이트
      setAppliedFilters(pendingFilters);
    }
  }, [pendingFilters, matchingStatus, registerBuyerFilter]);

  const handleResetFilters = useCallback(() => {
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
  }, []);

  // 구매자 매칭 상태에서 뒤로가기
  const handleGoBackToSearch = useCallback(() => {
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
  }, []);

  // 판매자 정보 관리
  const handleSellerInfoChange = useCallback(
    (info: {
      dataAmount: number;
      price: number;
      carrier: string;
      isActive: boolean;
    }) => {
      setSellerInfo(info);
    },
    []
  );

  const handleToggleSellerStatus = useCallback(() => {
    const newInfo = { ...sellerInfo, isActive: !sellerInfo.isActive };
    setSellerInfo(newInfo);

    if (newInfo.isActive) {
      setActiveSellers([]);

      // 실제 서버에 판매자 카드 등록
      console.log('💰 판매자 카드 서버 등록 중...');
      console.log('🏪 판매자 원본 데이터:', newInfo);
      console.log('🔧 변환된 서버 데이터:', {
        carrier: newInfo.carrier === 'LGU+' ? 'LG' : newInfo.carrier,
        dataAmount: newInfo.dataAmount,
        price: newInfo.price,
      });
      registerSellerCard({
        carrier: newInfo.carrier,
        dataAmount: newInfo.dataAmount,
        price: newInfo.price,
      });
    } else {
      console.log('판매 상태가 비활성화되었습니다.');
      // 판매자 카드 삭제 (store에서 currentCardId 사용)
      deleteSellerCard();
    }
  }, [sellerInfo, registerSellerCard, deleteSellerCard, setActiveSellers]);

  // 거래 요청 응답 (판매자용)
  const handleTradeRequestResponse = useCallback(
    async (requestId: number, accept: boolean) => {
      const request = incomingRequests.find((req) => req.tradeId === requestId);
      if (!request) return;

      setIncomingRequests((prev) =>
        prev.filter((req) => req.tradeId !== requestId)
      );

      // 실제 서버에 응답 전송
      respondToTrade(requestId, accept);

      // 거래를 수락한 경우 trading 페이지로 이동
      if (accept) {
        // 구매자 정보를 store에 저장 (판매자 입장에서 상대방은 구매자)
        const buyerInfo = {
          tradeId: 1,
          buyer: 'hardcoded-buyer@email.com',
          seller: 'hardcoded-seller@email.com',
          cardId: 1,
          carrier: 'SKT',
          dataAmount: 10,
          phone: '010-1234-5678',
          point: 10000,
          priceGb: 2000,
          sellerRatingScore: 4.8,
          status: 'ACCEPTED',
          cancelReason: null,
          type: 'seller' as const,
        };

        foundMatch(buyerInfo);

        // 1초 후 trading 페이지로 이동
        setTimeout(() => {
          router.push('/match/trading');
        }, 500);
      }
    },
    [incomingRequests, respondToTrade, sellerInfo, foundMatch, router]
  );
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <main className="flex-1">
        <MatchContent
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
          onCancel={() => {
            setShowConfirmModal(false);
            setSelectedSeller(null);
            setCurrentTradeStatus(null);
          }}
          createTrade={createTrade}
          tradeStatus={currentTradeStatus}
        />

        {/* 테스트 패널 - 개발 모드에서만 표시 */}
        {process.env.NODE_ENV === 'development' && (
          <TestPanel
            isConnected={isConnected}
            connectedUsers={connectedUsers}
            userRole={userRole}
            matchingStatus={matchingStatus}
            activeSellers={activeSellers}
            incomingRequests={incomingRequests}
            appliedFilters={appliedFilters}
            sellerInfo={sellerInfo}
            currentTradeStatus={currentTradeStatus}
            selectedSeller={selectedSeller}
          />
        )}

        {/* 개발 모드에서만 표시되는 간단한 테스트 버튼 */}
        {process.env.NODE_ENV === 'development' && (
          <TestButton
            onTestModal={(seller) => {
              setSelectedSeller(seller);
              setShowConfirmModal(true);
            }}
          />
        )}
      </main>
      <TradeCancelModal />
    </div>
  );
}
