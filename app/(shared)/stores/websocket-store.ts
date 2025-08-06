import { create } from 'zustand';

interface WebSocketStore {
  isConnected: boolean;
  connectedUsers: number;
  disconnectFunction: (() => void) | null;
  disconnect: () => void;
  setConnectionStatus: (status: boolean) => void;
  setConnectedUsers: (count: number) => void;
  setDisconnectFunction: (fn: () => void) => void;
}

export const useWebSocketStore = create<WebSocketStore>((set, get) => ({
  isConnected: false,
  connectedUsers: 0,
  disconnectFunction: null as (() => void) | null,
  disconnect: () => {
    const { disconnectFunction } = get();
    if (disconnectFunction) {
      disconnectFunction(); // 실제 WebSocket 연결 해제 함수 호출
    }
    set({ isConnected: false });
  },
  setConnectionStatus: (status: boolean) => {
    set({ isConnected: status });
  },
  setConnectedUsers: (count: number) => {
    set({ connectedUsers: count });
  },
  setDisconnectFunction: (fn: () => void) => {
    set({ disconnectFunction: fn });
  },
}));
