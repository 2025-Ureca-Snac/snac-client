interface MatchingEventData {
  type:
    | 'match_found'
    | 'match_cancelled'
    | 'trading_update'
    | 'payment_completed'
    | 'transfer_status'
    | 'transaction_completed'
    | 'connection_failed';
  data: Record<string, unknown>;
}

interface MatchingEventListener {
  (event: MatchingEventData): void;
}

class RealTimeMatchingService {
  private eventSource: EventSource | null = null;
  private listeners: Map<string, MatchingEventListener[]> = new Map();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000; // 1초

  // SSE 연결 시작
  connect(userId: string, transactionId?: string): void {
    if (this.eventSource) {
      this.disconnect();
    }

    // SSE 엔드포인트 (실제 서버 구현 필요)
    const url = `/api/matching/events?userId=${userId}${transactionId ? `&transactionId=${transactionId}` : ''}`;

    try {
      this.eventSource = new EventSource(url);

      this.eventSource.onopen = () => {
        console.log('실시간 매칭 연결 성공');
        this.reconnectAttempts = 0;
      };

      this.eventSource.onmessage = (event) => {
        try {
          const data: MatchingEventData = JSON.parse(event.data);
          this.notifyListeners(data.type, data);
        } catch (error) {
          console.error('메시지 파싱 오류:', error);
        }
      };

      this.eventSource.onerror = (error) => {
        console.error('SSE 연결 오류:', error);
        this.handleReconnect(userId, transactionId);
      };
    } catch (error) {
      console.error('SSE 연결 실패:', error);
      this.handleReconnect(userId, transactionId);
    }
  }

  // 연결 종료
  disconnect(): void {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }
    this.listeners.clear();
    this.reconnectAttempts = 0;
  }

  // 이벤트 리스너 등록
  addEventListener(eventType: string, listener: MatchingEventListener): void {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, []);
    }
    this.listeners.get(eventType)!.push(listener);
  }

  // 이벤트 리스너 제거
  removeEventListener(
    eventType: string,
    listener: MatchingEventListener
  ): void {
    const listeners = this.listeners.get(eventType);
    if (listeners) {
      const index = listeners.indexOf(listener);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }

  // 재연결 처리
  private handleReconnect(userId: string, transactionId?: string): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(
        `재연결 시도 ${this.reconnectAttempts}/${this.maxReconnectAttempts}`
      );

      setTimeout(() => {
        this.connect(userId, transactionId);
      }, this.reconnectDelay * this.reconnectAttempts);
    } else {
      console.error('최대 재연결 시도 초과');
      this.notifyListeners('connection_failed', {
        type: 'connection_failed',
        data: { message: '서버 연결에 실패했습니다.' },
      });
    }
  }

  // 리스너들에게 이벤트 알림
  private notifyListeners(eventType: string, data: MatchingEventData): void {
    const listeners = this.listeners.get(eventType);
    if (listeners) {
      listeners.forEach((listener) => {
        try {
          listener(data);
        } catch (error) {
          console.error('이벤트 리스너 실행 오류:', error);
        }
      });
    }
  }

  // 매칭 요청 전송 (실제로는 HTTP API 호출)
  async startMatching(
    filters: Record<string, unknown>
  ): Promise<{ success: boolean; message?: string }> {
    try {
      const response = await fetch('/api/matching/start', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ filters }),
      });

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('매칭 요청 실패:', error);
      return { success: false, message: '매칭 요청에 실패했습니다.' };
    }
  }

  // 매칭 취소
  async cancelMatching(
    transactionId: string
  ): Promise<{ success: boolean; message?: string }> {
    try {
      const response = await fetch('/api/matching/cancel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ transactionId }),
      });

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('매칭 취소 실패:', error);
      return { success: false, message: '매칭 취소에 실패했습니다.' };
    }
  }

  // 거래 상태 업데이트
  async updateTradingStatus(
    transactionId: string,
    status: string,
    data?: Record<string, unknown>
  ): Promise<{ success: boolean; message?: string }> {
    try {
      const response = await fetch('/api/trading/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ transactionId, status, data }),
      });

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('거래 상태 업데이트 실패:', error);
      return { success: false, message: '거래 상태 업데이트에 실패했습니다.' };
    }
  }
}

// 싱글톤 인스턴스
export const realtimeService = new RealTimeMatchingService();

// React Hook으로 사용하기 쉽게 래핑
export function useRealTimeMatching() {
  const connect = (userId: string, transactionId?: string) => {
    realtimeService.connect(userId, transactionId);
  };

  const disconnect = () => {
    realtimeService.disconnect();
  };

  const addEventListener = (
    eventType: string,
    listener: MatchingEventListener
  ) => {
    realtimeService.addEventListener(eventType, listener);
  };

  const removeEventListener = (
    eventType: string,
    listener: MatchingEventListener
  ) => {
    realtimeService.removeEventListener(eventType, listener);
  };

  const startMatching = (filters: Record<string, unknown>) => {
    return realtimeService.startMatching(filters);
  };

  const cancelMatching = (transactionId: string) => {
    return realtimeService.cancelMatching(transactionId);
  };

  const updateTradingStatus = (
    transactionId: string,
    status: string,
    data?: Record<string, unknown>
  ) => {
    return realtimeService.updateTradingStatus(transactionId, status, data);
  };

  return {
    connect,
    disconnect,
    addEventListener,
    removeEventListener,
    startMatching,
    cancelMatching,
    updateTradingStatus,
  };
}
