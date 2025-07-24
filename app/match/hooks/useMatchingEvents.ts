'use client';

import { useEffect, useRef, Dispatch, SetStateAction } from 'react';
import { useRouter } from 'next/navigation';
import { Client as StompClient } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { useMatchStore } from '@/app/(shared)/stores/match-store';
import { User, Filters } from '../types';
import { TradeRequest } from '../types/match';

type MatchingStatus =
  | 'idle'
  | 'searching'
  | 'requesting'
  | 'requested'
  | 'matched';

interface UseMatchingEventsProps {
  userRole: 'buyer' | 'seller' | null;
  appliedFilters: Filters;
  setIncomingRequests: Dispatch<SetStateAction<TradeRequest[]>>;
  setActiveSellers: Dispatch<SetStateAction<User[]>>;
  setMatchingStatus: Dispatch<SetStateAction<MatchingStatus>>;
  setConnectedUsers?: Dispatch<SetStateAction<number>>; // 접속자 수 상태 추가
  onTradeStatusChange?: (status: string, tradeData: ServerTradeData) => void; // 거래 상태 변경 콜백
}

// 서버에서 받는 카드 데이터 타입
interface ServerCardData {
  id: number;
  name: string;
  email: string;
  sellStatus: string;
  cardCategory: string;
  carrier: string;
  dataAmount: number;
  price: number;
  createdAt?: string;
  updatedAt?: string;
}

// 서버에서 받는 거래 데이터 타입
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

