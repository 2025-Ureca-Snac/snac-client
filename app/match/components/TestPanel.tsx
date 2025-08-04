'use client';

import { User, TradeRequest } from '../types/match';

interface TestPanelProps {
  isConnected: boolean;
  userRole: 'buyer' | 'seller' | null;
  matchingStatus: string;
  activeSellers: User[];
  incomingRequests: TradeRequest[];
  appliedFilters: {
    transactionType: string[];
    carrier: string[];
    dataAmount: string[];
    price: string[];
  };
  sellerInfo: {
    carrier: string;
    dataAmount: number;
    price: number;
    isActive: boolean;
  };
  currentTradeStatus: string | null;
  selectedSeller: User | null;
}

export default function TestPanel({
  isConnected,
  userRole,
  matchingStatus,
  activeSellers,
  incomingRequests,
  appliedFilters,
  sellerInfo,
  currentTradeStatus,
  selectedSeller,
}: TestPanelProps) {
  const getMatchingStatusText = (status: string) => {
    switch (status) {
      case 'idle':
        return '⏸️ 대기중';
      case 'searching':
        return '🔍 서버 매칭 중...';
      case 'requesting':
        return '📤 요청중';
      case 'requested':
        return '📩 요청됨';
      case 'matched':
        return '🎉 매칭됨';
      default:
        return status;
    }
  };

  const getJWTTokenStatus = () => {
    if (typeof window === 'undefined') return '서버 렌더링';

    try {
      // auth-storage에서 토큰 확인
      const authStorage = localStorage.getItem('auth-storage');
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
  };

  const getCarrierServerValue = (carrier: string) => {
    return carrier === 'LGU+' ? 'LG' : carrier || 'ALL';
  };

  const getPriceRangeServerValue = (price: string) => {
    if (!price) return 'ALL';
    if (price.includes('0 - 999')) return 'P0_999';
    if (price.includes('1,000 - 1,499')) return 'P1000_1499';
    if (price.includes('1,500 - 1,999')) return 'P1500_1999';
    if (price.includes('2,000 - 2,499')) return 'P2000_2499';
    if (price.includes('2,500 이상')) return 'P2500_PLUS';
    return 'ALL';
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-gray-800 p-4 rounded-lg shadow-lg min-w-[300px] max-w-[400px]">
        <h4 className="text-white text-sm font-medium mb-3">🔧 개발 패널</h4>

        <div className="space-y-2 text-xs">
          {/* WebSocket 상태 */}
          <div className="text-gray-300">
            <strong>WebSocket 상태:</strong>
            <span
              className={`ml-2 px-2 py-1 rounded ${
                isConnected
                  ? 'bg-green-600 text-white'
                  : 'bg-red-600 text-white'
              }`}
            >
              {isConnected ? '✅ 연결됨' : '❌ 연결 안됨'}
            </span>
          </div>

          {/* 현재 모드 */}
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

          {/* 매칭 상태 */}
          <div className="text-gray-300">
            <strong>매칭 상태:</strong>
            <span className="ml-2 text-white">
              {getMatchingStatusText(matchingStatus)}
            </span>
          </div>

          {/* 매칭 결과 */}
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

          {/* 서버 URL */}
          <div className="text-gray-300">
            <strong>서버 URL:</strong>
            <span className="ml-2 text-blue-300 text-[10px]">
              {process.env.NEXT_PUBLIC_WS_URL || 'https://api.snac-app.com/ws'}
            </span>
          </div>

          {/* JWT 토큰 */}
          <div className="text-gray-300">
            <strong>JWT 토큰:</strong>
            <span className="ml-2 text-yellow-300">{getJWTTokenStatus()}</span>
          </div>

          {/* 구매자 필터 정보 */}
          {userRole === 'buyer' &&
            appliedFilters.transactionType.includes('구매자') && (
              <div className="mt-2 p-2 bg-blue-900 rounded">
                <div className="text-blue-200 font-medium">구매자 필터:</div>
                <div className="text-blue-300 text-[10px]">
                  <strong>UI:</strong>
                  <br />
                  통신사: {appliedFilters.carrier.join(', ') || '미설정'}
                  <br />
                  데이터: {appliedFilters.dataAmount.join(', ') || '미설정'}
                  <br />
                  가격: {appliedFilters.price.join(', ') || '미설정'}
                  <br />
                  <strong>서버 전송:</strong>
                  <br />
                  carrier: {getCarrierServerValue(appliedFilters.carrier[0])}
                  <br />
                  dataAmount:{' '}
                  {parseInt(
                    appliedFilters.dataAmount[0]?.replace(/[^0-9]/g, '') || '1'
                  )}
                  <br />
                  priceRange:{' '}
                  {getPriceRangeServerValue(appliedFilters.price[0])}
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
                    <div className="text-gray-400">진행중인 거래 없음</div>
                  )}
                </div>
              </div>
            )}

          {/* 판매자 정보 */}
          {userRole === 'seller' && (
            <div className="mt-2 p-2 bg-green-900 rounded">
              <div className="text-green-200 font-medium">판매자 카드:</div>
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
                carrier: {getCarrierServerValue(sellerInfo.carrier)}
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
                      key={req.tradeId}
                      className="mt-1 p-1 bg-yellow-800 rounded"
                    >
                      요청 #{idx + 1}: {req.buyerName}
                      <br />
                      ID: {req.tradeId}
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

        {/* 연결 실패 경고 */}
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
  );
}
