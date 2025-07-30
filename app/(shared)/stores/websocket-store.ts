import { create } from 'zustand';

interface WebSocketStore {
  isConnected: boolean;
  disconnectFunction: (() => void) | null;
  disconnect: () => void;
  setConnectionStatus: (status: boolean) => void;
  setDisconnectFunction: (fn: () => void) => void;
}

export const useWebSocketStore = create<WebSocketStore>((set, get) => ({
  isConnected: false,
  disconnectFunction: null as (() => void) | null,
  disconnect: () => {
    console.log('🔌 WebSocket 연결 해제');
    const { disconnectFunction } = get();
    if (disconnectFunction) {
      disconnectFunction(); // 실제 WebSocket 연결 해제 함수 호출
    }
    set({ isConnected: false });
  },
  setConnectionStatus: (status: boolean) => {
    set({ isConnected: status });
  },
  setDisconnectFunction: (fn: () => void) => {
    set({ disconnectFunction: fn });
  },
}));
