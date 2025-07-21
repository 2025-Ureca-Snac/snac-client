'use client';

import React, { useState, useRef, useEffect } from 'react';
import { testTokenManager } from '../utils/tokenManager';

// SockJS와 STOMP 타입 정의
declare global {
  interface Window {
    SockJS: unknown;
    StompJs: unknown;
  }
}

interface SocketManagementProps {
  loading: boolean;
  setResponse: (response: string) => void;
}

interface NotificationMessage {
  type: string;
  sender: string;
  tradeId: number;
  message?: string;
}

export default function SocketManagement({
  loading,
  setResponse,
}: SocketManagementProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [token, setToken] = useState('');
  const [cardId, setCardId] = useState(1);
  const [tradeSide, setTradeSide] = useState<'BUY' | 'SELL'>('BUY');
  const [tradeIdAccept, setTradeIdAccept] = useState('');
  const [notifications, setNotifications] = useState<NotificationMessage[]>([]);
  const stompClientRef = useRef<unknown>(null);

  // 컴포넌트 마운트 시 토큰 가져오기
  useEffect(() => {
    const savedToken = testTokenManager.getToken();
    if (savedToken) {
      setToken(savedToken);
    }
  }, []);

  // 라이브러리 로드
  useEffect(() => {
    const loadLibraries = () => {
      // SockJS 로드
      if (!window.SockJS) {
        const sockjsScript = document.createElement('script');
        sockjsScript.src =
          'https://cdn.jsdelivr.net/npm/sockjs-client@1/dist/sockjs.min.js';
        sockjsScript.onload = () => {
          // STOMP 로드
          if (!window.StompJs) {
            const stompScript = document.createElement('script');
            stompScript.src =
              'https://cdn.jsdelivr.net/npm/@stomp/stompjs@7.0.0/bundles/stomp.umd.min.js';
            document.head.appendChild(stompScript);
          }
        };
        document.head.appendChild(sockjsScript);
      }
    };

    loadLibraries();
  }, []);

  const handleConnect = () => {
    if (!token.trim()) {
      setResponse('토큰을 입력하세요.');
      return;
    }

    if (!window.SockJS || !window.StompJs) {
      setResponse(
        '라이브러리가 아직 로드되지 않았습니다. 잠시 후 다시 시도해주세요.'
      );
      return;
    }

    try {
      const StompClient = (
        window.StompJs as { Client: new (config: unknown) => unknown }
      ).Client;
      const SockJSConstructor = window.SockJS as new (url: string) => unknown;

      const client = new StompClient({
        webSocketFactory: () =>
          new SockJSConstructor('https://api.snac-app.com/ws'),
        connectHeaders: {
          Authorization: 'Bearer ' + token,
        },
        debug: (str: string) => console.log('STOMP Debug:', str),
        onConnect: () => {
          setIsConnected(true);
          setResponse('✅ WebSocket 연결 성공!');

          // 알림 구독
          const clientWithSubscribe = client as {
            subscribe: (
              destination: string,
              callback: (frame: { body: string }) => void
            ) => void;
          };
          clientWithSubscribe.subscribe(
            '/user/queue/notifications',
            (frame: { body: string }) => {
              try {
                const notification: NotificationMessage = JSON.parse(
                  frame.body
                );
                setNotifications((prev) => [...prev, notification]);
                setResponse(
                  `🔔 새 알림: [${notification.type}] from:${notification.sender} tradeId:${notification.tradeId}`
                );
              } catch (error) {
                console.error('알림 파싱 오류:', error);
              }
            }
          );
        },
        onStompError: (frame: { headers?: { message?: string } }) => {
          console.error('STOMP 오류:', frame);
          setIsConnected(false);
          setResponse(
            '❌ STOMP 연결 오류: ' + frame.headers?.message || '알 수 없는 오류'
          );
        },
        onDisconnect: () => {
          setIsConnected(false);
          setResponse('WebSocket 연결이 해제되었습니다.');
        },
      });

      stompClientRef.current = client;
      (client as { activate: () => void }).activate();
    } catch (error) {
      console.error('연결 오류:', error);
      setResponse('연결 중 오류가 발생했습니다: ' + String(error));
    }
  };

  const handleDisconnect = () => {
    if (stompClientRef.current) {
      (stompClientRef.current as { deactivate: () => void }).deactivate();
      stompClientRef.current = null;
      setIsConnected(false);
      setResponse('WebSocket 연결을 해제했습니다.');
    }
  };

  const apiPost = async (path: string, body: Record<string, unknown>) => {
    try {
      const response = await fetch(`https://api.snac-app.com/api${path}`, {
        method: 'POST',
        headers: {
          Authorization: 'Bearer ' + token,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error(`${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  };

  const handleTradeRequest = async () => {
    try {
      const data = await apiPost(`/trades/${tradeSide}`, { cardId });
      setResponse(
        `${tradeSide} 거래 요청 성공:\n${JSON.stringify(data, null, 2)}`
      );
    } catch (error) {
      setResponse(`${tradeSide} 거래 요청 실패: ${String(error)}`);
    }
  };

  const handleAcceptTrade = async () => {
    if (!tradeIdAccept.trim()) {
      setResponse('거래 ID를 입력하세요.');
      return;
    }

    try {
      const data = await apiPost('/trades/accept', {
        tradeId: parseInt(tradeIdAccept),
      });
      setResponse(`거래 수락 성공:\n${JSON.stringify(data, null, 2)}`);
    } catch (error) {
      setResponse(`거래 수락 실패: ${String(error)}`);
    }
  };

  const clearNotifications = () => {
    setNotifications([]);
    setResponse('알림 목록을 초기화했습니다.');
  };

  return (
    <div className="space-y-6">
      {/* WebSocket 연결 섹션 */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-4">1) WebSocket 연결</h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              JWT 토큰
            </label>
            <div className="flex space-x-2">
              <input
                type="text"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="JWT 토큰을 입력하세요"
              />
              <button
                onClick={() => {
                  const savedToken = testTokenManager.getToken();
                  if (savedToken) {
                    setToken(savedToken);
                    setResponse('저장된 토큰을 불러왔습니다.');
                  } else {
                    setResponse('저장된 토큰이 없습니다.');
                  }
                }}
                className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
              >
                저장된 토큰 사용
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                isConnected
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}
            >
              {isConnected ? '✅ 연결됨' : '❌ 미연결'}
            </span>

            <div className="flex space-x-2">
              <button
                onClick={handleConnect}
                disabled={loading || isConnected}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                연결
              </button>

              <button
                onClick={handleDisconnect}
                disabled={loading || !isConnected}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                연결해제
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 거래 요청 섹션 */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-4">
          2) 거래 요청 (Side 테스트)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              카드 ID
            </label>
            <input
              type="number"
              value={cardId}
              onChange={(e) => setCardId(parseInt(e.target.value) || 1)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              거래 타입
            </label>
            <select
              value={tradeSide}
              onChange={(e) => setTradeSide(e.target.value as 'BUY' | 'SELL')}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="BUY">BUY (구매)</option>
              <option value="SELL">SELL (판매)</option>
            </select>
          </div>

          <div>
            <button
              onClick={handleTradeRequest}
              disabled={loading || !token}
              className="w-full px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              거래 요청
            </button>
          </div>
        </div>
      </div>

      {/* 거래 수락 섹션 */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-4">3) 거래 수락 요청</h3>

        <div className="flex space-x-4 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              거래 ID
            </label>
            <input
              type="number"
              value={tradeIdAccept}
              onChange={(e) => setTradeIdAccept(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="수락할 거래 ID를 입력하세요"
            />
          </div>

          <button
            onClick={handleAcceptTrade}
            disabled={loading || !token || !tradeIdAccept.trim()}
            className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            수락 요청
          </button>
        </div>
      </div>

      {/* 알림 목록 섹션 */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">4) 받은 알림 목록</h3>
          <button
            onClick={clearNotifications}
            className="px-3 py-1 text-sm bg-gray-500 text-white rounded-md hover:bg-gray-600"
          >
            목록 지우기
          </button>
        </div>

        <div className="space-y-2 max-h-60 overflow-y-auto">
          {notifications.length === 0 ? (
            <p className="text-gray-500 text-sm">받은 알림이 없습니다.</p>
          ) : (
            notifications.map((notification, index) => (
              <div
                key={index}
                className="bg-white p-3 rounded border border-gray-200"
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-blue-600">
                    [{notification.type}]
                  </span>
                  <span className="text-xs text-gray-500">#{index + 1}</span>
                </div>
                <div className="text-sm text-gray-700 mt-1">
                  <p>보낸이: {notification.sender}</p>
                  <p>거래 ID: {notification.tradeId}</p>
                  {notification.message && (
                    <p>메시지: {notification.message}</p>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
