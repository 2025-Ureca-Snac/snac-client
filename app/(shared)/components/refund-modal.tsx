'use client';
import React, { useState } from 'react';
import { api } from '../utils/api';
import { RefundModalProps, RefundRequest } from '../types/refund-modal';

/**
 * @author 이승우
 * @description 스낵머니 환불 모달 컴포넌트
 */
export default function RefundModal({
  open,
  onClose,
  amount,
  paymentKey,
  onRefundSuccess,
}: RefundModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [reason, setReason] = useState('');
  const [customReason, setCustomReason] = useState('');

  // 일반적인 환불 사유 목록
  const commonReasons = [
    '실수로 충전했습니다',
    '서비스를 사용하지 않게 되었습니다',
    '중복 충전되었습니다',
    '결제 오류로 인한 환불',
    '기타',
  ];

  const handleRefund = async () => {
    if (!reason.trim()) {
      alert('환불 사유를 선택해주세요.');
      return;
    }

    if (reason === '기타' && !customReason.trim()) {
      alert('환불 사유를 입력해주세요.');
      return;
    }

    if (!confirm(`정말 ${amount.toLocaleString()}원을 환불하시겠습니까?`)) {
      return;
    }

    setIsLoading(true);

    try {
      const finalReason = reason === '기타' ? customReason.trim() : reason;
      const refundRequest: RefundRequest = {
        reason: finalReason,
      };

      const response = await api.post(
        `/payments/${paymentKey}/cancel`,
        refundRequest
      );

      console.log('환불 성공:', response.data);

      const responseData = response.data as Record<string, unknown>;
      if (responseData.status === 'OK') {
        alert('환불이 성공적으로 처리되었습니다.');

        if (onRefundSuccess) {
          onRefundSuccess(amount);
        }

        onClose();
      } else {
        alert('환불 처리 중 문제가 발생했습니다. 고객센터로 문의해주세요.');
      }
    } catch (error) {
      console.error('환불 실패:', error);
      alert('환불 처리 중 오류가 발생했습니다. 고객센터로 문의해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-gray-900">환불 확인</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="mb-6">
          <p className="text-gray-700 mb-4">다음 금액을 환불하시겠습니까?</p>
          <div className="text-center mb-6">
            <span className="text-2xl font-bold text-red-600">
              {amount.toLocaleString()}원
            </span>
          </div>

          {/* 환불 사유 입력 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              환불 사유
            </label>

            {/* 사유 선택 드롭다운 */}
            <select
              value={reason}
              onChange={(e) => {
                setReason(e.target.value);
                if (e.target.value !== '기타') {
                  setCustomReason('');
                }
              }}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 mb-3"
            >
              <option value="">환불 사유를 선택해주세요</option>
              {commonReasons.map((commonReason) => (
                <option key={commonReason} value={commonReason}>
                  {commonReason}
                </option>
              ))}
            </select>

            {/* 기타 선택 시 커스텀 입력 */}
            {reason === '기타' && (
              <textarea
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
                placeholder="환불 사유를 직접 입력해주세요"
                rows={3}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-none"
              />
            )}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleRefund}
            disabled={isLoading}
            className="flex-[4] px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? '처리 중...' : '환불'}
          </button>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-[1] px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            취소
          </button>
        </div>
      </div>
    </div>
  );
}
