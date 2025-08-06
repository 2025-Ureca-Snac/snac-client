'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { api, handleApiError } from '../utils/api';
import { ApiResponse } from '../types/api';
import { RechargeModalProps } from '../types/recharge-modal';
import { toast } from 'sonner';

/**
 * @author 이승우
 * @description 스낵머니 충전 모달 컴포넌트
 * @params {@link RechargeModalProps}: 충전 모달 컴포넌트 타입
 */
export default function RechargeModal({
  open,
  onClose,
  currentMoney,
  shortage,
  onRefreshData,
}: RechargeModalProps) {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);

  // 디버깅용 로그

  // 모달이 열릴 때마다 선택 상태 초기화
  useEffect(() => {
    if (open) {
      if (shortage && shortage > 0) {
        // 부족한 금액이 있으면 해당 금액으로 자동 설정
        setSelectedAmount(shortage);
      } else {
        // 부족한 금액이 없으면 10,000원으로 자동 설정
        setSelectedAmount(10000);
      }
    }
  }, [open, shortage]);

  // ESC 키로 모달 닫기
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && open) {
        onClose();
      }
    };

    if (open) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [open, onClose]);

  // 결제 결과 메시지 처리
  useEffect(() => {
    const handleMessage = async (event: MessageEvent) => {
      if (event.data.type === 'PAYMENT_RESULT') {
        if (event.data.success) {
          try {
            // 결제 성공 시 /money/recharge/success API 호출 (GET 요청, 쿼리 파라미터로 전달)
            const response = await api.get(
              `/money/recharge/success?paymentKey=${event.data.paymentKey}&orderId=${event.data.orderId}&amount=${event.data.amount}`
            );

            const responseData = response.data as ApiResponse<unknown>;
            if (responseData.status === 'OK') {
              // 결제 성공 - 사용자 정보 및 지갑 정보 새로고침
              try {
                const { useUserStore } = await import('../stores/user-store');
                await useUserStore.getState().fetchUserProfile();

                // 지갑 정보도 새로고침
                const { api } = await import('../utils/api');
                await api.get('/wallets/summary');

                // 성공 메시지 표시
                toast.success('스낵머니가 성공적으로 충전되었습니다!');

                // 부모 컴포넌트의 데이터 새로고침 함수도 호출
                onRefreshData?.();
              } catch {
                // 사용자 정보 새로고침 실패 처리
              }
            } else {
              // 백엔드에서 실패 응답을 보낸 경우
              try {
                await api.post('/payments/fail', {
                  errorCode: 'RECHARGE_BACKEND_FAILED',
                  errorMessage: `백엔드 처리 실패: ${responseData.message || '알 수 없는 오류'}`,
                  orderId: event.data.orderId,
                });
              } catch {
                // 백엔드 처리 실패 정보 전송 실패
              }
            }
          } catch (error) {
            const errorMessage = handleApiError(error);

            // 백엔드에 충전 처리 실패 정보 전송
            try {
              await api.post('/payments/fail', {
                errorCode: 'RECHARGE_PROCESS_ERROR',
                errorMessage: `충전 처리 중 오류: ${errorMessage}`,
                orderId: event.data.orderId,
              });
            } catch {
              // 충전 처리 실패 정보 전송 실패
            }
          }
        } else {
          // 결제 실패 처리
        }
      } else if (event.data.type === 'PAYMENT_ERROR') {
        // 결제 오류 처리
      }

      // ✅ 모든 경우에 대해 모달 닫고 데이터 새로고침
      onClose();
      // 부모 컴포넌트의 데이터 새로고침 함수 호출
      onRefreshData?.();
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [selectedAmount, onClose, onRefreshData]);

  const handleRecharge = async () => {
    if (!selectedAmount) {
      toast.error('충전할 금액을 입력해주세요.');
      return;
    }

    if (selectedAmount < 1000) {
      toast.error('최소 1,000원부터 충전 가능합니다.');
      return;
    }

    if (selectedAmount >= 1000) {
      try {
        // money/recharge/prepare API 호출
        const response = await api.post('/money/recharge/prepare', {
          amount: selectedAmount,
        });

        // API 응답에서 받은 값들 (안전하게 처리)
        const responseData = response.data as ApiResponse<{
          amount: number;
          customerEmail: string;
          customerName: string;
          orderId: string;
          orderName: string;
        }>;

        const amount = responseData.data.amount;
        const customerEmail = responseData.data.customerEmail;
        const customerName = responseData.data.customerName;
        const serverOrderId = responseData.data.orderId;
        const orderName = responseData.data.orderName;

        // 필수 값들이 있는지 확인
        if (!amount || !serverOrderId) {
          throw new Error('서버 응답에 필수 정보가 누락되었습니다.');
        }

        // 새 창에서 결제 페이지 열기 (API 응답 값들 전달)
        const paymentUrl = `${window.location.origin}/payment/process?amount=${amount}&orderId=${serverOrderId}&customerEmail=${encodeURIComponent(customerEmail || '')}&customerName=${encodeURIComponent(customerName || '')}&orderName=${encodeURIComponent(orderName || '')}`;
        window.open(
          paymentUrl,
          '_blank',
          'width=800,height=700,scrollbars=yes,resizable=yes'
        );
      } catch (error) {
        const errorMessage = handleApiError(error);

        // 백엔드에 충전 준비 실패 정보 전송
        try {
          await api.post('/payments/fail', {
            errorCode: 'RECHARGE_PREPARE_ERROR',
            errorMessage: `충전 준비 중 오류: ${errorMessage}`,
            orderId: 'PREPARE_STAGE', // 준비 단계에서는 orderId가 없음
          });
        } catch {
          // 충전 준비 실패 정보 전송 실패
        }

        // ✅ alert 대신 모달 닫고 데이터 새로고침
        onClose();
        onRefreshData?.();
      }
    }
  };

  const formatNumber = (num: number) => {
    if (num == null || isNaN(num)) return '';
    return num.toLocaleString('ko-KR');
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            충전 금액
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
          >
            ✕
          </button>
        </div>

        {/* Recharge Input */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            충전할 금액
          </label>
          <div className="relative">
            <input
              type="number"
              min="1000"
              step="1000"
              value={selectedAmount || ''}
              onChange={(e) => {
                const value = parseInt(e.target.value);
                // 음수나 0 이하 값은 null로 설정
                if (value && value > 0) {
                  setSelectedAmount(value);
                } else {
                  setSelectedAmount(null);
                }
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  if (!selectedAmount) {
                    toast.error('충전할 금액을 입력해주세요.');
                    return;
                  }
                  if (selectedAmount < 1000) {
                    toast.error('최소 1,000원부터 충전 가능합니다.');
                    return;
                  }
                  handleRecharge();
                }
              }}
              placeholder="충전할 금액을 입력하세요"
              className="w-full p-3 pr-12 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 pointer-events-none">
              원
            </div>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            최소 1,000원부터 충전 가능합니다
          </p>
        </div>

        {/* Current Points Display */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mb-6">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-gray-700 dark:text-gray-300">
                현재 스낵머니
              </span>
              <div className="flex items-center">
                <span className="font-medium text-gray-900 dark:text-white">
                  {formatNumber(currentMoney)}
                </span>
                <Image
                  src="/snac-price.svg"
                  alt="스낵머니"
                  width={16}
                  height={16}
                  className="ml-1"
                />
              </div>
            </div>
          </div>
          {selectedAmount && (
            <div className="space-y-2 mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
              <div className="flex justify-between items-center">
                <span className="text-gray-700 dark:text-gray-300">
                  예상 충전 후 스낵머니
                </span>
                <div className="flex items-center">
                  <span className="font-bold text-gray-900 dark:text-white">
                    {formatNumber(currentMoney + selectedAmount)}
                  </span>
                  <Image
                    src="/snac-price.svg"
                    alt="스낵머니"
                    width={16}
                    height={16}
                    className="ml-1"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action Button */}
        <button
          onClick={handleRecharge}
          disabled={!selectedAmount}
          className="w-full bg-gray-900 text-white py-3 px-4 rounded-md hover:bg-gray-800 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          충전하기
        </button>
      </div>
    </div>
  );
}
