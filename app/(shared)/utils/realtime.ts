interface MatchingEventData {
  type:
    | 'match_found'
    | 'match_cancelled'
    | 'trading_update'
    | 'payment_completed'
    | 'transfer_status'
    | 'transaction_completed'
    | 'connection_failed'
    | 'trade_request'
    | 'trade_response'
    | 'seller_update';
  data: Record<string, unknown>;
}

interface MatchingEventListener {
  (event: MatchingEventData): void;
}

// Mock 모드 활성화 (서버 없이 테스트용)
const MOCK_MODE = true;

// Mock 데이터
const mockEvents = {
  trade_request: {
    id: 'req_123',
    buyerId: 'buyer_456',
    buyerName: 'user04',
    sellerId: 'user_123',
    status: 'pending',
    createdAt: new Date().toISOString(),
  },
  trade_response: {
    status: 'accepted',
    matchData: {
      partnerId: 'partner_789',
      partnerName: 'user07',
      carrier: 'KT',
      dataAmount: 2,
      price: 2000,
      rating: 4.9,
      transactionCount: 156,
    },
  },
  // 실시간으로 활성화된 판매자들 (실제로는 서버에서 가져옴)
  seller_update: [
    {
      id: 101,
      type: 'seller',
      name: '판매자A',
      carrier: 'SKT',
      data: 1.5,
      price: 1800,
      rating: 4.8,
      transactionCount: 89,
    },
    {
      id: 102,
      type: 'seller',
      name: '판매자B',
      carrier: 'KT',
      data: 2,
      price: 2200,
      rating: 4.9,
      transactionCount: 156,
    },
    {
      id: 103,
      type: 'seller',
      name: '판매자C',
      carrier: 'LG U+',
      data: 0.5,
      price: 1000,
      rating: 4.6,
      transactionCount: 34,
    },
    {
      id: 104,
      type: 'seller',
      name: '새로운판매자',
      carrier: 'SKT',
      data: 3,
      price: 2500,
      rating: 4.7,
      transactionCount: 67,
    },
  ],
};

class RealTimeMatchingService {
  private eventSource: EventSource | null = null;
  private listeners: Map<string, MatchingEventListener[]> = new Map();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000; // 1초

  // SSE 연결 시작
  connect(userId: string, transactionId?: string): void {
    if (MOCK_MODE) {
      return;
    }

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
    if (MOCK_MODE) {
      return;
    }

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
    if (MOCK_MODE) return;

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

  // Mock 이벤트 발생 함수들 (테스트용)
  triggerMockTradeRequest(): void {
    console.log('🔧 Mock: 거래 요청 이벤트 발생');
    this.notifyListeners('trade_request', {
      type: 'trade_request',
      data: mockEvents.trade_request,
    });
  }

  triggerMockTradeResponse(accept: boolean = true): void {
    const responseData = accept
      ? mockEvents.trade_response
      : {
          status: 'rejected',
          message: '거래가 거부되었습니다.',
        };

    console.log('🔧 Mock: 거래 응답 이벤트 발생', responseData);
    this.notifyListeners('trade_response', {
      type: 'trade_response',
      data: responseData,
    });
  }

  triggerMockSellerUpdate(): void {
    // 매번 다른 판매자들을 보여주기 위해 랜덤하게 일부만 선택
    const allSellers = mockEvents.seller_update;
    const randomCount = Math.floor(Math.random() * allSellers.length) + 1;
    const randomSellers = allSellers
      .sort(() => 0.5 - Math.random())
      .slice(0, randomCount);

    console.log('🔧 Mock: 판매자 업데이트 이벤트 발생', randomSellers);
    this.notifyListeners('seller_update', {
      type: 'seller_update',
      data: randomSellers as unknown as Record<string, unknown>,
    });
  }

  // 매칭 요청 전송 (Mock 모드)
  async startMatching(
    filters: Record<string, unknown>
  ): Promise<{ success: boolean; message?: string }> {
    if (MOCK_MODE) {
      console.log('🔧 Mock: 매칭 요청 시뮬레이션', filters);
      return { success: true, message: 'Mock 매칭 요청 성공' };
    }

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

  // 매칭 취소 (Mock 모드)
  async cancelMatching(
    transactionId: string
  ): Promise<{ success: boolean; message?: string }> {
    if (MOCK_MODE) {
      console.log('🔧 Mock: 매칭 취소 시뮬레이션', transactionId);
      return { success: true, message: 'Mock 매칭 취소 성공' };
    }

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

  // 거래 상태 업데이트 (Mock 모드)
  async updateTradingStatus(
    transactionId: string,
    status: string,
    data?: Record<string, unknown>
  ): Promise<{ success: boolean; message?: string }> {
    if (MOCK_MODE) {
      console.log('🔧 Mock: 거래 상태 업데이트 시뮬레이션', {
        transactionId,
        status,
        data,
      });
      return { success: true, message: 'Mock 거래 상태 업데이트 성공' };
    }

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

  // Mock 테스트 함수들
  const triggerMockTradeRequest = () => {
    realtimeService.triggerMockTradeRequest();
  };

  const triggerMockTradeResponse = (accept: boolean = true) => {
    realtimeService.triggerMockTradeResponse(accept);
  };

  const triggerMockSellerUpdate = () => {
    realtimeService.triggerMockSellerUpdate();
  };

  return {
    connect,
    disconnect,
    addEventListener,
    removeEventListener,
    startMatching,
    cancelMatching,
    updateTradingStatus,
    // Mock 테스트 함수들
    triggerMockTradeRequest,
    triggerMockTradeResponse,
    triggerMockSellerUpdate,
  };
}
