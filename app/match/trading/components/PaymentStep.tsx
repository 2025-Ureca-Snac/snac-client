'use client';

import React, { useState } from 'react';
import { useGlobalWebSocket } from '../../../(shared)/hooks/useGlobalWebSocket';

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
  const { sendPayment: wsSendPayment, isConnected } = useGlobalWebSocket();
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
    <div className="max-w-3xl mx-auto px-4">
      {/* 메인 카드 - 투명 배경 */}
      <div className="relative bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700/50 shadow-2xl overflow-hidden">
        {/* 서브틀한 글로우 효과 */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-400/5 via-transparent to-green-300/3"></div>

        <div className="relative p-8">
          {/* 헤더 */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center space-x-2 bg-green-400/10 px-4 py-2 rounded-full mb-4">
              <span className="text-green-400 text-lg">💳</span>
              <span className="text-green-400 text-sm font-medium tracking-wider">
                SECURE PAYMENT
              </span>
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-white via-green-300 to-white bg-clip-text text-transparent mb-2">
              결제 진행
            </h2>
            <p className="text-gray-400">안전하고 빠른 결제를 진행하세요</p>
          </div>

          {/* 에스크로 안내 */}
          <div className="relative bg-gradient-to-r from-blue-900/20 to-cyan-900/20 rounded-xl p-6 mb-8 border border-blue-400/20">
            <div className="absolute inset-0 bg-blue-500/5 rounded-xl"></div>
            <div className="relative flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-400/20 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-blue-400 text-xl">🛡️</span>
              </div>
              <div>
                <div className="text-blue-300 font-semibold mb-1">
                  에스크로 보호
                </div>
                <div className="text-blue-200/80 text-sm">
                  안전한 거래를 위해 에스크로 시스템을 통해 결제합니다
                </div>
              </div>
            </div>
          </div>

          {/* 결제 정보 카드 */}
          <div className="relative bg-gradient-to-r from-green-400/20 via-green-300/10 to-green-400/20 rounded-2xl p-6 mb-8 border border-green-400/30">
            <div className="absolute inset-0 bg-green-400/5 rounded-2xl animate-pulse"></div>
            <div className="relative text-center">
              <div className="text-green-400 text-sm font-medium mb-2 tracking-wider">
                PAYMENT AMOUNT
              </div>
              <div className="text-4xl font-bold text-green-300 mb-2">
                {amount.toLocaleString()}원
              </div>
              <div className="text-green-400/70 text-sm">수수료 포함</div>
            </div>
          </div>

          {/* 결제 방법 선택 */}
          <div className="mb-8">
            <h4 className="text-white font-semibold mb-4 text-center">
              결제 방법 선택
            </h4>
            <div className="space-y-3">
              {/* 카드 결제 (선택됨) */}
              <button className="w-full bg-gradient-to-r from-green-400/20 to-green-300/10 border-2 border-green-400/50 rounded-xl p-5 transition-all duration-300 hover:from-green-400/30 hover:to-green-300/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-green-400/20 rounded-full flex items-center justify-center">
                      <span className="text-2xl">💳</span>
                    </div>
                    <div className="text-left">
                      <div className="text-white font-semibold">카드 결제</div>
                      <div className="text-green-400 text-sm">
                        즉시 결제 (권장)
                      </div>
                    </div>
                  </div>
                  <div className="relative">
                    <div className="w-5 h-5 border-2 border-green-400 rounded-full bg-green-400"></div>
                    <div className="absolute inset-0 bg-green-400 rounded-full animate-ping opacity-50"></div>
                  </div>
                </div>
              </button>

              {/* 계좌 이체 */}
              <button className="w-full bg-gray-800/50 border-2 border-gray-600/50 rounded-xl p-5 transition-all duration-300 hover:bg-gray-800/70 hover:border-gray-500/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gray-600/20 rounded-full flex items-center justify-center">
                      <span className="text-2xl">🏦</span>
                    </div>
                    <div className="text-left">
                      <div className="text-gray-300 font-semibold">
                        계좌 이체
                      </div>
                      <div className="text-gray-500 text-sm">1-2분 소요</div>
                    </div>
                  </div>
                  <div className="w-5 h-5 border-2 border-gray-500 rounded-full"></div>
                </div>
              </button>
            </div>
          </div>

          {/* 결제 버튼 */}
          <button
            onClick={handlePayment}
            disabled={isProcessing}
            className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 relative overflow-hidden group ${
              isProcessing
                ? 'bg-gray-600 text-gray-300 cursor-not-allowed'
                : 'bg-gradient-to-r from-green-400 to-green-500 text-black hover:from-green-300 hover:to-green-400 shadow-lg hover:shadow-green-400/25'
            }`}
          >
            {isProcessing ? (
              <span className="flex items-center justify-center space-x-2">
                <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                <span>결제 처리 중...</span>
              </span>
            ) : (
              <>
                <span className="relative z-10">결제 완료</span>
                <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12"></div>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
