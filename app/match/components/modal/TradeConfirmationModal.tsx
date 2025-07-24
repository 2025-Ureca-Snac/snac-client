'use client';

import React, { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { User } from '../../types/match';

// Lottie Player를 동적으로 import (SSR 문제 방지)
const Lottie = dynamic(() => import('react-lottie-player'), { ssr: false });

interface TradeConfirmationModalProps {
  isOpen: boolean;
  seller: User | null;
  onConfirm: () => void;
  onCancel: () => void;
  createTrade: (cardId: number) => void;
  tradeStatus: string | null;
}

// 모달 상태 타입
type ModalState = 'confirm' | 'waiting' | 'success' | 'timeout';

export default function TradeConfirmationModal({
  isOpen,
  seller,
  onConfirm,
  onCancel,
  createTrade,
  tradeStatus,
}: TradeConfirmationModalProps) {
  const [modalState, setModalState] = useState<ModalState>('confirm');
  const [timeLeft, setTimeLeft] = useState(3);
  const [canCancel, setCanCancel] = useState(false);
  const [animationData, setAnimationData] = useState(null);

  // modalState를 ref로 관리하여 클로저 문제 해결
  const modalStateRef = useRef<ModalState>(modalState);

  // modalState가 변경될 때마다 ref 업데이트
  useEffect(() => {
    modalStateRef.current = modalState;
  }, [modalState]);

  // Lottie 애니메이션 데이터 로드
  useEffect(() => {
    fetch('/searching-lotties.json')
      .then((response) => response.json())
      .then((data) => setAnimationData(data))
      .catch((error) => {
        console.error('Lottie 애니메이션 로드 실패:', error);
      });
  }, []);

  // 모달이 열릴 때마다 상태 초기화
  useEffect(() => {
    if (isOpen) {
      setModalState('confirm');
      setTimeLeft(3);
      setCanCancel(false);
    }
  }, [isOpen]);

  // 거래 상태 변경 감지
  useEffect(() => {
    if (tradeStatus === 'ACCEPTED') {
      setModalState('success');
      // 2초 후 onConfirm 호출
      setTimeout(() => {
        onConfirm();
      }, 2000);
    } else if (tradeStatus === 'REJECTED' || tradeStatus === 'CANCELLED') {
      setModalState('timeout');
    }
  }, [tradeStatus, onConfirm]);

  // 대기 상태에서 타이머 관리 (취소 버튼 활성화용)
  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (modalState === 'waiting' && timeLeft > 0) {
      timer = setTimeout(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (modalState === 'waiting' && timeLeft === 0) {
      setCanCancel(true);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [modalState, timeLeft]);

  if (!isOpen || !seller) return null;

  // 거래 시작 핸들러
  const handleStartTrade = () => {
    setModalState('waiting');
    setTimeLeft(3);
    setCanCancel(false);

    const cardId = seller.cardId || seller.id; // cardId 우선, 없으면 id 사용

    console.log('🔥 거래 요청 발송:', {
      cardId: cardId,
      buyerId: 'user_123',
      sellerId: seller.id,
      sellerName: seller.name,
      dataAmount: seller.data,
      price: seller.price,
    });

    // 실제 서버에 거래 생성 요청 (HTML 예제와 동일)
    createTrade(cardId);

    // 서버 응답 타임아웃 (30초)
    setTimeout(() => {
      if (modalStateRef.current === 'waiting') {
        console.log('⏰ 거래 요청 타임아웃');
        setModalState('timeout');
      }
    }, 30000); // 30초 타임아웃
  };

  // 거래 취소 핸들러
  const handleCancelTrade = () => {
    if (canCancel) {
      setModalState('confirm');
      setTimeLeft(3);
      setCanCancel(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* 배경 오버레이 */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={modalState === 'confirm' ? onCancel : undefined}
      />

      {/* 모달 컨텐츠 */}
      <div className="relative bg-gradient-to-b from-green-900 to-black text-white rounded-lg p-8 mx-4 max-w-md w-full">
        {/* 뒤로가기 버튼 (확인 상태에서만 표시) */}
        {modalState === 'confirm' && (
          <button
            onClick={onCancel}
            className="absolute top-4 left-4 text-white/70 hover:text-white flex items-center space-x-2"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            <span>뒤로가기</span>
          </button>
        )}

        {/* 거래 확인 상태 */}
        {modalState === 'confirm' && (
          <ConfirmationContent
            seller={seller}
            onStartTrade={handleStartTrade}
          />
        )}

        {/* 상대방 응답 대기 상태 */}
        {modalState === 'waiting' && (
          <WaitingContent
            seller={seller}
            timeLeft={timeLeft}
            canCancel={canCancel}
            animationData={animationData}
            onCancel={handleCancelTrade}
          />
        )}

        {/* 매칭 성공 상태 */}
        {modalState === 'success' && <SuccessContent seller={seller} />}

        {/* 타임아웃/거부 상태 */}
        {modalState === 'timeout' && (
          <TimeoutContent
            seller={seller}
            onRetry={handleStartTrade}
            onCancel={onCancel}
          />
        )}
      </div>
    </div>
  );
}

// 거래 확인 컨텐츠
function ConfirmationContent({
  seller,
  onStartTrade,
}: {
  seller: User;
  onStartTrade: () => void;
}) {
  return (
    <div className="text-center mt-8">
      <h2 className="text-2xl font-bold mb-6">
        {seller.carrier} / {seller.data}GB / {seller.price.toLocaleString()}원을
        구매합니다.
      </h2>

      <p className="text-lg mb-8">
        {seller.name}님과 실시간 거래를 시작합니다.
      </p>

      {/* 주의사항 */}
      <div className="text-sm text-gray-300 mb-8 space-y-1">
        <p>*상대방의 응답을 실시간으로 기다리며 거래 시간은 약 3-5분입니다.</p>
        <p>*거래 중에 이탈할 경우 제재를 받을 수 있습니다.</p>
      </div>

      {/* 시작하기 버튼 */}
      <button
        onClick={onStartTrade}
        className="w-full bg-green-500 hover:bg-green-600 text-white py-3 px-6 rounded-lg font-medium transition-colors"
      >
        시작하기
      </button>
    </div>
  );
}

// 상대방 응답 대기 컨텐츠
function WaitingContent({
  seller,
  timeLeft,
  canCancel,
  animationData,
  onCancel,
}: {
  seller: User;
  timeLeft: number;
  canCancel: boolean;
  animationData: unknown;
  onCancel: () => void;
}) {
  return (
    <div className="text-center mt-4">
      {/* 로딩 애니메이션 */}
      <div className="mb-6 flex justify-center">
        {animationData ? (
          <div className="w-16 h-16">
            <Lottie
              loop
              animationData={animationData}
              play
              style={{ width: 64, height: 64 }}
            />
          </div>
        ) : (
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-400"></div>
        )}
      </div>

      <h2 className="text-xl font-bold mb-4">
        {seller.name}님의 응답을 기다리는 중...
      </h2>

      <div className="text-sm text-gray-300 mb-6">
        <p>
          {seller.carrier} / {seller.data}GB / {seller.price.toLocaleString()}원
        </p>
      </div>

      {/* 취소 버튼 활성화까지 남은 시간 표시 */}
      {!canCancel && (
        <div className="mb-6">
          <div className="text-2xl font-bold text-yellow-400 mb-2">
            {timeLeft}초
          </div>
          <div className="text-sm text-gray-300">
            취소 버튼 활성화까지 남은 시간
          </div>
        </div>
      )}

      {canCancel && (
        <div className="mb-6">
          <div className="text-sm text-gray-300">
            상대방의 응답을 기다리고 있습니다
          </div>
        </div>
      )}

      {/* 취소 버튼 */}
      <button
        onClick={onCancel}
        disabled={!canCancel}
        className={`w-full py-3 px-6 rounded-lg font-medium transition-colors ${
          canCancel
            ? 'bg-gray-600 hover:bg-gray-700 text-white cursor-pointer'
            : 'bg-gray-800 text-gray-500 cursor-not-allowed'
        }`}
      >
        {canCancel ? '거래 요청 취소' : `취소 불가 (${timeLeft}초 후 가능)`}
      </button>
    </div>
  );
}

// 매칭 성공 컨텐츠 (기존 MatchSuccessPanel과 유사)
function SuccessContent({ seller }: { seller: User }) {
  return (
    <div className="text-center mt-4">
      {/* 성공 애니메이션 */}
      <div className="mb-6">
        <div className="animate-bounce mb-4">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto">
            <span className="text-2xl">🎉</span>
          </div>
        </div>
      </div>

      <h2 className="text-xl font-bold mb-4 text-green-400">매칭 완료!</h2>

      <div className="text-sm text-gray-300 mb-6">
        <p>{seller.name}님이 거래를 수락했습니다</p>
        <p>
          {seller.carrier} / {seller.data}GB / {seller.price.toLocaleString()}원
        </p>
      </div>

      <div className="text-green-300 text-sm">거래 페이지로 이동합니다...</div>

      {/* 로딩 표시 */}
      <div className="mt-4 flex justify-center">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-400"></div>
      </div>
    </div>
  );
}

// 타임아웃/거부 컨텐츠
function TimeoutContent({
  seller,
  onRetry,
  onCancel,
}: {
  seller: User;
  onRetry: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="text-center mt-4">
      {/* 실패 아이콘 */}
      <div className="mb-6">
        <div className="w-16 h-16 mx-auto rounded-full bg-red-500/20 flex items-center justify-center">
          <svg
            className="w-8 h-8 text-red-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>
      </div>

      <h2 className="text-xl font-bold mb-4 text-red-400">
        거래 요청이 처리되지 않았습니다
      </h2>

      <div className="text-sm text-gray-300 mb-6">
        <p>{seller.name}님이 응답하지 않았거나</p>
        <p>거래를 거부했습니다.</p>
      </div>

      {/* 버튼들 */}
      <div className="space-y-3">
        <button
          onClick={onRetry}
          className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg font-medium transition-colors"
        >
          다시 시도하기
        </button>
        <button
          onClick={onCancel}
          className="w-full bg-gray-600 hover:bg-gray-700 text-white py-3 px-6 rounded-lg font-medium transition-colors"
        >
          다른 판매자 찾기
        </button>
      </div>
    </div>
  );
}
