'use client';

import React, { useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Client as StompClient } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { useMatchStore } from '../stores/match-store';
import { useModalStore } from '../stores/modal-store';
import { useWebSocketStore } from '../stores/websocket-store';
import { User, Filters } from '../../match/types';
import { TradeRequest } from '../../match/types/match';
import { CancelReason } from '../constants';

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
  console.log(`🔄 ${page} 페이지 활성화됨`);
};

// 페이지 비활성화 함수
const deactivatePage = (page: 'match' | 'trading') => {
  if (activePage === page) {
    activePage = null;
  }
  delete activeCallbacks[page];
  console.log(`🔄 ${page} 페이지 비활성화됨`);
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
  buyer: string;
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
  setActiveSellers?: React.Dispatch<React.SetStateAction<User[]>>;
  setMatchingStatus?: React.Dispatch<React.SetStateAction<MatchingStatus>>;
  setConnectedUsers?: React.Dispatch<React.SetStateAction<number>>;
  onTradeStatusChange?: (status: string, tradeData: ServerTradeData) => void;
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
  const { setConnectionStatus, setDisconnectFunction, isConnected } =
    useWebSocketStore();
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
    } catch (error) {
      console.error('토큰 가져오기 실패:', error);
      return null;
    }
  };

  // 서버 카드 데이터를 클라이언트 User 타입으로 변환
  const convertServerCardToUser = (card: ServerCardData): User => {
    // null/undefined 체킹 후 안전하게 User 객체 생성
    if (!card || !card.cardId || !card.name || !card.carrier) {
      console.error('❌ convertServerCardToUser 실패: 필수 카드 데이터 누락', {
        card,
        cardId: card?.cardId,
        name: card?.name,
        carrier: card?.carrier,
      });
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

    console.log('🔄 서버 카드 데이터 변환:', {
      서버_cardId: card.cardId,
      서버_email: card.email,
      partner_tradeId: partner?.tradeId,
      변환된_tradeId: user.tradeId,
      변환된_cardId: user.cardId,
      변환된_email: user.email,
      전체_데이터: user,
    });
    return user;
  };

  // WebSocket 연결
  const connectWebSocket = () => {
    // 이미 전역 연결이 있으면 재사용
    if (globalStompClient?.connected) {
      console.log('✅ 기존 전역 WebSocket 연결 재사용');
      setConnectionStatus(true);
      return;
    }

    const token = getToken();
    if (!token) {
      console.error('❌ 토큰이 없어서 WebSocket 연결할 수 없습니다.');
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
      // debug: (str) => console.log(str),
      onConnect: () => {
        console.log('✅ 전역 WebSocket 연결 성공');
        setConnectionStatus(true);
        setupSubscriptions();
      },
      onStompError: (frame) => {
        console.error('❌ STOMP 오류:', frame);
        setConnectionStatus(false);
      },
      onDisconnect: () => {
        console.log('🔌 WebSocket 연결 해제');
        setConnectionStatus(false);
      },
    });

    globalStompClient.activate();
  };

  // 구독 설정
  const setupSubscriptions = () => {
    if (!globalStompClient?.connected) return;

    console.log('🔗 전역 WebSocket 구독 설정 중...');

    // 1. 연결된 사용자 수 구독
    globalStompClient.subscribe('/topic/connected-users', (frame) => {
      console.log('👥 전체 연결된 사용자 수:', frame.body);
      if (props?.setConnectedUsers) {
        props.setConnectedUsers(parseInt(frame.body) || 0);
      }
    });

    globalStompClient.subscribe('/user/queue/connected-users', (frame) => {
      console.log('👤 개인 연결된 사용자 수:', frame.body);
      if (props?.setConnectedUsers) {
        props.setConnectedUsers(parseInt(frame.body) || 0);
      }
    });

    // 2. 필터 정보 구독
    globalStompClient.subscribe('/user/queue/filters', (frame) => {
      console.log('🔍 필터 정보 수신:', frame.body);
      try {
        const data = JSON.parse(frame.body);
        console.log('📋 파싱된 필터 데이터:', data);
      } catch (error) {
        console.error('❌ 필터 JSON 파싱 오류:', error);
      }
    });

    // 3. 매칭 알림 구독 (cardDto 전용)
    globalStompClient.subscribe('/user/queue/matching', (frame) => {
      console.log('🟢 매칭 알림 수신:', frame.body);
      try {
        const cardData: ServerCardData = JSON.parse(frame.body);
        const user = convertServerCardToUser(cardData);
        if (cardData.cardId) {
          setCurrentCardId(cardData.cardId);
        }
        const currentUserRole = useMatchStore.getState().userRole;
        console.log('🔍 매칭 알림 처리 조건 확인:', {
          currentUserRole,
          hasSetActiveSellers: !!props?.setActiveSellers,
          isBuyer: userRole === 'buyer',
        });

        if (currentUserRole === 'buyer' && props?.setActiveSellers) {
          props.setActiveSellers((prev: User[]) => {
            const existingIndex = prev.findIndex(
              (existing: User) =>
                existing.tradeId === user.tradeId ||
                (existing.name === user.name &&
                  existing.carrier === user.carrier &&
                  existing.data === user.data &&
                  existing.price === user.price)
            );

            if (existingIndex !== -1) {
              const updated = [...prev];
              updated[existingIndex] = {
                ...updated[existingIndex],
                ...user,
                rating: updated[existingIndex].rating,
                transactionCount: updated[existingIndex].transactionCount,
              };
              return updated;
            } else {
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
      } catch (error) {
        console.error('❌ 매칭 큐 파싱 오류:', error);
      }
    });

    // 4. 거래 알림 구독 (tradeDto 전용)
    globalStompClient.subscribe('/user/queue/trade', (frame) => {
      console.log('🔔 거래 알림 수신:', frame.body);
      try {
        const tradeData: ServerTradeData = JSON.parse(frame.body);
        console.log('📋 거래 상태 변경:', {
          tradeId: tradeData.tradeId,
          cardId: tradeData.cardId,
          status: tradeData.status,
          seller: tradeData.seller,
          buyer: tradeData.buyer,
          carrier: tradeData.carrier,
          dataAmount: tradeData.dataAmount,
          priceGb: tradeData.priceGb,
          point: tradeData.point,
          phone: tradeData.phone,
          cancelReason: tradeData.cancelReason,
        });

        // cardId를 store에 저장
        if (tradeData.cardId) {
          setCurrentCardId(tradeData.cardId);
        }

        // tradeData에서 cardId를 찾아서 해당 user의 tradeId 업데이트
        if (userRole === 'buyer' && props?.setActiveSellers) {
          props.setActiveSellers((prev: User[]) => {
            return prev.map((user) => {
              if (user.cardId === tradeData.cardId) {
                console.log('🔄 user tradeId 업데이트:', {
                  기존_tradeId: user.tradeId,
                  새로운_tradeId: tradeData.tradeId,
                  cardId: user.cardId,
                  이름: user.name,
                });
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
          console.log(`🔔 ${activePage} 페이지 콜백 호출`);
          activeCallbacks[activePage]!(clientStatus, tradeData);
        } else {
          console.log('🔔 활성화된 페이지 없음 또는 콜백 없음:', {
            activePage,
            hasCallback: activePage ? !!activeCallbacks[activePage] : false,
          });
        }

        // 판매자용: 거래 요청인 경우
        console.log('🔍 거래 요청 처리 조건 확인:', {
          userRole,
          status: tradeData.status,
          hasSetIncomingRequests: !!props?.setIncomingRequests,
          isSeller: userRole === 'seller',
          isBuyRequested: tradeData.status === 'BUY_REQUESTED',
        });

        if (
          tradeData.status === 'BUY_REQUESTED' &&
          props?.setIncomingRequests
        ) {
          const request: TradeRequest = {
            tradeId: tradeData.tradeId,
            cardId: tradeData.cardId,
            buyerId: tradeData.buyer,
            buyerName: tradeData.buyer,
            sellerId: tradeData.seller,
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
            console.log('✅ foundMatch 호출 전 데이터 검증 완료:', {
              tradeId: tradeData.tradeId,
              buyer: tradeData.buyer,
              seller: tradeData.seller,
              cardId: tradeData.cardId,
            });

            foundMatch({
              tradeId: tradeData.tradeId, // tradeId를 id로 사용
              buyer: tradeData.buyer,
              seller: tradeData.seller,
              cardId: tradeData.cardId,
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
          } else {
            console.error('❌ foundMatch 호출 실패: 필수 데이터 누락', {
              tradeData,
              tradeId: tradeData?.tradeId,
              buyer: tradeData?.buyer,
              seller: tradeData?.seller,
              cardId: tradeData?.cardId,
            });
          }

          setTimeout(() => router.push('/match/trading'), 1000);
        }

        // CARD_INVALID_STATUS 에러 처리
        if (tradeData.status === 'CARD_INVALID_STATUS') {
          console.error('❌ 카드 상태 오류:', tradeData);
          alert(
            `카드 상태 오류: ${tradeData.cancelReason}\n\n현재 카드 상태: ${tradeData.status}`
          );
        }
      } catch (error) {
        console.error('❌ 거래 큐 파싱 오류:', error);
      }
    });

    // 5. 에러 메시지 구독
    globalStompClient.subscribe('/user/queue/errors', (frame) => {
      console.error('❗에러 메시지 수신:', frame.body);
      try {
        const error = JSON.parse(frame.body);
        if (error.error === 'CARD_INVALID_STATUS') {
          alert(
            `카드 상태 오류: ${error.message}\n\n현재 상태: ${error.currentStatus}\n필요한 상태: ${error.requiredStatus}`
          );
        } else {
          alert(`에러: ${error.message || frame.body}`);
        }
      } catch {
        alert(`에러: ${frame.body}`);
      }
    });

    // 6. 거래 취소 알림 구독
    globalStompClient.subscribe('/user/queue/cancel', (frame) => {
      console.log('⛔️ 거래 취소 알림 수신:', frame.body);
      try {
        const msg = JSON.parse(frame.body);
        const trade = msg.tradeDto || {};
        console.log('📋 거래 취소 정보:', {
          id: trade.id,
          cardId: trade.cardId,
          seller: trade.seller,
          buyer: trade.buyer,
          status: trade.status,
          cancelReason: trade.cancelReason,
        });

        // 취소 사유가 있으면 모달 표시
        if (trade.cancelReason) {
          openModal('trade-cancel', {
            cancelReason: trade.cancelReason,
            tradeId: trade.id,
            cardId: trade.cardId,
          });
        }
      } catch (error) {
        console.error('❌ 취소 큐 파싱 오류:', error);
      }
    });

    // 연결된 사용자 수 요청
    globalStompClient.publish({
      destination: '/app/connected-users',
      body: '',
    });
  };

  // 통신사 이름을 서버 형식으로 변환
  const convertCarrierToServer = (carrier: string): string => {
    switch (carrier) {
      case 'LGU+':
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
      console.log('🔄 userRole 업데이트:', newUserRole, '이전 값:', userRole);
      setUserRole(newUserRole);
    },
    [setUserRole, userRole]
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

      console.log('📡 구매자 필터 등록:', filterData);

      globalStompClient.publish({
        destination: '/app/register-filter',
        body: JSON.stringify(filterData),
      });
    },
    [userRole]
  );

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

      console.log('💰 판매자 카드 등록:', cardData);

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
      console.log(currentCardId, '야여기5');
      if (!targetCardId) {
        console.error('❌ 삭제할 카드 ID가 없습니다.');
        return;
      }

      console.log('🗑️ 판매자 카드 삭제:', { cardId: targetCardId, reason });

      globalStompClient.publish({
        destination: '/app/trade/buy-request/cancel/seller',
        body: JSON.stringify({ cardId: targetCardId, reason }),
      });
    },
    [userRole]
  );

  // 거래 응답 (판매자용)
  const respondToTrade = useCallback((tradeId: number, accept: boolean) => {
    if (!globalStompClient?.connected) return;

    if (accept) {
      console.log('✅ 거래 수락 전송:', { tradeId });
      globalStompClient.publish({
        destination: '/app/trade/approve',
        body: JSON.stringify({ tradeId }),
      });
    } else {
      console.log('❌ 거래 거부:', tradeId);
    }
  }, []);

  // 거래 생성 (구매자용)
  const createTrade = useCallback((cardId: number) => {
    if (!globalStompClient?.connected) return;

    console.log('🔥 거래 생성 요청 전송:', { cardId });
    globalStompClient.publish({
      destination: '/app/trade/create',
      body: JSON.stringify({ cardId }),
    });
  }, []);

  // 결제 메시지 전송
  const sendPayment = useCallback(
    (tradeId: number, money: number, point: number) => {
      if (!globalStompClient?.connected) {
        console.error('❌ WebSocket이 연결되지 않았습니다.');
        return false;
      }

      console.log('💰 결제 메시지 전송:', { tradeId, money, point });

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
      console.error('❌ WebSocket이 연결되지 않았습니다.');
      return false;
    }

    console.log('✅ 거래 확정 메시지 전송:', { tradeId });

    globalStompClient.publish({
      destination: '/app/trade/confirm',
      body: JSON.stringify({ tradeId }),
    });

    return true;
  }, []);

  // 실제 WebSocket 연결 해제 함수
  const disconnectWebSocket = useCallback(() => {
    if (globalStompClient?.connected) {
      console.log('🔌 실제 WebSocket 연결 해제 중...');
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
    connectWebSocket();

    return () => {
      // 마지막 연결인 경우에만 정리
      if (connectionId.current === globalConnectionCount) {
        console.log('🔄 마지막 연결 해제 - 전역 소켓 정리');
        if (globalStompClient?.connected) {
          globalStompClient.deactivate();
          globalStompClient = null;
        }
      }
    };
  }, []);

  // userRole 변경 감지
  useEffect(() => {
    console.log('🔄 useGlobalWebSocket userRole 변경:', userRole);
  }, [userRole]);

  // WebSocket 함수들을 store에 저장
  useEffect(() => {
    setWebSocketFunctions({ sendPayment, sendTradeConfirm });
  }, [sendPayment, sendTradeConfirm, setWebSocketFunctions]);

  return {
    isConnected,
    registerSellerCard,
    deleteSellerCard,
    registerBuyerFilter,
    respondToTrade,
    createTrade,
    sendPayment,
    sendTradeConfirm,
    updateUserRole,
    activatePage,
    deactivatePage,
    disconnectWebSocket,
  };
}
