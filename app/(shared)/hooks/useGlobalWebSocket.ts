'use client';

import React, { useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Client as StompClient } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { useMatchStore } from '../stores/match-store';
import { useModalStore } from '../stores/modal-store';
import { useWebSocketStore } from '../stores/websocket-store';
import { Filters } from '../../match/types';
import { TradeRequest } from '../../match/types/match';
import { User } from '../stores/match-store';
import { CancelReason } from '../constants';
import { toast } from 'sonner';
// 전역 소켓 클라이언트 (페이지 이동 시에도 유지)
let globalStompClient: StompClient | null = null;
let globalConnectionCount = 0;

// 현재 활성화된 페이지 추적
let activePage: 'match' | 'trading' | null = null;
const activeCallbacks: {
  match?: (status: string, tradeData: ServerTradeData) => void;
  trading?: (status: string, tradeData: ServerTradeData) => void;
} = {};

// 페이지 활성화 함수
const activatePage = (
  page: 'match' | 'trading',
  callback?: (status: string, tradeData: ServerTradeData) => void
) => {
  activePage = page;
  if (callback) {
    activeCallbacks[page] = callback;
  }
};

// 페이지 비활성화 함수
const deactivatePage = (page: 'match' | 'trading') => {
  if (activePage === page) {
    activePage = null;
  }
  delete activeCallbacks[page];
};

type MatchingStatus =
  | 'idle'
  | 'searching'
  | 'requesting'
  | 'requested'
  | 'matched';

// 서버에서 받는 카드 데이터 타입
interface ServerCardData {
  cardId: number;
  name: string;
  email: string;
  sellerNickName: string;
  buyerNickname: string;
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
  tradeId: number;
  cardId: number;
  status: string;
  seller: string;
  sellerId: number;
  sellerNickName: string;
  buyer: string;
  buyerId: number;
  buyerNickname: string;
  buyerRatingScore: number;
  carrier: string;
  dataAmount: number;
  priceGb?: number;
  point?: number;
  phone?: string;
  cancelReason?: string;
  sellerRatingScore?: number;
}

interface UseGlobalWebSocketProps {
  userRole?: 'buyer' | 'seller' | null;
  appliedFilters?: Filters;
  setIncomingRequests?: React.Dispatch<React.SetStateAction<TradeRequest[]>>;
  setMatchingStatus?: React.Dispatch<React.SetStateAction<MatchingStatus>>;
  onTradeStatusChange?: (status: string, tradeData: ServerTradeData) => void;
  onCardNotFound?: () => void; // 카드가 존재하지 않을 때 호출될 콜백
  skipAuthCheck?: boolean; // 인증 체크를 건너뛸지 여부
}

