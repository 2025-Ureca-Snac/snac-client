'use client';

import { useState } from 'react';
import { Header } from '../(shared)/components/Header';
import { Footer } from '../(shared)/components/Footer';
import MatchContent from './components/MatchContent';
import TradeConfirmationModal from './components/modal/TradeConfirmationModal';
import { Filters } from './types';
import { User, TradeRequest } from './types/match';
import { useMatchingEvents } from './hooks/useMatchingEvents';

// ServerTradeData 타입 정의 (useMatchingEvents와 동일)
interface ServerTradeData {
  id: number;
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

  // 커스텀 훅 사용 - 로컬 필터링 제거, 서버 결과만 사용
  // const filteredUsers = useUserFiltering(
  //   appliedFilters,
  //   activeSellers,
  //   [] // 빈 배열로 변경 (서버에서 실시간으로 받는 데이터만 사용)
  // );

  // 서버에서 실시간으로 받은 판매자 목록을 직접 사용
  const filteredUsers = activeSellers;

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

  // 거래 상태 변경 핸들러
  const handleTradeStatusChange = (
    status: string,
    tradeData: ServerTradeData
  ) => {
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
  };

  // 실시간 이벤트 처리 (새로운 WebSocket 훅)
  const {
    isConnected,
    registerSellerCard,
    registerBuyerFilter,
    respondToTrade,
    createTrade,
  } = useMatchingEvents({
    userRole,
    appliedFilters,
    setIncomingRequests,
    setActiveSellers,
    setMatchingStatus,
    setConnectedUsers,
    onTradeStatusChange: handleTradeStatusChange, // 거래 상태 변경 콜백 추가
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

  // 거래 요청 응답 (판매자용)
  const handleTradeRequestResponse = async (
    requestId: string,
    accept: boolean
  ) => {
    const request = incomingRequests.find((req) => req.id === requestId);
    if (!request) return;

    setIncomingRequests((prev) => prev.filter((req) => req.id !== requestId));

    // 실제 서버에 응답 전송
    respondToTrade(requestId, accept);
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
          onConfirm={() => {
            setShowConfirmModal(false);
            setSelectedSeller(null);
            setCurrentTradeStatus(null);
          }}
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
          <div className="fixed bottom-4 right-4 z-50">
            <div className="bg-gray-800 p-4 rounded-lg shadow-lg min-w-[300px] max-w-[400px]">
              <h4 className="text-white text-sm font-medium mb-3">
                🔧 개발 패널
              </h4>

              <div className="space-y-2 text-xs">
                <div className="text-gray-300">
                  <strong>WebSocket 상태:</strong>
                  <span
                    className={`ml-2 px-2 py-1 rounded ${isConnected ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}
                  >
                    {isConnected ? '✅ 연결됨' : '❌ 연결 안됨'}
                  </span>
                </div>

                <div className="text-gray-300">
                  <strong>접속자 수:</strong>
                  <span className="ml-2 text-purple-300">
                    {connectedUsers}명 온라인
                  </span>
                </div>

                <div className="text-gray-300">
                  <strong>현재 모드:</strong>
                  <span className="ml-2 text-white">
                    {userRole === 'buyer'
                      ? '🛒 구매자'
                      : userRole === 'seller'
                        ? '💰 판매자'
                        : '❓ 미설정'}
                  </span>
                </div>

                <div className="text-gray-300">
                  <strong>매칭 상태:</strong>
                  <span className="ml-2 text-white">
                    {matchingStatus === 'idle' && '⏸️ 대기중'}
                    {matchingStatus === 'searching' && '🔍 서버 매칭 중...'}
                    {matchingStatus === 'requesting' && '📤 요청중'}
                    {matchingStatus === 'requested' && '📩 요청됨'}
                    {matchingStatus === 'matched' && '🎉 매칭됨'}
                  </span>
                </div>

                <div className="text-gray-300">
                  <strong>매칭 결과:</strong>
                  <span className="ml-2 text-green-300">
                    {userRole === 'buyer'
                      ? `${activeSellers.length}명 판매자 (서버)`
                      : userRole === 'seller'
                        ? `${incomingRequests.length}건 거래요청`
                        : '미설정'}
                  </span>
                </div>

                <div className="text-gray-300">
                  <strong>서버 URL:</strong>
                  <span className="ml-2 text-blue-300 text-[10px]">
                    {process.env.NEXT_PUBLIC_WS_URL ||
                      'https://api.snac-app.com/ws'}
                  </span>
                </div>

                <div className="text-gray-300">
                  <strong>JWT 토큰:</strong>
                  <span className="ml-2 text-yellow-300">
                    {(() => {
                      if (typeof window === 'undefined') return '서버 렌더링';

                      try {
                        // auth-storage에서 토큰 확인
                        const authStorage =
                          localStorage.getItem('auth-storage');
                        if (authStorage) {
                          const parsed = JSON.parse(authStorage);
                          if (parsed.state?.token) {
                            const tokenLength = parsed.state.token.length;
                            return `✅ 있음 (${tokenLength}자)`;
                          }
                        }

                        // fallback 확인
                        const fallbackToken =
                          localStorage.getItem('accessToken') ||
                          localStorage.getItem('token') ||
                          localStorage.getItem('jwt');
                        if (fallbackToken) {
                          return `✅ fallback (${fallbackToken.length}자)`;
                        }

                        return '❌ 없음 (로그인 필요)';
                      } catch {
                        return '❌ 파싱 오류';
                      }
                    })()}
                  </span>
                </div>

                {/* 현재 필터 정보 */}
                {userRole === 'buyer' &&
                  appliedFilters.transactionType.includes('구매자') && (
                    <div className="mt-2 p-2 bg-blue-900 rounded">
                      <div className="text-blue-200 font-medium">
                        구매자 필터:
                      </div>
                      <div className="text-blue-300 text-[10px]">
                        <strong>UI:</strong>
                        <br />
                        통신사: {appliedFilters.carrier.join(', ') || '미설정'}
                        <br />
                        데이터:{' '}
                        {appliedFilters.dataAmount.join(', ') || '미설정'}
                        <br />
                        가격: {appliedFilters.price.join(', ') || '미설정'}
                        <br />
                        <strong>서버 전송:</strong>
                        <br />
                        carrier:{' '}
                        {(() => {
                          const carrier = appliedFilters.carrier[0];
                          return carrier === 'LGU+' ? 'LG' : carrier || 'ALL';
                        })()}
                        <br />
                        dataAmount:{' '}
                        {parseInt(
                          appliedFilters.dataAmount[0]?.replace(
                            /[^0-9]/g,
                            ''
                          ) || '1'
                        )}
                        <br />
                        priceRange:{' '}
                        {(() => {
                          const price = appliedFilters.price[0];
                          if (!price) return 'ALL';
                          if (price.includes('0 - 999')) return 'P0_999';
                          if (price.includes('1,000 - 1,499'))
                            return 'P1000_1499';
                          if (price.includes('1,500 - 1,999'))
                            return 'P1500_1999';
                          if (price.includes('2,000 - 2,499'))
                            return 'P2000_2499';
                          if (price.includes('2,500 이상')) return 'P2500_PLUS';
                          return 'ALL';
                        })()}
                        <br />
                        <strong>현재 거래:</strong>
                        <br />
                        {currentTradeStatus ? (
                          <div className="mt-1 p-1 bg-purple-800 rounded">
                            상태: {currentTradeStatus}
                            <br />
                            {selectedSeller && `대상: ${selectedSeller.name}`}
                          </div>
                        ) : (
                          <div className="text-gray-400">
                            진행중인 거래 없음
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                {/* 판매자 정보 */}
                {userRole === 'seller' && (
                  <div className="mt-2 p-2 bg-green-900 rounded">
                    <div className="text-green-200 font-medium">
                      판매자 카드:
                    </div>
                    <div className="text-green-300 text-[10px]">
                      <strong>UI:</strong>
                      <br />
                      통신사: {sellerInfo.carrier}
                      <br />
                      데이터: {sellerInfo.dataAmount}GB
                      <br />
                      가격: {sellerInfo.price.toLocaleString()}원<br />
                      상태: {sellerInfo.isActive ? '🟢 활성' : '🔴 비활성'}
                      <br />
                      <strong>서버 전송:</strong>
                      <br />
                      carrier:{' '}
                      {sellerInfo.carrier === 'LGU+'
                        ? 'LG'
                        : sellerInfo.carrier}
                      <br />
                      dataAmount: {sellerInfo.dataAmount}
                      <br />
                      price: {sellerInfo.price}
                      <br />
                      <strong>거래 요청:</strong>
                      <br />
                      {incomingRequests.length > 0 ? (
                        incomingRequests.map((req, idx) => (
                          <div
                            key={req.id}
                            className="mt-1 p-1 bg-yellow-800 rounded"
                          >
                            요청 #{idx + 1}: {req.buyerName}
                            <br />
                            ID: {req.id}
                            <br />
                            상태: {req.status}
                            <br />
                            시간: {new Date(req.createdAt).toLocaleTimeString()}
                          </div>
                        ))
                      ) : (
                        <div className="text-gray-400">거래 요청 없음</div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {!isConnected && (
                <div className="mt-3 p-2 bg-red-900 rounded text-xs text-red-200">
                  ⚠️ WebSocket 연결 실패
                  <br />
                  1. 로그인 상태 확인
                  <br />
                  2. JWT 토큰 확인
                  <br />
                  3. 서버 상태 확인
                </div>
              )}
            </div>
          </div>
        )}

        {/* 개발 모드에서만 표시되는 간단한 테스트 버튼 */}
        {process.env.NODE_ENV === 'development' && (
          <div className="fixed bottom-4 left-4 z-50">
            <button
              onClick={() => {
                // 임시 테스트 판매자 데이터 생성
                const testSeller: User = {
                  id: 999,
                  type: 'seller',
                  name: 'Test Seller',
                  carrier: 'SKT',
                  data: 1,
                  price: 1500,
                  rating: 4.5,
                  transactionCount: 0,
                };
                setSelectedSeller(testSeller);
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
