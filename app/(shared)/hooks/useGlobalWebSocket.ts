'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Client as StompClient } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { useMatchStore } from '../stores/match-store';
import { User, Filters } from '../../match/types';
import { TradeRequest } from '../../match/types/match';

// 전역 소켓 클라이언트 (페이지 이동 시에도 유지)
let globalStompClient: StompClient | null = null;
let globalConnectionCount = 0;
let globalUserRole: 'buyer' | 'seller' | null = 'buyer';

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
  const { foundMatch, setWebSocketFunctions, partner } = useMatchStore();
  const [isConnected, setIsConnected] = useState(false);
  const connectionId = useRef(++globalConnectionCount);

  // 전역 userRole 사용 (모든 인스턴스에서 공유)
  const [userRole, setUserRole] = useState<'buyer' | 'seller' | null>(
    globalUserRole
  );
  // JWT 토큰 가져오기
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

      return null;
    } catch (error) {
      console.error('토큰 가져오기 실패:', error);
      return null;
    }
  };

  // 서버 카드 데이터를 클라이언트 User 타입으로 변환
  const convertServerCardToUser = (card: ServerCardData): User => {
    console.log(partner, 'partner값이없나?');
    const user = {
      tradeId: partner?.tradeId || 999, // partner의 id를 tradeId로 사용, 없으면 cardId 사용
      cardId: card.cardId,
      type: 'seller' as const,
      name: card.name,
      email: card.email, // email 필드 추가
      carrier: card.carrier,
      data: card.dataAmount,
      price: card.price,
    };
    return user;
  };

  // WebSocket 연결
  const connectWebSocket = () => {
    // 이미 전역 연결이 있으면 재사용
    if (globalStompClient?.connected) {
      console.log('✅ 기존 전역 WebSocket 연결 재사용');
      setIsConnected(true);
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
        setIsConnected(true);
        setupSubscriptions();
      },
      onStompError: (frame) => {
        console.error('❌ STOMP 오류:', frame);
        setIsConnected(false);
      },
      onDisconnect: () => {
        console.log('🔌 WebSocket 연결 해제');
        setIsConnected(false);
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
        console.log(cardData, '야여기1');
        const user = convertServerCardToUser(cardData);
        console.log(user, '야여기2');

        if (userRole === 'buyer' && props?.setActiveSellers) {
          console.log('실행되냐?');
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

        // tradeData에서 cardId를 찾아서 해당 user의 tradeId 업데이트
        if (userRole === 'buyer' && props?.setActiveSellers) {
          console.log('여기가 안오는거같은데 진짜 ??', userRole);
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

        // 서버 상태를 클라이언트 상태로 매핑
        let clientStatus = tradeData.status;
        if (tradeData.status === 'BUY_REQUESTED') {
          clientStatus = 'PENDING';
        } else if (tradeData.status === 'SELL_APPROVED') {
          clientStatus = 'ACCEPTED';
        } else if (tradeData.status === 'SELL_REJECTED') {
          clientStatus = 'REJECTED';
        }

        // 거래 상태 변경 콜백 호출
        if (props?.onTradeStatusChange) {
          props.onTradeStatusChange(clientStatus, tradeData);
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
        console.log('여기오냐1');
        if (userRole === 'buyer' && tradeData.status === 'SELL_APPROVED') {
          if (props?.setMatchingStatus) {
            props.setMatchingStatus('matched');
          }
          console.log('여기오냐2');
          console.log(tradeData, 'tradeData');
          foundMatch({
            tradeId: tradeData.tradeId, // tradeId를 id로 사용
            buyer: tradeData.buyer,
            seller: tradeData.seller,
            cardId: tradeData.cardId,
            carrier: tradeData.carrier,
            dataAmount: tradeData.dataAmount,
            phone: tradeData.phone || '010-0000-0000',
            point: tradeData.point || 0,
            priceGb: tradeData.priceGb || 0,
            sellerRatingScore: tradeData.sellerRatingScore || 1000,
            status: tradeData.status,
            cancelReason: tradeData.cancelReason || null,
            type: 'seller' as const, // 구매자 입장에서 상대방은 판매자
          });

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

    const firstFilter = priceFilters[0];
    if (firstFilter.includes('0 - 999')) return 'P0_999';
    if (firstFilter.includes('1,000 - 1,499')) return 'P1000_1499';
    if (firstFilter.includes('1,500 - 1,999')) return 'P1500_1999';
    if (firstFilter.includes('2,000 - 2,499')) return 'P2000_2499';
    if (firstFilter.includes('2,500 이상')) return 'P2500_PLUS';

    return 'ALL';
  };

  // userRole 업데이트 함수
  const updateUserRole = useCallback(
    (newUserRole: 'buyer' | 'seller' | null) => {
      console.log(
        '🔄 userRole 업데이트:',
        newUserRole,
        '이전 값:',
        globalUserRole
      );
      globalUserRole = newUserRole; // 전역 변수 업데이트
      setUserRole(newUserRole);
    },
    [] // 의존성 배열을 비워서 함수가 재생성되지 않도록 함
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
        console.log('여기서 걸리냐?', userRole, globalStompClient);
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

  // WebSocket 함수들을 store에 저장
  useEffect(() => {
    setWebSocketFunctions({ sendPayment, sendTradeConfirm });
  }, [sendPayment, sendTradeConfirm, setWebSocketFunctions]);

  return {
    isConnected,
    registerSellerCard,
    registerBuyerFilter,
    respondToTrade,
    createTrade,
    sendPayment,
    sendTradeConfirm,
    updateUserRole,
  };
}
