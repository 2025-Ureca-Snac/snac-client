'use client';

import { useEffect, Dispatch, SetStateAction } from 'react';
import { useRouter } from 'next/navigation';
import { useRealTimeMatching } from '@/app/(shared)/utils/realtime';
import { useMatchStore } from '@/app/(shared)/stores/match-store';
import { User, Filters } from '../types';
import { TradeRequest } from '../types/match';

type MatchingStatus = 'idle' | 'requesting' | 'requested' | 'matched';

interface UseMatchingEventsProps {
  userRole: 'buyer' | 'seller' | null;
  appliedFilters: Filters;
  setIncomingRequests: Dispatch<SetStateAction<TradeRequest[]>>;
  setActiveSellers: Dispatch<SetStateAction<User[]>>;
  setMatchingStatus: Dispatch<SetStateAction<MatchingStatus>>;
}

export function useMatchingEvents({
  userRole,
  appliedFilters,
  setIncomingRequests,
  setActiveSellers,
  setMatchingStatus,
}: UseMatchingEventsProps) {
  const router = useRouter();
  const { foundMatch } = useMatchStore();
  const {
    connect,
    disconnect,
    addEventListener,
    removeEventListener,
    triggerMockSellerUpdate,
  } = useRealTimeMatching();

  useEffect(() => {
    const userId = 'user_123';
    connect(userId);

    // 거래 요청 처리
    const handleTradeRequest = (event: { data: Record<string, unknown> }) => {
      const request = event.data as unknown as TradeRequest;
      if (userRole === 'seller') {
        setIncomingRequests((prev) => [...prev, request]);
      }
    };

    // 거래 응답 처리
    const handleTradeResponse = (event: { data: Record<string, unknown> }) => {
      const { status, matchData } = event.data as {
        status: string;
        matchData: Record<string, unknown>;
      };

      if (status === 'accepted') {
        setMatchingStatus('matched');
        foundMatch({
          id: String(matchData.partnerId || ''),
          name: String(matchData.partnerName || ''),
          carrier: String(matchData.carrier || 'SKT'),
          data: Number(matchData.dataAmount || 1),
          price: Number(matchData.price || 0),
          rating: Number(matchData.rating || 4.5),
          transactionCount: Number(matchData.transactionCount || 0),
          type: userRole === 'seller' ? 'buyer' : 'seller',
        });
        setTimeout(() => router.push('/match/trading'), 1000);
      } else if (status === 'rejected') {
        setMatchingStatus('idle');
        alert('거래 요청이 거부되었습니다.');
      }
    };

    // 판매자 목록 업데이트 처리
    const handleSellerUpdate = (event: { data: Record<string, unknown> }) => {
      const updatedSellers = event.data as unknown as User[];
      console.log('📥 구매자: 새로운 판매자 목록 받음', updatedSellers);
      setActiveSellers(updatedSellers);

      if (userRole === 'buyer') {
        alert('새로운 판매자가 등록되었습니다! 목록을 확인해보세요.');
      }
    };

    // 이벤트 리스너 등록
    addEventListener('trade_request', handleTradeRequest);
    addEventListener('trade_response', handleTradeResponse);
    addEventListener('seller_update', handleSellerUpdate);

    // 구매자 모드 자동 업데이트 설정
    let intervalId: NodeJS.Timeout;
    if (userRole === 'buyer' && appliedFilters.transactionType.length > 0) {
      console.log('🔄 구매자 모드: 자동 판매자 목록 업데이트 시작');
      intervalId = setInterval(() => {
        console.log('🔄 자동으로 판매자 목록 업데이트 중...');
        triggerMockSellerUpdate();
      }, 30000);
    }

    // 클린업
    return () => {
      removeEventListener('trade_request', handleTradeRequest);
      removeEventListener('trade_response', handleTradeResponse);
      removeEventListener('seller_update', handleSellerUpdate);
      disconnect();

      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [
    userRole,
    appliedFilters.transactionType,
    connect,
    disconnect,
    addEventListener,
    removeEventListener,
    triggerMockSellerUpdate,
    foundMatch,
    router,
    setIncomingRequests,
    setActiveSellers,
    setMatchingStatus,
  ]);
}
