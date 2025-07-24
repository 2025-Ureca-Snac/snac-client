'use client';

import { useEffect, useRef } from 'react';
import { Client as StompClient } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

export function useTradingWebSocket() {
  const stompClient = useRef<StompClient | null>(null);
  const isConnected = useRef(false);

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

  // WebSocket 연결
  const connectWebSocket = () => {
    if (stompClient.current?.connected) return;

    const token = getToken();
    if (!token) {
      console.error('❌ 토큰이 없어서 WebSocket 연결할 수 없습니다.');
      return;
    }

    stompClient.current = new StompClient({
      webSocketFactory: () =>
        new SockJS(
          process.env.NEXT_PUBLIC_WS_URL || 'https://api.snac-app.com/ws'
        ),
      connectHeaders: { Authorization: 'Bearer ' + token },
      debug: (str) => console.log(str),
      onConnect: () => {
        console.log('✅ 거래 WebSocket 연결 성공');
        isConnected.current = true;

        // 거래 관련 메시지 구독
        stompClient.current?.subscribe('/user/queue/trade', (message) => {
          console.log('📨 거래 응답 메시지 수신:', message.body);
          try {
            const response = JSON.parse(message.body);
            console.log('📋 파싱된 응답 데이터:', response);
          } catch (error) {
            console.error('❌ 응답 메시지 파싱 실패:', error);
          }
        });

        // 연결된 사용자 수 구독
        stompClient.current?.subscribe('/topic/connected-users', (frame) => {
          console.log('👥 전체 연결된 사용자 수:', frame.body);
        });

        stompClient.current?.subscribe(
          '/user/queue/connected-users',
          (frame) => {
            console.log('👤 개인 연결된 사용자 수:', frame.body);
          }
        );

        // 필터 정보 구독
        stompClient.current?.subscribe('/user/queue/filters', (frame) => {
          console.log('🔍 필터 정보 수신:', frame.body);
          try {
            const data = JSON.parse(frame.body);
            console.log('📋 파싱된 필터 데이터:', data);
          } catch (error) {
            console.error('❌ 필터 JSON 파싱 오류:', error);
          }
        });

        // 매칭 알림 구독 (cardDto 전용)
        stompClient.current?.subscribe('/user/queue/matching', (frame) => {
          console.log('🟢 매칭 알림 수신:', frame.body);
          try {
            const msg = JSON.parse(frame.body);
            console.log('📋 매칭 카드 정보:', {
              id: msg.id,
              name: msg.name,
              email: msg.email,
              sellStatus: msg.sellStatus,
              cardCategory: msg.cardCategory,
              carrier: msg.carrier,
              dataAmount: msg.dataAmount,
              price: msg.price,
              createdAt: msg.createdAt,
              updatedAt: msg.updatedAt,
            });
          } catch (error) {
            console.error('❌ 매칭 큐 파싱 오류:', error);
          }
        });

        // 거래 알림 구독 (tradeDto 전용)
        stompClient.current?.subscribe('/user/queue/trade', (frame) => {
          console.log('🔔 거래 알림 수신:', frame.body);
          try {
            const msg = JSON.parse(frame.body);
            console.log('📋 거래 상태 변경:', {
              id: msg.id,
              cardId: msg.cardId,
              status: msg.status,
              seller: msg.seller,
              buyer: msg.buyer,
              carrier: msg.carrier,
              dataAmount: msg.dataAmount,
              priceGb: msg.priceGb,
              point: msg.point,
              phone: msg.phone,
              cancelReason: msg.cancelReason,
            });
          } catch (error) {
            console.error('❌ 거래 큐 파싱 오류:', error);
          }
        });

        // 에러 메시지 구독
        stompClient.current?.subscribe('/user/queue/errors', (frame) => {
          console.error('❗에러 메시지 수신:', frame.body);
        });

        // 거래 취소 알림 구독
        stompClient.current?.subscribe('/user/queue/cancel', (frame) => {
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
        stompClient.current?.publish({
          destination: '/app/connected-users',
          body: '',
        });
      },
      onStompError: (frame) => {
        console.error('❌ STOMP 오류:', frame);
        isConnected.current = false;
      },
    });

    stompClient.current.activate();
  };

  // 결제 메시지 전송
  const sendPayment = (tradeId: number, money: number, point: number) => {
    if (!stompClient.current?.connected) {
      console.error('❌ WebSocket이 연결되지 않았습니다.');
      return false;
    }

    console.log('💰 결제 메시지 전송:', { tradeId, money, point });

    stompClient.current.publish({
      destination: '/app/trade/payment',
      body: JSON.stringify({ tradeId, money, point }),
    });

    return true;
  };

  // 거래 확정 메시지 전송
  const sendTradeConfirm = (tradeId: number) => {
    if (!stompClient.current?.connected) {
      console.error('❌ WebSocket이 연결되지 않았습니다.');
      return false;
    }

    console.log('✅ 거래 확정 메시지 전송:', { tradeId });

    stompClient.current.publish({
      destination: '/app/trade/confirm',
      body: JSON.stringify({ tradeId }),
    });

    return true;
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
  }, []);

  return {
    isConnected: isConnected.current,
    sendPayment,
    sendTradeConfirm,
  };
}
