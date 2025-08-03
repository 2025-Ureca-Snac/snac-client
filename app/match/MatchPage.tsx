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
import { TradeRequest } from './types/match';
import { User } from '../(shared)/stores/match-store';
import { useGlobalWebSocket } from '../(shared)/hooks/useGlobalWebSocket';
import { useMatchStore } from '../(shared)/stores/match-store';
import { useAuthStore } from '../(shared)/stores/auth-store';
import TradeCancelModal from '../(shared)/components/TradeCancelModal';
import { toast } from 'sonner';

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
  const { foundMatch, updatePartner } = useMatchStore();
  const { token } = useAuthStore();
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
  const [hasStartedSearch, setHasStartedSearch] = useState(false); // 검색 시작 여부 추적
  const [incomingRequests, setIncomingRequests] = useState<TradeRequest[]>([]);
  const [connectedUsers, setConnectedUsers] = useState<number>(0); // 접속자 수
  const [sellerInfo, setSellerInfo] = useState({
    dataAmount: 1,
    price: 100, // 최소 가격을 100원으로 설정
    carrier: 'SKT',
    isActive: false,
  });

  // 거래 확인 모달 상태
  const [selectedSeller, setSelectedSeller] = useState<User | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [currentTradeStatus, setCurrentTradeStatus] = useState<string | null>(
    null
  );

  // store에서 userRole과 activeSellers, setActiveSellers 가져오기
  const { userRole, setUserRole, activeSellers, setActiveSellers } =
    useMatchStore();
  // 서버에서 실시간으로 받은 판매자 목록을 직접 사용
  const filteredUsers = activeSellers;

  // 현재 토큰 상태를 즉시 확인하는 함수
  const checkCurrentToken = () => {
    if (typeof window === 'undefined') return null;

    try {
      // 1. Zustand persist에서 저장된 토큰 확인
      const authStorage = localStorage.getItem('auth-storage');
      if (authStorage) {
        const parsed = JSON.parse(authStorage);
        if (parsed.state?.token) {
          return parsed.state.token;
        }
      }

      // 2. 다른 가능한 위치에서 토큰 확인 (fallback)
      const fallbackToken =
        localStorage.getItem('accessToken') ||
        localStorage.getItem('token') ||
        localStorage.getItem('jwt');

      if (fallbackToken) {
        return fallbackToken;
      }

      return null;
    } catch (error) {
      console.error('토큰 가져오기 실패:', error);
      return null;
    }
  };

  // 로그인 상태 체크
  useEffect(() => {
    const currentToken = checkCurrentToken();
    if (!currentToken) {
      router.push('/login');
      return;
    }
  }, [router]);

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

      // tradeData로 파트너 정보 갱신
      updatePartner({
        tradeId: tradeData.tradeId,
        buyer: tradeData.buyer,
        seller: tradeData.seller,
        cardId: tradeData.cardId,
        carrier: tradeData.carrier,
        dataAmount: tradeData.dataAmount,
        phone: tradeData.phone || '010-0000-0000',
        point: tradeData.point || 0,
        priceGb: tradeData.priceGb || 0,
        sellerRatingScore: 1000, // 기본값
        status: tradeData.status,
        cancelReason: tradeData.cancelReason || null,
        type: 'seller' as const,
      });

      if (status === 'ACCEPTED') {
        // 거래 수락 시 2초 후 모달 닫고 거래 페이지로 이동
        setTimeout(() => {
          setShowConfirmModal(false);
          setSelectedSeller(null);
          setCurrentTradeStatus(null);
        }, 2000);
      }
    },
    [updatePartner]
  );

  const { setWebSocketFunctions } = useMatchStore();

  // 실시간 이벤트 처리 (전역 WebSocket 훅)
  const {
    isConnected,
    registerSellerCard,
    deleteSellerCard,
    registerBuyerFilter,
    removeBuyerFilter,
    respondToTrade,
    createTrade,
    sendPayment,
    sendTradeConfirm,
    activatePage,
    deactivatePage,
  } = useGlobalWebSocket({
    appliedFilters,
    setIncomingRequests,
    setMatchingStatus,
    setConnectedUsers,
    onTradeStatusChange: handleTradeStatusChange, // 거래 상태 변경 콜백 추가
    skipAuthCheck: true, // 인증 체크를 건너뛰어서 에러 로그 방지
  });

  // MatchPage 활성화 및 초기화
  useEffect(() => {
    activatePage('match', handleTradeStatusChange);

    // 페이지 진입 시 이전 판매자 목록 초기화 및 필터 제거
    console.log('🔄 MatchPage 진입 - 이전 데이터 초기화');
    setActiveSellers([]);
    removeBuyerFilter(); // 서버에 필터 제거 요청

    return () => {
      deactivatePage('match');
    };
  }, [
    activatePage,
    deactivatePage,
    handleTradeStatusChange,
    setActiveSellers,
    removeBuyerFilter,
  ]);

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
  }, [pendingFilters, matchingStatus, registerBuyerFilter, setActiveSellers]);

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

    // 서버에 필터 제거 요청
    removeBuyerFilter();
  }, [setActiveSellers, removeBuyerFilter]);

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

    // 서버에 필터 제거 요청
    removeBuyerFilter();
  }, [setActiveSellers, removeBuyerFilter]);

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
    // 판매 활성화 시도 시 가격 유효성 검사
    if (!sellerInfo.isActive) {
      // 가격이 100원 미만인 경우
      if (sellerInfo.price < 100) {
        toast.error('가격은 최소 100원 이상이어야 합니다.', {
          description: '가격을 100원 이상으로 설정해주세요.',
          duration: 3000,
        });
        return;
      }

      // 가격이 10000원 초과인 경우
      if (sellerInfo.price > 10000) {
        toast.error('가격은 최대 10,000원까지 설정 가능합니다.', {
          description: '가격을 10,000원 이하로 설정해주세요.',
          duration: 3000,
        });
        return;
      }

      // 유효성 검사 통과 시 성공 메시지
      toast.success('판매가 시작되었습니다!', {
        description: `${sellerInfo.dataAmount}GB를 ${sellerInfo.price.toLocaleString()}원에 판매 중입니다.`,
        duration: 3000,
      });
    } else {
      // 판매 비활성화 시 안내 메시지
      toast.info('판매가 중단되었습니다.', {
        description: '언제든지 다시 판매를 시작할 수 있습니다.',
        duration: 3000,
      });
    }

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
      respondToTrade(requestId, accept, request.cardId);

      // 거래를 수락한 경우 trading 페이지로 이동
      if (accept) {
        // 실제 거래 요청 정보를 사용해서 파트너 정보 설정
        const partnerInfo = {
          tradeId: requestId,
          buyer: request.buyerName,
          seller: request.seller,
          sellerId: request.sellerId,
          sellerNickName: request.sellerNickName,
          buyerId: request.buyerId,
          buyerNickName: request.buyerNickName,
          buyerRatingScore: request.buyerRatingScore,
          cardId: request.cardId,
          carrier: sellerInfo.carrier,
          dataAmount: sellerInfo.dataAmount,
          phone: '010-0000-0000', // 실제로는 서버에서 받아야 함
          point: 0, // 실제로는 서버에서 받아야 함
          priceGb: sellerInfo.price,
          sellerRatingScore: request.ratingData || 1000,
          status: 'ACCEPTED',
          cancelReason: null,
          type: 'buyer' as const, // 판매자 입장에서 상대방은 구매자
        };

        foundMatch(partnerInfo);

        // 1초 후 trading 페이지로 이동
        setTimeout(() => {
          router.push('/match/trading');
        }, 500);
      }
    },
    [incomingRequests, respondToTrade, foundMatch, router, sellerInfo]
  );
  // 토큰이 없으면 로딩 상태 표시
  if (!token) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p className="text-gray-600">로그인 상태를 확인하는 중...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen   flex flex-col bg-black">
      <Header isDarkmode={true} />
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
      <Footer />
    </div>
  );
}
