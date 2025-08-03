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
  currentPoints,
  shortage,
  onRefreshData,
}: RechargeModalProps) {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);

  // 디버깅용 로그
  console.log('RechargeModal shortage:', shortage);

  // 모달이 열릴 때마다 선택 상태 초기화
  useEffect(() => {
    if (open) {
      if (shortage && shortage > 0) {
        console.log('shortage', shortage);
        // 부족한 금액이 있으면 해당 금액으로 자동 설정
        setSelectedAmount(shortage);
      } else {
        console.log('shortage 비어있음');
        // 부족한 금액이 없으면 10,000원으로 자동 설정
        setSelectedAmount(10000);
      }
    }
  }, [open, shortage]);

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

            console.log('충전 성공 처리 완료:', response.data);

            const responseData = response.data as ApiResponse<unknown>;
            if (responseData.status === 'OK') {
              console.log('결제가 성공적으로 완료되었습니다!');
            } else {
              // 백엔드에서 실패 응답을 보낸 경우
              try {
                await api.post('/payments/fail', {
                  errorCode: 'RECHARGE_BACKEND_FAILED',
                  errorMessage: `백엔드 처리 실패: ${responseData.message || '알 수 없는 오류'}`,
                  orderId: event.data.orderId,
                });
                console.log('백엔드 처리 실패 정보가 전송되었습니다.');
              } catch (apiError) {
                console.error('백엔드 처리 실패 정보 전송 실패:', apiError);
              }
            }
          } catch (error) {
            console.error('충전 성공 처리 오류:', error);
            const errorMessage = handleApiError(error);

            // 백엔드에 충전 처리 실패 정보 전송
            try {
              await api.post('/payments/fail', {
                errorCode: 'RECHARGE_PROCESS_ERROR',
                errorMessage: `충전 처리 중 오류: ${errorMessage}`,
                orderId: event.data.orderId,
              });
              console.log('충전 처리 실패 정보가 백엔드에 전송되었습니다.');
            } catch (apiError) {
              console.error('충전 처리 실패 정보 전송 실패:', apiError);
            }
          }
        } else {
          // 결제 실패 처리
          console.log('결제가 실패했습니다:', event.data);
        }
      } else if (event.data.type === 'PAYMENT_ERROR') {
        console.log('결제 오류가 발생했습니다:', event.data);
      }

      // ✅ 모든 경우에 대해 모달 닫고 데이터 새로고침
      onClose();
      // 부모 컴포넌트의 데이터 새로고침 함수 호출
      onRefreshData?.();
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [selectedAmount]);

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
          console.error('필수 정보 누락:', { amount, serverOrderId });
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
        console.error('충전 준비 오류:', error);
        const errorMessage = handleApiError(error);

        // 백엔드에 충전 준비 실패 정보 전송
        try {
          await api.post('/payments/fail', {
            errorCode: 'RECHARGE_PREPARE_ERROR',
            errorMessage: `충전 준비 중 오류: ${errorMessage}`,
            orderId: 'PREPARE_STAGE', // 준비 단계에서는 orderId가 없음
          });
          console.log('충전 준비 실패 정보가 백엔드에 전송되었습니다.');
        } catch (apiError) {
          console.error('충전 준비 실패 정보 전송 실패:', apiError);
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
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-gray-900">충전 금액</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        {/* Recharge Input */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
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
                setSelectedAmount(value || null);
              }}
              placeholder="충전할 금액을 입력하세요"
              className="w-full p-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none">
              원
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            최소 1,000원부터 충전 가능합니다
          </p>
        </div>

        {/* Current Points Display */}
        <div className="border-t border-gray-200 pt-4 mb-6">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-gray-700">현재 스낵머니</span>
              <div className="flex items-center">
                <span className="font-medium text-gray-900">
                  {formatNumber(currentPoints)}
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
            <div className="space-y-2 mt-4 pt-4 border-t border-gray-100">
              <div className="flex justify-between items-center">
                <span className="text-gray-700">예상 충전 후 스낵머니</span>
                <div className="flex items-center">
                  <span className="font-bold text-gray-900">
                    {formatNumber(currentPoints + selectedAmount)}
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
