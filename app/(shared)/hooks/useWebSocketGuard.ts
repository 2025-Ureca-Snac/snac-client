import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useWebSocketStore } from '../stores/websocket-store';

export const useWebSocketGuard = () => {
  const { isConnected, disconnect } = useWebSocketStore();
  const pathname = usePathname();

  useEffect(() => {
    const allowedRoutes = ['/match', '/match/trading'];
    const isAllowedRoute = allowedRoutes.some((route) =>
      pathname.startsWith(route)
    );

    if (!isAllowedRoute && isConnected) {
      console.log('🚫 허용되지 않은 라우트 - WebSocket 연결 해제');
      disconnect();
    }
  }, [pathname, isConnected, disconnect]);
};
