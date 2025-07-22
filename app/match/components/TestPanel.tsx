'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

interface TestPanelProps {
  userRole: 'buyer' | 'seller' | null;
  onTriggerMockTradeRequest: () => void;
  onTriggerMockSellerUpdate: () => void;
  onTriggerMockTradeResponse: (accept: boolean) => void;
}

export default function TestPanel({
  userRole,
  onTriggerMockTradeRequest,
  onTriggerMockSellerUpdate,
  onTriggerMockTradeResponse,
}: TestPanelProps) {
  const router = useRouter();

  // 개발 모드가 아니면 표시하지 않음
  if (process.env.NODE_ENV !== 'development') return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
        <h4 className="text-white text-sm font-medium mb-3">🔧 테스트 패널</h4>

        <div className="text-xs text-gray-300 mb-3">
          현재 모드: {getUserRoleDisplay(userRole)}
        </div>

        <div className="space-y-2">
          {/* 구매자 전용 테스트 */}
          {userRole === 'buyer' && (
            <BuyerTestButtons
              onTriggerMockSellerUpdate={onTriggerMockSellerUpdate}
            />
          )}

          {/* 판매자 전용 테스트 */}
          {userRole === 'seller' && (
            <SellerTestButtons
              onTriggerMockTradeRequest={onTriggerMockTradeRequest}
            />
          )}

          {/* 공통 테스트 */}
          <CommonTestButtons
            onTriggerMockTradeResponse={onTriggerMockTradeResponse}
          />

          {/* 페이지 이동 */}
          <NavigationButtons router={router} />
        </div>
      </div>
    </div>
  );
}

// 사용자 역할 표시
function getUserRoleDisplay(userRole: 'buyer' | 'seller' | null): string {
  switch (userRole) {
    case 'buyer':
      return '🛒 구매자';
    case 'seller':
      return '💰 판매자';
    default:
      return '❓ 미설정';
  }
}

// 구매자 전용 테스트 버튼들
function BuyerTestButtons({
  onTriggerMockSellerUpdate,
}: {
  onTriggerMockSellerUpdate: () => void;
}) {
  return (
    <>
      <button
        onClick={onTriggerMockSellerUpdate}
        className="block w-full bg-purple-600 text-white px-3 py-2 rounded text-xs hover:bg-purple-700"
      >
        📡 판매자 목록 새로고침
      </button>
      <div className="text-xs text-gray-400">새로운 판매자 확인</div>
    </>
  );
}

// 판매자 전용 테스트 버튼들
function SellerTestButtons({
  onTriggerMockTradeRequest,
}: {
  onTriggerMockTradeRequest: () => void;
}) {
  return (
    <>
      <button
        onClick={onTriggerMockTradeRequest}
        className="block w-full bg-blue-600 text-white px-3 py-2 rounded text-xs hover:bg-blue-700"
      >
        📨 거래 요청 받기 (시뮬레이션)
      </button>
      <div className="text-xs text-gray-400">구매자의 거래 요청 시뮬레이션</div>
    </>
  );
}

// 공통 테스트 버튼들
function CommonTestButtons({
  onTriggerMockTradeResponse,
}: {
  onTriggerMockTradeResponse: (accept: boolean) => void;
}) {
  return (
    <>
      <button
        onClick={() => onTriggerMockTradeResponse(true)}
        className="block w-full bg-green-600 text-white px-3 py-2 rounded text-xs hover:bg-green-700"
      >
        ✅ 거래 수락 시뮬레이션
      </button>
      <button
        onClick={() => onTriggerMockTradeResponse(false)}
        className="block w-full bg-red-600 text-white px-3 py-2 rounded text-xs hover:bg-red-700"
      >
        ❌ 거래 거부 시뮬레이션
      </button>
    </>
  );
}

// 네비게이션 버튼들
function NavigationButtons({
  router,
}: {
  router: ReturnType<typeof useRouter>;
}) {
  return (
    <>
      <hr className="border-gray-600 my-2" />
      <button
        onClick={() => router.push('/match/trading')}
        className="block w-full bg-yellow-600 text-white px-3 py-2 rounded text-xs hover:bg-yellow-700"
      >
        🚀 거래 페이지로
      </button>
      <button
        onClick={() => router.push('/match/complete')}
        className="block w-full bg-indigo-600 text-white px-3 py-2 rounded text-xs hover:bg-indigo-700"
      >
        🎉 완료 페이지로
      </button>
    </>
  );
}
