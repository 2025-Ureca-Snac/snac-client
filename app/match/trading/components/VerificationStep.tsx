'use client';

import React, { useState } from 'react';
import { useGlobalWebSocket } from '@/app/(shared)/hooks/useGlobalWebSocket';

interface VerificationStepProps {
  dataAmount: number;
  timeLeft: number;
  tradeId?: number;
  userRole: 'buyer' | 'seller';
  onNext: () => void;
}

export default function VerificationStep({
  dataAmount,
  timeLeft,
  tradeId,
  userRole,
  onNext,
}: VerificationStepProps) {
  const { sendTradeConfirm: wsSendTradeConfirm } = useGlobalWebSocket();
  const [isConfirming, setIsConfirming] = useState(false);

  // 전송 완료 시간을 컴포넌트 마운트 시점에 고정
  const [completionTime] = useState(() => new Date().toLocaleTimeString());

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // 구매자 거래 확정 처리
  const handleBuyerConfirm = async () => {
    if (!tradeId) {
      onNext();
      return;
    }

    setIsConfirming(true);
    try {
      const success = wsSendTradeConfirm(tradeId);
      if (success) {
        console.log('✅ 거래 확정 요청 성공');
        setTimeout(() => {
          onNext();
        }, 1000);
      } else {
        alert('거래 확정 요청에 실패했습니다.');
      }
    } catch (error) {
      console.error('거래 확정 오류:', error);
      alert('거래 확정 중 오류가 발생했습니다.');
    } finally {
      setIsConfirming(false);
    }
  };

  // 구매자용 화면
  if (userRole === 'buyer') {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6">
            데이터 수신 확인
          </h2>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-lg">📱</span>
              </div>
              <h3 className="font-semibold text-blue-800">데이터 전송 완료</h3>
            </div>
            <p className="text-blue-700 text-sm">
              판매자가 {dataAmount}GB 데이터를 전송했습니다. 수신 확인해주세요.
            </p>
          </div>

          <div className="border border-gray-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-gray-700 mb-3">전송 정보</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>전송량:</span>
                <span className="font-medium">{dataAmount}GB</span>
              </div>
              <div className="flex justify-between">
                <span>전송 시간:</span>
                <span className="font-medium">{completionTime}</span>
              </div>
              <div className="flex justify-between">
                <span>잔여 시간:</span>
                <span className="font-medium text-orange-600">
                  {formatTime(timeLeft)}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex items-start space-x-2">
              <span className="text-yellow-600 text-lg">⚠️</span>
              <div>
                <div className="font-medium text-yellow-800">
                  데이터 수신 확인
                </div>
                <div className="text-sm text-yellow-700 mt-1">
                  휴대폰에서 데이터가 정상적으로 수신되었는지 확인 후 아래
                  버튼을 눌러주세요.
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={handleBuyerConfirm}
            disabled={isConfirming}
            className={`w-full py-4 px-6 rounded-lg font-medium transition-colors ${
              isConfirming
                ? 'bg-gray-400 text-white cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {isConfirming ? '확정 중...' : '데이터 수신 확인 완료'}
          </button>
        </div>
      </div>
    );
  }

  // 판매자용 화면 (구매자 데이터 수신 완료 대기)
  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-6">거래 완료 대기</h2>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
          <div className="text-center">
            <div className="w-20 h-20 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <h3 className="font-semibold text-blue-800 mb-2">
              구매자 확인 대기 중
            </h3>
            <p className="text-blue-700 text-sm">
              구매자가 데이터 수신을 확인하고 있습니다. 잠시만 기다려주세요.
            </p>
          </div>
        </div>

        <div className="border border-gray-200 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-gray-700 mb-3">전송 완료 정보</h3>
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex justify-between">
              <span>전송량:</span>
              <span className="font-medium">{dataAmount}GB</span>
            </div>
            <div className="flex justify-between">
              <span>전송 시간:</span>
              <span className="font-medium">{completionTime}</span>
            </div>
            <div className="flex justify-between">
              <span>잔여 시간:</span>
              <span className="font-medium text-orange-600">
                {formatTime(timeLeft)}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <div className="flex items-start space-x-2">
            <span className="text-yellow-600 text-lg">⏳</span>
            <div>
              <div className="font-medium text-yellow-800">대기 중</div>
              <div className="text-sm text-yellow-700 mt-1">
                구매자가 데이터 수신을 확인하면 거래가 완료됩니다.
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
          <div className="flex items-start space-x-2">
            <span className="text-gray-600 text-lg">💡</span>
            <div>
              <div className="font-medium text-gray-800">거래 진행 상황</div>
              <div className="text-sm text-gray-700 mt-1">
                데이터 전송이 완료되었습니다. 구매자의 확인을 기다리고 있습니다.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