export function useMatchingEvents({
  userRole,
  setIncomingRequests,
  setActiveSellers,
  setMatchingStatus,
  setConnectedUsers,
  onTradeStatusChange,
}: UseMatchingEventsProps) {
  const router = useRouter();
  const { foundMatch } = useMatchStore();
  const stompClient = useRef<StompClient | null>(null);
  const isConnected = useRef(false);

  // JWT 토큰 가져오기 (auth-store에서)
  const getToken = () => {
    if (typeof window === 'undefined') return null;

    try {
      // 1. Zustand persist에서 저장된 토큰 확인
      const authStorage = localStorage.getItem('auth-storage');
      if (authStorage) {
        const parsed = JSON.parse(authStorage);
        if (parsed.state?.token) {
          console.log('✅ auth-storage에서 토큰 발견');
          return parsed.state.token;
        }
      }

      // 2. 다른 가능한 위치에서 토큰 확인 (fallback)
      const fallbackToken =
        localStorage.getItem('accessToken') ||
        localStorage.getItem('token') ||
        localStorage.getItem('jwt');

      if (fallbackToken) {
        console.log('✅ fallback 위치에서 토큰 발견');
        return fallbackToken;
      }

      // 3. 쿠키에서도 확인
      if (typeof document !== 'undefined') {
        const cookies = document.cookie.split(';');
        const tokenCookie = cookies.find(
          (cookie) =>
            cookie.trim().startsWith('token=') ||
            cookie.trim().startsWith('accessToken=')
        );
        if (tokenCookie) {
          console.log('✅ 쿠키에서 토큰 발견');
          return tokenCookie.split('=')[1];
        }
      }

      console.warn('⚠️ JWT 토큰을 찾을 수 없습니다. 로그인이 필요합니다.');
      return null;
    } catch (error) {
      console.error('❌ 토큰 파싱 중 오류:', error);
      return null;
    }
  };

  // 서버 카드 데이터를 클라이언트 User 타입으로 변환
  const convertServerCardToUser = (card: ServerCardData): User => ({
    id: card.id, // 이것이 cardId
    type: 'seller' as const,
    name: card.name,
    carrier: card.carrier,
    data: card.dataAmount,
    price: card.price,
    cardId: card.id, // cardId 명시적 추가
  });

  // WebSocket 연결
  const connectWebSocket = () => {
    if (isConnected.current || !userRole) return;

    const token = getToken();
    if (!token) {
      console.error('❌ JWT 토큰이 없습니다. 로그인이 필요합니다.');
      return;
    }

    console.log('🔌 웹소켓 연결 시작...', { userRole, hasToken: !!token });

    stompClient.current = new StompClient({
      webSocketFactory: () =>
        new SockJS(
          process.env.NEXT_PUBLIC_WS_URL || 'https://api.snac-app.com/ws'
        ),
      connectHeaders: {
        Authorization: `Bearer ${token}`,
      },
      // 재연결 설정
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      debug: (str) => {
        if (process.env.NODE_ENV === 'development') {
          console.log('[STOMP]', str);
        }
      },
      onConnect: () => {
        console.log('✅ 웹소켓 연결 성공');
        isConnected.current = true;
        setupSubscriptions();
      },
      onStompError: (frame) => {
        console.error('❌ STOMP 에러:', frame);
        console.error('❌ 에러 상세:', frame.headers);
        isConnected.current = false;

        // 인증 에러인 경우 특별 처리
        if (
          frame.headers.message?.includes('ExecutorSubscribableChannel') ||
          frame.headers.message?.includes('Authentication')
        ) {
          console.error('🚫 인증 실패 - 토큰을 확인하세요!');
          // 개발 모드에서는 알림 표시
          if (process.env.NODE_ENV === 'development') {
            alert('WebSocket 인증 실패!\n실제 JWT 토큰이 필요합니다.');
          }
        }
      },
      onDisconnect: () => {
        console.log('🔌 웹소켓 연결 해제');
        isConnected.current = false;
      },
      onWebSocketError: (event) => {
        console.error('🌐 WebSocket 에러:', event);
      },
    });

    stompClient.current.activate();
  };

  // 구독 설정
  const setupSubscriptions = () => {
    if (!stompClient.current?.connected) return;

    console.log('🔗 WebSocket 구독 설정 중...');

    // HTML 예제에 따른 접속자 수 구독
    stompClient.current.subscribe('/topic/connected-users', (frame) => {
      console.log('👥 전체 접속자 수:', frame.body);
      if (setConnectedUsers) {
        setConnectedUsers(parseInt(frame.body) || 0);
      }
    });

    stompClient.current.subscribe('/user/queue/connected-users', (frame) => {
      console.log('👥 개인 접속자 수:', frame.body);
      if (setConnectedUsers) {
        setConnectedUsers(parseInt(frame.body) || 0);
      }
    });

    // 접속자 수 요청 (HTML 예제와 동일)
    stompClient.current.publish({
      destination: '/app/connected-users',
      body: '',
    });

    // 1. 매칭 알림 구독 (구매자용)
    if (userRole === 'buyer') {
      stompClient.current.subscribe('/user/queue/matching', (frame) => {
        console.log('🟢 매칭 알림 수신:', frame.body);
        try {
          const cardData: ServerCardData = JSON.parse(frame.body);
          const user = convertServerCardToUser(cardData);

          // 매칭 결과 처리 (중복 검출 및 스마트 업데이트)
          setActiveSellers((prev) => {
            // 1. 기존 카드 중에서 동일한 판매자 찾기 (id, name, carrier, data, price로 식별)
            const existingIndex = prev.findIndex(
              (existing) =>
                existing.id === user.id ||
                (existing.name === user.name &&
                  existing.carrier === user.carrier &&
                  existing.data === user.data &&
                  existing.price === user.price)
            );

            if (existingIndex !== -1) {
              // 기존 카드가 있으면 업데이트 (정보 변경 가능성 대비)
              console.log('🔄 기존 판매자 카드 업데이트:', {
                기존: prev[existingIndex].name,
                새로운: user.name,
                id: user.id,
              });

              const updated = [...prev];
              updated[existingIndex] = {
                ...updated[existingIndex],
                ...user, // 새로운 정보로 업데이트
                rating: updated[existingIndex].rating, // 기존 평점 유지
                transactionCount: updated[existingIndex].transactionCount, // 기존 거래 수 유지
              };

              return updated;
            } else {
              // 새로운 카드 추가
              console.log('➕ 새로운 판매자 카드 추가:', {
                이름: user.name,
                통신사: user.carrier,
                데이터: user.data,
                가격: user.price,
                id: user.id,
              });

              const updated = [...prev, user];

              // 첫 번째 매칭 결과를 받았을 때 검색 상태 해제
              if (prev.length === 0 && updated.length > 0) {
                console.log('✅ 첫 매칭 결과 수신 - 검색 상태 해제');
                setMatchingStatus('idle');
              }

              return updated;
            }
          });
        } catch (error) {
          console.error('❌ 매칭 알림 파싱 오류:', error);
          console.error('❌ 원본 데이터:', frame.body);
        }
      });
    }

    // 2. 거래 알림 구독 (판매자용 + 구매자용)
    stompClient.current.subscribe('/user/queue/trade', (frame) => {
      console.log('🔔 거래 알림 수신:', frame.body);
      try {
        const tradeData: ServerTradeData = JSON.parse(frame.body);
        console.log('🔧 파싱된 거래 데이터:', tradeData);

        // 서버 상태를 클라이언트 상태로 매핑
        let clientStatus = tradeData.status;
        if (tradeData.status === 'BUY_REQUESTED') {
          clientStatus = 'PENDING';
        } else if (tradeData.status === 'SELL_APPROVED') {
          clientStatus = 'ACCEPTED';
        } else if (tradeData.status === 'SELL_REJECTED') {
          clientStatus = 'REJECTED';
        }

        console.log('🔄 상태 매핑:', tradeData.status, '→', clientStatus);

        // 거래 상태 변경 콜백 호출
        if (onTradeStatusChange) {
          onTradeStatusChange(clientStatus, tradeData);
        }

        // 판매자용: 거래 요청인 경우 (BUY_REQUESTED → PENDING)
        if (userRole === 'seller' && tradeData.status === 'BUY_REQUESTED') {
          console.log('📩 판매자에게 거래 요청 도착:', {
            tradeId: tradeData.id,
            buyer: tradeData.buyer,
            cardId: tradeData.cardId,
            buyerPhone: tradeData.phone,
          });

          const request: TradeRequest = {
            id: `trade_${tradeData.id}`,
            buyerId: tradeData.buyer,
            buyerName: tradeData.buyer, // 구매자 이메일/ID
            sellerId: tradeData.seller,
            status: 'pending',
            createdAt: new Date().toISOString(),
          };

          console.log('📝 생성된 거래 요청 객체:', request);
          setIncomingRequests((prev) => {
            const updated = [...prev, request];
            console.log('📋 전체 거래 요청 목록:', updated);
            return updated;
          });
        }

        // 구매자용: 거래 수락인 경우 (SELL_APPROVED → ACCEPTED)
        if (userRole === 'buyer' && tradeData.status === 'SELL_APPROVED') {
          console.log('🎉 구매자에게 거래 수락 알림:', tradeData);
          setMatchingStatus('matched');
          foundMatch({
            id: tradeData.buyer,
            name: tradeData.buyer,
            carrier: tradeData.carrier,
            data: tradeData.dataAmount,
            price: tradeData.priceGb || 0,
            type: 'buyer',
          });
          setTimeout(() => router.push('/match/trading'), 1000);
        }

        // 구매자용: 거래 거부인 경우 (SELL_REJECTED → REJECTED)
        if (userRole === 'buyer' && tradeData.status === 'SELL_REJECTED') {
          console.log('❌ 구매자에게 거래 거부 알림:', tradeData);
          // 거래 거부 상태는 onTradeStatusChange에서 처리됨
        }
      } catch (error) {
        console.error('❌ 거래 알림 파싱 오류:', error);
        console.error('❌ 원본 데이터:', frame.body);
      }
    });

    // 3. 에러 알림 구독
    stompClient.current.subscribe('/user/queue/errors', (frame) => {
      console.error('❗ 서버 에러:', frame.body);
      alert('서버 에러: ' + frame.body);
    });
  };

  // 구매자 필터 등록
  const registerBuyerFilter = (filters: Filters) => {
    if (!stompClient.current?.connected || userRole !== 'buyer') return;

    // HTML 예제와 동일한 형식으로 변환
    const filterData = {
      carrier: convertCarrierToServer(filters.carrier[0]) || 'ALL',
      dataAmount: parseInt(
        filters.dataAmount[0]?.replace(/[^0-9]/g, '') || '1'
      ),
      priceRange: convertPriceFilter(filters.price),
    };

    console.log('📡 구매자 필터 등록:', filterData);

    stompClient.current.publish({
      destination: '/app/register-filter',
      body: JSON.stringify(filterData),
    });
  };

  // 판매자 카드 등록
  const registerSellerCard = (sellerInfo: {
    carrier: string;
    dataAmount: number;
    price: number;
  }) => {
    if (!stompClient.current?.connected || userRole !== 'seller') return;

    // HTML 예제와 동일한 형식
    const cardData = {
      carrier: convertCarrierToServer(sellerInfo.carrier),
      dataAmount: sellerInfo.dataAmount,
      price: sellerInfo.price,
    };

    console.log('💰 판매자 카드 등록:', cardData);

    stompClient.current.publish({
      destination: '/app/register-realtime-card',
      body: JSON.stringify(cardData),
    });
  };

  // 통신사 이름을 서버 형식으로 변환 (HTML과 동일)
  const convertCarrierToServer = (carrier: string): string => {
    switch (carrier) {
      case 'LGU+':
        return 'LG'; // HTML에서는 LG 사용
      case 'SKT':
        return 'SKT';
      case 'KT':
        return 'KT';
      default:
        return carrier;
    }
  };

  // 가격 필터 변환 (HTML과 정확히 동일)
  const convertPriceFilter = (priceFilters: string[]): string => {
    if (priceFilters.length === 0) return 'ALL';

    const firstFilter = priceFilters[0];
    // HTML의 정확한 값들과 매칭
    if (firstFilter.includes('0 - 999')) return 'P0_999';
    if (firstFilter.includes('1,000 - 1,499')) return 'P1000_1499';
    if (firstFilter.includes('1,500 - 1,999')) return 'P1500_1999';
    if (firstFilter.includes('2,000 - 2,499')) return 'P2000_2499';
    if (firstFilter.includes('2,500 이상')) return 'P2500_PLUS';

    return 'ALL';
  };

  // 거래 응답 (판매자용)
  const respondToTrade = (tradeId: string, accept: boolean) => {
    if (!stompClient.current?.connected) return;

    const numericTradeId = parseInt(tradeId.replace('trade_', ''));

    if (accept) {
      console.log('✅ 거래 수락 전송:', { tradeId: numericTradeId });
      stompClient.current.publish({
        destination: '/app/trade/approve',
        body: JSON.stringify({ tradeId: numericTradeId }),
      });
    } else {
      // 거래 거부 로직 (필요시 추가)
      console.log('❌ 거래 거부:', numericTradeId);
    }
  };

  // 거래 생성 (구매자용) - HTML 예제와 동일
  const createTrade = (cardId: number) => {
    if (!stompClient.current?.connected) return;

    console.log('🔥 거래 생성 요청 전송:', { cardId });
    stompClient.current.publish({
      destination: '/app/trade/create',
      body: JSON.stringify({ cardId }),
    });
  };

  // 연결 및 정리
  useEffect(() => {
    connectWebSocket();

    return () => {
      if (stompClient.current?.connected) {
        stompClient.current.deactivate();
      }
      isConnected.current = false;
    };
  }, [userRole]);

  // 필터 변경 시 등록 → 수동 등록으로 변경
  // useEffect(() => {
  //   if (userRole === 'buyer' && appliedFilters.transactionType.includes('구매자')) {
  //     const hasFilters = appliedFilters.carrier.length > 0 ||
  //                       appliedFilters.dataAmount.length > 0 ||
  //                       appliedFilters.price.length > 0;

  //     if (hasFilters) {
  //       setTimeout(() => registerBuyerFilter(appliedFilters), 1000);
  //     }
  //   }
  // }, [appliedFilters, userRole]);

  // 외부에서 사용할 수 있는 함수들 반환
  return {
    isConnected: isConnected.current,
    registerSellerCard,
    registerBuyerFilter, // 수동 등록을 위해 추가
    respondToTrade,
    createTrade, // 거래 생성 함수 추가
  };
}
