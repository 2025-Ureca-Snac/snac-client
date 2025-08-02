'use client';

import React, { useState, useEffect } from 'react';
import { useGlobalWebSocket } from '../../../(shared)/hooks/useGlobalWebSocket';
import { api } from '../../../(shared)/utils/api';
import { ApiResponse } from '../../../(shared)/types/api';
import { getFinalAmount } from '../../../(shared)/utils/payment-calculations';

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
  const [snackMoney, setSnackMoney] = useState(0);
  const [snackPoints, setSnackPoints] = useState(0);
  const [snackPointsToUse, setSnackPointsToUse] = useState(0);
  const [isLoadingWallet, setIsLoadingWallet] = useState(true);

  // 지갑 정보 조회
  useEffect(() => {
    const fetchWalletData = async () => {
      try {
        const response =
          await api.get<ApiResponse<{ money: number; point: number }>>(
            '/wallets/summary'
          );
        console.log('지갑 정보 조회:', response.data);
        if (response.data.data) {
          setSnackMoney(response.data.data.money);
          setSnackPoints(response.data.data.point);
        }
      } catch (error) {
        console.error('지갑 정보 조회 실패:', error);
      } finally {
        setIsLoadingWallet(false);
      }
    };

    fetchWalletData();
  }, []);

  // 최대 사용 가능한 포인트 계산
  const maxUsablePoints = Math.min(snackPoints, amount);
  const finalAmount = getFinalAmount(amount, snackPointsToUse);
  const totalAvailable = snackMoney + snackPoints;

  const handlePayment = async () => {
    if (!tradeId) {
      alert('거래 ID가 없습니다.');
      return;
    }

    if (!isConnected) {
      alert('WebSocket이 연결되지 않았습니다. 잠시 후 다시 시도해주세요.');
      return;
    }

    // 포인트 부족 체크
    if (totalAvailable < amount) {
      alert('보유 포인트가 부족합니다.');
      return;
    }

    setIsProcessing(true);

    try {
      console.log('결제 처리 시작:', {
        tradeId,
        amount,
        snackPointsToUse,
        finalAmount,
        remainingMoney:
          snackMoney -
          (finalAmount > snackPointsToUse ? finalAmount - snackPointsToUse : 0),
      });

      // WebSocket을 통한 결제 메시지 전송
      const moneyToUse = Math.max(0, finalAmount - snackPointsToUse);
      const success = wsSendPayment(tradeId, finalAmount, snackPointsToUse);

      if (success) {
        console.log('✅ 결제 메시지 전송 성공');

        // 지갑 잔액 업데이트 (실제 결제 처리는 서버에서 함)
        if (snackPointsToUse > 0) {
          setSnackPoints((prev) => prev - snackPointsToUse);
        }
        if (moneyToUse > 0) {
          setSnackMoney((prev) => prev - moneyToUse);
        }

        // 잠시 후 다음 단계로 이동
        setTimeout(() => {
          onNext();
        }, 1500);
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

  // 포인트 사용량 변경 핸들러
  const handleSnackPointsChange = (value: number) => {
    setSnackPointsToUse(Math.min(value, maxUsablePoints));
  };

  if (isLoadingWallet) {
    return (
      <div className="max-w-3xl mx-auto px-4">
        <div className="relative bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700/50 shadow-2xl overflow-hidden">
          <div className="relative p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-400 mx-auto mb-4"></div>
            <p className="text-gray-400">지갑 정보를 불러오는 중...</p>
          </div>
        </div>
      </div>
    );
  }

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
              <span className="text-green-400 text-lg">💰</span>
              <span className="text-green-400 text-sm font-medium tracking-wider">
                스낵 포인트 결제
              </span>
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-white via-green-300 to-white bg-clip-text text-transparent mb-2">
              결제 진행
            </h2>
            <p className="text-gray-400">
              보유한 스낵 포인트로 안전하게 결제하세요
            </p>
          </div>

          {/* 현재 지갑 상태 */}
          <div className="relative bg-gradient-to-r from-blue-900/20 to-cyan-900/20 rounded-xl p-6 mb-8 border border-blue-400/20">
            <div className="absolute inset-0 bg-blue-500/5 rounded-xl"></div>
            <div className="relative">
              <h3 className="text-blue-300 font-semibold mb-4">
                현재 보유 자산
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-400/10 rounded-lg p-4">
                  <div className="text-blue-200 text-sm mb-1">스낵 머니</div>
                  <div className="text-blue-300 font-bold text-lg">
                    {snackMoney.toLocaleString()}원
                  </div>
                </div>
                <div className="bg-purple-400/10 rounded-lg p-4">
                  <div className="text-purple-200 text-sm mb-1">
                    스낵 포인트
                  </div>
                  <div className="text-purple-300 font-bold text-lg">
                    {snackPoints.toLocaleString()}P
                  </div>
                </div>
              </div>
              <div className="mt-4 bg-green-400/10 rounded-lg p-3">
                <div className="text-green-200 text-sm">총 사용 가능 금액</div>
                <div className="text-green-300 font-bold text-xl">
                  {totalAvailable.toLocaleString()}원
                </div>
              </div>
            </div>
          </div>

          {/* 결제 금액 */}
          <div className="relative bg-gradient-to-r from-green-400/20 via-green-300/10 to-green-400/20 rounded-2xl p-6 mb-8 border border-green-400/30">
            <div className="absolute inset-0 bg-green-400/5 rounded-2xl"></div>
            <div className="relative text-center">
              <div className="text-green-400 text-sm font-medium mb-2 tracking-wider">
                결제 금액
              </div>
              <div className="text-4xl font-bold text-green-300 mb-2">
                {amount.toLocaleString()}원
              </div>
              <div className="text-green-400/70 text-sm">
                {totalAvailable >= amount ? '결제 가능' : '잔액 부족'}
              </div>
            </div>
          </div>

          {/* 포인트 사용량 조절 */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-white font-semibold">스낵 포인트 사용량</h4>
              <span className="text-purple-300 text-sm">
                최대 {maxUsablePoints.toLocaleString()}P 사용 가능
              </span>
            </div>

            <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-600/50">
              <input
                type="range"
                min="0"
                max={maxUsablePoints}
                value={snackPointsToUse}
                onChange={(e) =>
                  handleSnackPointsChange(Number(e.target.value))
                }
                className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
                style={{
                  background: `linear-gradient(to right, #a855f7 0%, #a855f7 ${(snackPointsToUse / maxUsablePoints) * 100}%, #4b5563 ${(snackPointsToUse / maxUsablePoints) * 100}%, #4b5563 100%)`,
                }}
              />
              <div className="flex justify-between mt-3">
                <button
                  onClick={() => handleSnackPointsChange(0)}
                  className="text-xs bg-gray-700 hover:bg-gray-600 text-gray-300 px-3 py-1 rounded"
                >
                  0P
                </button>
                <div className="text-center">
                  <div className="text-purple-300 font-bold text-lg">
                    {snackPointsToUse.toLocaleString()}P
                  </div>
                  <div className="text-gray-400 text-xs">사용할 포인트</div>
                </div>
                <button
                  onClick={() => handleSnackPointsChange(maxUsablePoints)}
                  className="text-xs bg-purple-600 hover:bg-purple-500 text-white px-3 py-1 rounded"
                >
                  최대
                </button>
              </div>
            </div>
          </div>

          {/* 결제 요약 */}
          <div className="mb-8 bg-gray-800/50 rounded-xl p-6 border border-gray-600/50">
            <h4 className="text-white font-semibold mb-4">결제 요약</h4>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">스낵 포인트 사용</span>
                <span className="text-purple-300">
                  -{snackPointsToUse.toLocaleString()}P
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">스낵 머니 사용</span>
                <span className="text-blue-300">
                  -
                  {Math.max(0, finalAmount - snackPointsToUse).toLocaleString()}
                  원
                </span>
              </div>
              <hr className="border-gray-600" />
              <div className="flex justify-between text-lg font-bold">
                <span className="text-white">최종 결제 금액</span>
                <span className="text-green-300">
                  {finalAmount.toLocaleString()}원
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">결제 후 잔액</span>
                <span className="text-green-400">
                  {Math.max(0, totalAvailable - amount).toLocaleString()}원
                </span>
              </div>
            </div>
          </div>

          {/* 결제 버튼 */}
          <button
            onClick={handlePayment}
            disabled={isProcessing || totalAvailable < amount}
            className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 relative overflow-hidden group ${
              isProcessing || totalAvailable < amount
                ? 'bg-gray-600 text-gray-300 cursor-not-allowed'
                : 'bg-gradient-to-r from-green-400 to-green-500 text-black hover:from-green-300 hover:to-green-400 shadow-lg hover:shadow-green-400/25'
            }`}
          >
            {isProcessing ? (
              <span className="flex items-center justify-center space-x-2">
                <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                <span>결제 처리 중...</span>
              </span>
            ) : totalAvailable < amount ? (
              <span>잔액 부족</span>
            ) : (
              <>
                <span className="relative z-10">
                  {finalAmount.toLocaleString()}원 결제하기
                </span>
                <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12"></div>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
