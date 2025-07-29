import { create } from 'zustand';

interface WebSocketStore {
  isConnected: boolean;
  disconnect: () => void;
  setConnectionStatus: (status: boolean) => void;
}

export const useWebSocketStore = create<WebSocketStore>((set) => ({
  isConnected: false,
  disconnect: () => {
    console.log('🔌 WebSocket 연결 해제');
    set({ isConnected: false });
  },
  setConnectionStatus: (status: boolean) => {
    set({ isConnected: status });
  },
}));
