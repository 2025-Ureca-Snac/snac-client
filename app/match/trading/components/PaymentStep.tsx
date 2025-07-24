'use client';

import React, { useState } from 'react';
import { useTradingWebSocket } from '../hooks/useTradingWebSocket';

interface PaymentStepProps {
  amount: number;
  tradeId?: number; // 거래 ID 추가
  onNext: () => void;
}

export default function PaymentStep({
  amount,
  tradeId,
  onNext,
}: PaymentStepProps) {
  const { sendPayment: wsSendPayment, isConnected } = useTradingWebSocket();
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = async () => {
    if (!tradeId) {
      alert('거래 ID가 없습니다.');
      return;
    }

    if (!isConnected) {
      alert('WebSocket이 연결되지 않았습니다. 잠시 후 다시 시도해주세요.');
      return;
    }

    setIsProcessing(true);

    try {
      // 결제 메시지 전송 (전액을 money로 처리)
      const success = wsSendPayment(tradeId, amount, 0);

      if (success) {
        console.log('✅ 결제 메시지 전송 성공');
        // 잠시 후 다음 단계로 이동
        setTimeout(() => {
          onNext();
        }, 1000);
      } else {
        alert('결제 메시지 전송에 실패했습니다.');
      }
    } catch (error) {
      console.error('결제 처리 오류:', error);
      alert('결제 처리 중 오류가 발생했습니다.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-6">결제 진행</h2>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <div className="flex items-center space-x-2">
            <span className="text-yellow-600">💡</span>
            <span className="text-sm text-yellow-700">
              안전한 거래를 위해 에스크로 시스템을 통해 결제합니다.
            </span>
          </div>
        </div>

        <div className="space-y-4 mb-6">
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold text-gray-700 mb-2">결제 정보</h3>
            <p className="text-3xl font-bold text-blue-600">
              {amount.toLocaleString()}원
            </p>
            <p className="text-sm text-gray-500 mt-1">수수료 포함</p>
          </div>

          <div className="space-y-3">
            <h4 className="font-medium text-gray-700">결제 방법 선택</h4>
            <div className="space-y-2">
              <button className="w-full border-2 border-blue-600 bg-blue-50 text-blue-700 py-4 px-4 rounded-lg font-medium hover:bg-blue-100 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">💳</span>
                    <div className="text-left">
                      <div className="font-medium">카드 결제</div>
                      <div className="text-sm text-blue-600">
                        즉시 결제 (권장)
                      </div>
                    </div>
                  </div>
                  <div className="w-4 h-4 border-2 border-blue-600 rounded-full bg-blue-600"></div>
                </div>
              </button>

              <button className="w-full border-2 border-gray-300 text-gray-600 py-4 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">🏦</span>
                    <div className="text-left">
                      <div className="font-medium">계좌 이체</div>
                      <div className="text-sm text-gray-500">1-2분 소요</div>
                    </div>
                  </div>
                  <div className="w-4 h-4 border-2 border-gray-300 rounded-full"></div>
                </div>
              </button>
            </div>
          </div>
        </div>

        <button
          onClick={handlePayment}
          disabled={isProcessing}
          className={`w-full py-4 px-6 rounded-lg font-medium transition-colors ${
            isProcessing
              ? 'bg-gray-400 text-white cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {isProcessing ? '결제 처리 중...' : '결제 완료'}
        </button>
      </div>
    </div>
  );
}
