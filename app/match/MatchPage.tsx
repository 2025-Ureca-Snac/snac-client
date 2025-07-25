'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '../(shared)/components/Header';
import { Footer } from '../(shared)/components/Footer';
import MatchContent from './components/MatchContent';
import TradeConfirmationModal from './components/modal/TradeConfirmationModal';
import TestPanel from './components/TestPanel';
import TestButton from './components/TestButton';
import { Filters } from './types';
import { User, TradeRequest } from './types/match';
import { useGlobalWebSocket } from '../(shared)/hooks/useGlobalWebSocket';
import { useMatchStore } from '../(shared)/stores/match-store';
import { useAuthStore } from '../(shared)/stores/auth-store';
import { useUserStore } from '../(shared)/stores/user-store';

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
  const { user } = useAuthStore();
  const { profile } = useUserStore();

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

  const userRole =
    appliedFilters.transactionType[0] === '구매자'
      ? 'buyer'
      : appliedFilters.transactionType[0] === '판매자'
        ? 'seller'
        : 'buyer';

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
    registerBuyerFilter,
    respondToTrade,
    createTrade,
    sendPayment,
    sendTradeConfirm,
    updateUserRole,
  } = useGlobalWebSocket({
    appliedFilters,
    setIncomingRequests,
    setActiveSellers,
    setMatchingStatus,
    setConnectedUsers,
    onTradeStatusChange: handleTradeStatusChange, // 거래 상태 변경 콜백 추가
  });

  // WebSocket 함수들을 store에 저장
  useEffect(() => {
    setWebSocketFunctions({ sendPayment, sendTradeConfirm });
  }, [sendPayment, sendTradeConfirm, setWebSocketFunctions]);

  // userRole이 변경될 때마다 전역 소켓에 업데이트
  useEffect(() => {
    console.log('🔄 MatchPage useEffect 실행:', {
      userRole,
      updateUserRole: !!updateUserRole,
    });
    if (updateUserRole) {
      console.log('여기서 실행되냐?');
      updateUserRole(userRole);
    }
  }, [userRole]); // updateUserRole 의존성 제거

  // 필터 핸들러
  const handleFilterChange = useCallback(
    (filters: Filters) => {
      setPendingFilters(filters);

      // 거래 방식이 변경되면 바로 appliedFilters도 업데이트
      if (filters.transactionType.length > 0) {
        setAppliedFilters(filters);

        // userRole이 변경될 때마다 전역 소켓에 즉시 업데이트
        const newUserRole =
          filters.transactionType[0] === '구매자'
            ? 'buyer'
            : filters.transactionType[0] === '판매자'
              ? 'seller'
              : null;
        console.log('🎯 필터 변경 시 userRole 업데이트:', newUserRole);
        updateUserRole(newUserRole);
      }
    },
    [updateUserRole]
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

      // 실제 서버에 구매자 필터 등록
      console.log('📡 구매자 필터 서버 등록 중...');
      console.log('🔍 필터 원본 데이터:', pendingFilters);
      console.log('🔧 변환된 서버 데이터:', {
        carrier: (() => {
          const carrier = pendingFilters.carrier[0];
          return carrier === 'LGU+' ? 'LG' : carrier || 'ALL';
        })(),
        dataAmount: parseInt(
          pendingFilters.dataAmount[0]?.replace(/[^0-9]/g, '') || '1'
        ),
        priceRange: (() => {
          const price = pendingFilters.price[0];
          if (!price) return 'ALL';
          if (price.includes('0 - 999')) return 'P0_999';
          if (price.includes('1,000 - 1,499')) return 'P1000_1499';
          if (price.includes('1,500 - 1,999')) return 'P1500_1999';
          if (price.includes('2,000 - 2,499')) return 'P2000_2499';
          if (price.includes('2,500 이상')) return 'P2500_PLUS';
          return 'ALL';
        })(),
      });

      // 서버에 필터 등록 후 WebSocket을 통해 매칭 결과 수신 대기
      registerBuyerFilter(pendingFilters);

      // 검색 상태를 일정 시간 후 해제 (서버 응답이 없을 경우 대비)
      setTimeout(() => {
        if (matchingStatus === 'searching') {
          setMatchingStatus('idle');
          console.log('⏰ 매칭 검색 타임아웃 - 서버 응답 대기 중');
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
    }
  }, [sellerInfo, registerSellerCard, setActiveSellers]);

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
        console.log('요청:', request, '셀러인포:', sellerInfo);
        const buyerInfo = {
          tradeId: request.tradeId,
          buyer: request.buyerName, // 구매자 이메일
          seller: user || profile?.email || 'unknown_seller', // 현재 판매자 이메일
          cardId: request.cardId,
          carrier: sellerInfo.carrier,
          dataAmount: sellerInfo.dataAmount,
          phone: profile?.phone || '010-0000-0000', // 현재 사용자 핸드폰번호
          point: profile?.points || 0, // 현재 사용자 포인트
          priceGb: sellerInfo.price,
          sellerRatingScore: 1000, // TODO: 실제 평점 (서버에서 받아야 함)
          status: 'ACCEPTED',
          cancelReason: null,
          type: 'buyer' as const,
        };

        foundMatch(buyerInfo);

        // 1초 후 trading 페이지로 이동
        setTimeout(() => {
          router.push('/match/trading');
        }, 1000);
      }
    },
    [incomingRequests, respondToTrade, sellerInfo, foundMatch, router]
  );
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
      <Footer />
    </div>
  );
}
