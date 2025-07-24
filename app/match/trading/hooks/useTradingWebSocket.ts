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