export function useGlobalWebSocket(props?: UseGlobalWebSocketProps) {
  const router = useRouter();
  const { openModal } = useModalStore();
  const {
    foundMatch,
    setWebSocketFunctions,
    partner,
    userRole,
    setUserRole,
    setCurrentCardId,
  } = useMatchStore();
  const {
    setConnectionStatus,
    setDisconnectFunction,
    isConnected,
    setConnectedUsers,
  } = useWebSocketStore();
  const connectionId = useRef(++globalConnectionCount);
  // JWT 토큰 가져오기
  const getToken = () => {
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
    } catch {
      return null;
    }
  };

  // 서버 카드 데이터를 클라이언트 User 타입으로 변환
  const convertServerCardToUser = (card: ServerCardData): User => {
    // null/undefined 체킹 후 안전하게 User 객체 생성
    if (!card || !card.cardId || !card.name || !card.carrier) {
      // 기본값으로 fallback
      return {
        tradeId: partner?.tradeId || 0,
        cardId: card?.cardId || 0,
        type: 'seller' as const,
        name: card?.name || 'unknown_seller',
        email: card?.email || 'unknown@example.com',
        carrier: card?.carrier || 'unknown',
        data: card?.dataAmount || 0,
        price: card?.price || 0,
      };
    }

    const user = {
      tradeId: partner?.tradeId || 0, // partner가 없으면 0으로 설정
      cardId: card.cardId,
      type: 'seller' as const,
      name: card.name,
      email: card.email || 'unknown@example.com', // email이 없으면 기본값
      carrier: card.carrier,
      data: card.dataAmount || 0, // dataAmount가 없으면 0
      price: card.price || 0, // price가 없으면 0
    };

    return user;
  };

  // WebSocket 연결
  const connectWebSocket = useCallback(() => {
    // 이미 전역 연결이 있으면 재사용
    if (globalStompClient?.connected) {
      setConnectionStatus(true);
      return;
    }

    const token = getToken();
    if (!token) {
      // skipAuthCheck가 true이면 에러 로그를 출력하지 않음
      if (!props?.skipAuthCheck) {
        // 토큰이 없으면 로그인 페이지로 이동
        if (typeof window !== 'undefined') {
          router.push('/login');
        }
      }
      return;
    }

    // 기존 연결이 있으면 정리
    if (globalStompClient) {
      globalStompClient.deactivate();
    }

    globalStompClient = new StompClient({
      webSocketFactory: () =>
        new SockJS(
          process.env.NEXT_PUBLIC_WS_URL || 'https://api.snac-app.com/ws'
        ),
      connectHeaders: { Authorization: 'Bearer ' + token },
      // debug: (str) => //.log(str),
      onConnect: () => {
        setConnectionStatus(true);

        // 연결 시 판매자 목록 초기화
        if (userRole === 'buyer') {
          const { setActiveSellers } = useMatchStore.getState();
          setActiveSellers([]);
        }

        setupSubscriptions();
      },
      onStompError: () => {
        setConnectionStatus(false);
      },
      onDisconnect: () => {
        setConnectionStatus(false);
      },
    });

    globalStompClient.activate();
  }, [props?.skipAuthCheck, setConnectionStatus, router, userRole]); // eslint-disable-line react-hooks/exhaustive-deps

  // 구독 설정
  const setupSubscriptions = useCallback(() => {
    if (!globalStompClient?.connected) return;

    //.log('🔗 전역 WebSocket 구독 설정 중...');

    // 1. 연결된 사용자 수 구독
    globalStompClient.subscribe('/topic/connected-users', (frame) => {
      //.log('👥 전체 연결된 사용자 수:', frame.body);
      setConnectedUsers(parseInt(frame.body) || 0);
    });

    globalStompClient.subscribe('/user/queue/connected-users', (frame) => {
      //.log('👤 개인 연결된 사용자 수:', frame.body);
      setConnectedUsers(parseInt(frame.body) || 0);
    });

    // 2. 필터 정보 구독
    globalStompClient.subscribe('/user/queue/filters', (frame) => {
      //.log('🔍 필터 정보 수신:', frame.body);
      try {
        JSON.parse(frame.body);
        //.log('📋 파싱된 필터 데이터:', data);
      } catch {
        //.error('❌ 필터 JSON 파싱 오류:', error);
      }
    });

    // 3. 매칭 알림 구독 (cardDto 전용)
    globalStompClient.subscribe('/user/queue/matching', (frame) => {
      //.log('🟢 매칭 알림 수신:', frame.body);
      try {
        const cardData: ServerCardData = JSON.parse(frame.body);
        const user = convertServerCardToUser(cardData);
        if (cardData.cardId) {
          setCurrentCardId(cardData.cardId);
        }
        const currentUserRole = useMatchStore.getState().userRole;

        if (currentUserRole === 'buyer') {
          const { setActiveSellers } = useMatchStore.getState();
          setActiveSellers((prev: User[]) => {
            // 더 정확한 중복 체크: 이름과 캐리어, 데이터, 가격이 모두 동일한 경우에만 중복으로 처리
            const existingIndex = prev.findIndex(
              (existing: User) =>
                existing.name === user.name &&
                existing.carrier === user.carrier &&
                existing.data === user.data &&
                existing.price === user.price
            );

            if (existingIndex !== -1) {
              // 기존 항목이 있으면 업데이트
              const updated = [...prev];
              updated[existingIndex] = {
                ...updated[existingIndex],
                ...user,
                rating: updated[existingIndex].rating,
                transactionCount: updated[existingIndex].transactionCount,
              };
              return updated;
            } else {
              // 새로운 판매자 추가
              const updated = [...prev, user];

              if (
                prev.length === 0 &&
                updated.length > 0 &&
                props?.setMatchingStatus
              ) {
                props.setMatchingStatus('idle');
              }
              return updated;
            }
          });
        }
      } catch {}
    });

    // 4. 거래 알림 구독 (tradeDto 전용)
    globalStompClient.subscribe('/user/queue/trade', (frame) => {
      //.log('🔔 거래 알림 수신:', frame.body);
      try {
        const tradeData: ServerTradeData = JSON.parse(frame.body);
        //.log('📋 거래 상태 변경:', tradeData);

        // cardId를 store에 저장
        if (tradeData.cardId) {
          setCurrentCardId(tradeData.cardId);
        }

        // tradeData에서 cardId를 찾아서 해당 user의 tradeId 업데이트
        if (userRole === 'buyer') {
          const { setActiveSellers } = useMatchStore.getState();
          setActiveSellers((prev: User[]) => {
            return prev.map((user) => {
              if (user.cardId === tradeData.cardId) {
                return {
                  ...user,
                  tradeId: tradeData.tradeId, // tradeId 업데이트
                };
              }
              return user;
            });
          });
        }

        foundMatch({
          tradeId: tradeData.tradeId,
          buyer: tradeData.buyer,
          seller: tradeData.seller,
          sellerId: Number(tradeData.sellerId),
          sellerNickName: tradeData.sellerNickName,
          buyerId: Number(tradeData.buyerId),
          buyerNickname: tradeData.buyerNickname,
          buyerRatingScore: tradeData.buyerRatingScore,
          cardId: tradeData.cardId,
          carrier: tradeData.carrier || 'unknown',
          dataAmount: tradeData.dataAmount || 0,
          phone: tradeData.phone || '010-0000-0000',
          point: tradeData.point || 0,
          priceGb: tradeData.priceGb || 0,
          sellerRatingScore: tradeData.sellerRatingScore || 1000,
          status: tradeData.status || 'ACCEPTED',
          cancelReason: tradeData.cancelReason || null,
          type: 'seller' as const,
        });

        // 서버 상태를 클라이언트 상태로 매핑
        let clientStatus = tradeData.status;
        if (tradeData.status === 'BUY_REQUESTED') {
          clientStatus = 'PENDING';
        } else if (tradeData.status === 'SELL_APPROVED') {
          clientStatus = 'ACCEPTED';
        } else if (tradeData.status === 'SELL_REJECTED') {
          clientStatus = 'REJECTED';
        } else if (tradeData.status === 'PAYMENT_CONFIRMED') {
          clientStatus = 'PAYMENT_CONFIRMED';
        }

        // 거래 상태 변경 콜백 호출 (활성화된 페이지의 콜백만)
        if (activePage && activeCallbacks[activePage]) {
          activeCallbacks[activePage]!(clientStatus, tradeData);
        }

        // 판매자용: 거래 요청인 경우

        if (
          tradeData.status === 'BUY_REQUESTED' &&
          props?.setIncomingRequests
        ) {
          const request: TradeRequest = {
            tradeId: tradeData.tradeId,
            cardId: tradeData.cardId,
            buyerId: Number(tradeData.buyerId),
            buyerName: tradeData.buyer,
            sellerId: Number(tradeData.sellerId),
            seller: tradeData.seller,
            buyer: tradeData.buyer,
            sellerNickName: tradeData.sellerNickName,
            buyerNickname: tradeData.buyerNickname,
            sellerRatingScore: tradeData.sellerRatingScore || 1000,
            buyerRatingScore: tradeData.buyerRatingScore || 1000,
            status: 'pending',
            createdAt: new Date().toISOString(),
            ratingData: tradeData.sellerRatingScore,
          };

          props.setIncomingRequests((prev: TradeRequest[]) => [
            ...prev,
            request,
          ]);
        }

        // 구매자용: 거래 수락인 경우
        if (userRole === 'buyer' && tradeData.status === 'SELL_APPROVED') {
          if (props?.setMatchingStatus) {
            props.setMatchingStatus('matched');
          }
          // null/undefined 체킹 후 안전하게 foundMatch 호출
          if (
            tradeData &&
            tradeData.tradeId &&
            tradeData.buyer &&
            tradeData.seller &&
            tradeData.cardId
          ) {
            foundMatch({
              tradeId: tradeData.tradeId, // tradeId를 id로 사용
              buyer: tradeData.buyer,
              seller: tradeData.seller,
              cardId: tradeData.cardId,
              buyerId: Number(tradeData.buyerId),
              buyerNickname: tradeData.buyerNickname,
              buyerRatingScore: tradeData.buyerRatingScore,
              sellerId: Number(tradeData.sellerId),
              sellerNickName: tradeData.sellerNickName,
              carrier: tradeData.carrier || 'unknown',
              dataAmount: tradeData.dataAmount || 0,
              phone: tradeData.phone || '010-0000-0000',
              point: tradeData.point || 0,
              priceGb: tradeData.priceGb || 0,
              sellerRatingScore: tradeData.sellerRatingScore || 1000,
              status: tradeData.status || 'ACCEPTED',
              cancelReason: tradeData.cancelReason || null,
              type: 'seller' as const, // 구매자 입장에서 상대방은 판매자
            });
          }

          setTimeout(() => router.push('/match/trading'), 1000);
        }

        // CARD_INVALID_STATUS 에러 처리
        if (tradeData.status === 'CARD_INVALID_STATUS') {
          toast.error('카드 상태 오류', {
            description: `사유: ${tradeData.cancelReason}, 현재 카드 상태: ${tradeData.status}`,
          });
        }
      } catch {}
    });

    // 5. 에러 메시지 구독
    globalStompClient.subscribe('/user/queue/errors', (frame) => {
      //.error('❗에러 메시지 수신:', frame.body);
      try {
        const error = frame.body;
        //.log(error, 'error');
        if (error === 'CARD_INVALID_STATUS') {
          toast.error(`해당 유저는 이미 거래중입니다.`);
        } else if (error === 'CARD_NOT_FOUND') {
          toast.error(`카드가 서버에 존재하지 않음`);
          // 카드가 존재하지 않을 때 콜백 함수 호출
          if (props?.onCardNotFound) {
            props.onCardNotFound();
          }
        } else {
          toast.error(`에러: ${error || frame.body}`);
        }
      } catch {
        toast.error(`에러: ${frame.body}`);
      }
    });

    // 6. 거래 취소 알림 구독
    globalStompClient.subscribe('/user/queue/cancel', (frame) => {
      //.log('⛔️ 거래 취소 알림 수신:', frame.body);
      try {
        const msg = JSON.parse(frame.body);
        const trade = msg.tradeDto || {};

        // 취소 사유가 있으면 모달 표시
        if (trade.cancelReason) {
          openModal('trade-cancel', {
            cancelReason: trade.cancelReason,
            tradeId: trade.id,
            cardId: trade.cardId,
          });
        }
      } catch {}
    });

    // 연결된 사용자 수 요청
    globalStompClient.publish({
      destination: '/app/connected-users',
      body: '',
    });
  }, [userRole]); // eslint-disable-line react-hooks/exhaustive-deps

  // 통신사 이름을 서버 형식으로 변환
  const convertCarrierToServer = (carrier: string): string => {
    switch (carrier) {
      case 'LG U+':
        return 'LG';
      case 'SKT':
        return 'SKT';
      case 'KT':
        return 'KT';
      default:
        return carrier;
    }
  };

  // 가격 필터 변환
  const convertPriceFilter = (priceFilters: string[]): string => {
    if (priceFilters.length === 0) return 'ALL';
    return priceFilters[0] || 'ALL';
  };

  // userRole 업데이트 함수
  const updateUserRole = useCallback(
    (newUserRole: 'buyer' | 'seller' | null) => {
      //.log('🔄 userRole 업데이트:', newUserRole, '이전 값:', userRole);
      setUserRole(newUserRole);
    },
    [setUserRole]
  );

  // 구매자 필터 등록
  const registerBuyerFilter = useCallback(
    (filters: Filters) => {
      if (!globalStompClient?.connected || userRole !== 'buyer') return;

      const filterData = {
        carrier: convertCarrierToServer(filters.carrier[0]) || 'ALL',
        dataAmount: parseInt(
          filters.dataAmount[0]?.replace(/[^0-9]/g, '') || '1'
        ),
        priceRange: convertPriceFilter(filters.price),
      };

      //.log('📡 구매자 필터 등록:', filterData);

      globalStompClient.publish({
        destination: '/app/register-filter',
        body: JSON.stringify(filterData),
      });
    },
    [userRole]
  );

  // 구매자 필터 제거
  const removeBuyerFilter = useCallback(() => {
    if (!globalStompClient?.connected || userRole !== 'buyer') {
      return;
    }

    globalStompClient.publish({
      destination: '/app/filter/remove',
      body: JSON.stringify({}), // 빈 객체 또는 필요한 데이터
    });
  }, [userRole]);

  // 판매자 카드 등록
  const registerSellerCard = useCallback(
    (sellerInfo: { carrier: string; dataAmount: number; price: number }) => {
      if (!globalStompClient?.connected || userRole !== 'seller') {
        return;
      }

      const cardData = {
        carrier: convertCarrierToServer(sellerInfo.carrier),
        dataAmount: sellerInfo.dataAmount,
        price: sellerInfo.price,
      };

      globalStompClient.publish({
        destination: '/app/register-realtime-card',
        body: JSON.stringify(cardData),
      });
    },
    [userRole]
  );

  // 판매자 카드 삭제
  const deleteSellerCard = useCallback(
    (
      cardId?: number,
      reason: CancelReason = CancelReason.SELLER_CHANGE_MIND
    ) => {
      if (!globalStompClient?.connected || userRole !== 'seller') {
        return;
      }

      // store에서 currentCardId를 가져와서 사용
      const { currentCardId } = useMatchStore.getState();
      const targetCardId = cardId || currentCardId;
      if (!targetCardId) {
        return;
      }

      globalStompClient.publish({
        destination: '/app/trade/buy-request/cancel/seller',
        body: JSON.stringify({ cardId: targetCardId, reason }),
      });
    },
    [userRole]
  );

  // 거래 응답 (판매자용)
  const respondToTrade = useCallback(
    (tradeId: number, accept: boolean, cardId?: number) => {
      if (!globalStompClient?.connected) return;

      if (accept) {
        globalStompClient.publish({
          destination: '/app/trade/approve',
          body: JSON.stringify({ tradeId }),
        });
      } else {
        globalStompClient.publish({
          destination: '/app/trade/buy-request/cancel/seller',
          body: JSON.stringify({ cardId, reason: 'SELLER_CHANGE_MIND' }),
        });
      }
    },
    []
  );

  // 거래 생성 (구매자용)
  const createTrade = useCallback((cardId: number) => {
    if (!globalStompClient?.connected) return;

    globalStompClient.publish({
      destination: '/app/trade/create',
      body: JSON.stringify({ cardId }),
    });
  }, []);

  // 결제 메시지 전송
  const sendPayment = useCallback(
    (tradeId: number, money: number, point: number) => {
      if (!globalStompClient?.connected) {
        //.error('❌ WebSocket이 연결되지 않았습니다.');
        return false;
      }

      //.log('💰 결제 메시지 전송:', { tradeId, money, point });

      globalStompClient.publish({
        destination: '/app/trade/payment',
        body: JSON.stringify({ tradeId, money, point }),
      });

      return true;
    },
    []
  );

  // 거래 확정 메시지 전송
  const sendTradeConfirm = useCallback((tradeId: number) => {
    if (!globalStompClient?.connected) {
      //.error('❌ WebSocket이 연결되지 않았습니다.');
      return false;
    }

    //.log('✅ 거래 확정 메시지 전송:', { tradeId });

    globalStompClient.publish({
      destination: '/app/trade/confirm',
      body: JSON.stringify({ tradeId }),
    });

    return true;
  }, []);

  // 거래 취소 메시지 전송
  const sendTradeCancel = useCallback(
    (userType: 'buyer' | 'seller', currentStep?: string, tradeId?: number) => {
      if (!globalStompClient?.connected) {
        //.error('❌ WebSocket이 연결되지 않았습니다.');
        return false;
      }

      // 특정 상태에서는 accepted/cancel 엔드포인트 사용
      const shouldUseAcceptedCancel =
        (userType === 'seller' &&
          (currentStep === 'confirmation' ||
            currentStep === 'waiting_payment')) ||
        (userType === 'buyer' && currentStep === 'confirmation');

      const destination = shouldUseAcceptedCancel
        ? userType === 'buyer'
          ? '/app/trade/accepted/cancel/buyer'
          : '/app/trade/accepted/cancel/seller'
        : userType === 'buyer'
          ? '/app/trade/payment/cancel/buyer'
          : '/app/trade/payment/cancel/seller';

      // reason 설정
      const reason =
        userType === 'seller' ? 'SELLER_CHANGE_MIND' : 'BUYER_CHANGE_MIND';

      globalStompClient.publish({
        destination,
        body: JSON.stringify({ tradeId, reason }),
      });

      return true;
    },
    []
  );

  // 구매 요청 취소 메시지 전송
  const sendBuyRequestCancel = useCallback((cardId: number) => {
    if (!globalStompClient?.connected) {
      return false;
    }

    globalStompClient.publish({
      destination: '/app/trade/buy-request/cancel/buyer',
      body: JSON.stringify({ cardId, reason: 'BUYER_CHANGE_MIND' }),
    });

    return true;
  }, []);

  // 실제 WebSocket 연결 해제 함수
  const disconnectWebSocket = useCallback(() => {
    if (globalStompClient?.connected) {
      globalStompClient.deactivate();
      globalStompClient = null;
      setConnectionStatus(false);
    }
  }, [setConnectionStatus]);

  // 실제 해제 함수를 store에 등록
  useEffect(() => {
    setDisconnectFunction(disconnectWebSocket);
  }, [disconnectWebSocket, setDisconnectFunction]);

  // 연결 및 정리
  useEffect(() => {
    // 토큰이 있을 때만 WebSocket 연결 시도
    const token = getToken();
    if (token || props?.skipAuthCheck) {
      connectWebSocket();
    }

    return () => {
      // 마지막 연결인 경우에만 정리
      const currentConnectionId = connectionId.current; // eslint-disable-line react-hooks/exhaustive-deps
      if (currentConnectionId === globalConnectionCount) {
        if (globalStompClient?.connected) {
          globalStompClient.deactivate();
          globalStompClient = null;
        }
      }
    };
  }, [props?.skipAuthCheck, connectWebSocket]);

  // WebSocket 함수들을 store에 저장
  useEffect(() => {
    setWebSocketFunctions({ sendPayment, sendTradeConfirm });
  }, [sendPayment, sendTradeConfirm, setWebSocketFunctions]);

  return {
    isConnected,
    registerSellerCard,
    deleteSellerCard,
    registerBuyerFilter,
    removeBuyerFilter,
    respondToTrade,
    createTrade,
    sendPayment,
    sendTradeConfirm,
    sendTradeCancel,
    sendBuyRequestCancel,
    updateUserRole,
    activatePage,
    deactivatePage,
    disconnectWebSocket,
  };
}
