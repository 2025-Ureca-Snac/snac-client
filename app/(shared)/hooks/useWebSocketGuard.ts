import { useEffect } from 'react';
import { useWebSocketStore } from '../stores/websocket-store';

export const useWebSocketGuard = () => {
  const { isConnected, disconnect } = useWebSocketStore();

  useEffect(() => {
    // 현재 페이지가 허용된 라우트인지 확인
    const currentPath = window.location.pathname;
    const allowedRoutes = ['/match', '/match/trading'];
    const isAllowedRoute = allowedRoutes.some((route) =>
      currentPath.startsWith(route)
    );

    console.log(
      '🔍 현재 경로:',
      currentPath,
      '허용됨:',
      isAllowedRoute,
      '연결됨:',
      isConnected
    );

    // 허용되지 않은 라우트이고 WebSocket이 연결되어 있으면 해제
    if (!isAllowedRoute && isConnected) {
      console.log('🚫 허용되지 않은 라우트 - WebSocket 연결 해제');
      disconnect();
    }
  }, [isConnected, disconnect]);
};
