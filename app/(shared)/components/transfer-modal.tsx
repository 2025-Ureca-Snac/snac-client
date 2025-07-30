'use client';

import React, { useState } from 'react';
import { api, handleApiError } from '../utils/api';
import { TransferModalProps, TransferRequest } from '../types/transfer-modal';

/**
 * @author 이승우
 * @description 스낵머니 송금 모달 컴포넌트
 * @params {@link TransferModalProps}: 송금 모달 컴포넌트 타입
 */
export default function TransferModal({
  open,
  onClose,
  currentMoney,
  onTransferSuccess,
}: TransferModalProps) {
  const [formData, setFormData] = useState<TransferRequest>({
    recipientId: '',
    amount: 0,
    message: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 모달이 열릴 때마다 폼 초기화
  React.useEffect(() => {
    if (open) {
      setFormData({
        recipientId: '',
        amount: 0,
        message: '',
      });
      setError(null);
    }
  }, [open]);

  const handleInputChange = (
    field: keyof TransferRequest,
    value: string | number
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.recipientId.trim()) {
      setError('받는 사람 ID를 입력해주세요.');
      return;
    }

    if (formData.amount <= 0) {
      setError('송금 금액을 입력해주세요.');
      return;
    }

    if (formData.amount > currentMoney) {
      setError('보유한 머니보다 많은 금액을 송금할 수 없습니다.');
      return;
    }

    if (formData.amount < 1000) {
      setError('최소 송금 금액은 1,000S입니다.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // 송금 API 호출
      const response = await api.post('/money/transfer', {
        recipientId: formData.recipientId,
        amount: formData.amount,
        message: formData.message || '',
      });

      console.log('송금 성공:', response.data);

      // 성공 콜백 호출
      if (onTransferSuccess) {
        onTransferSuccess(formData.amount, formData.recipientId);
      }

      alert('송금이 성공적으로 완료되었습니다!');
      onClose();
    } catch (err) {
      console.error('송금 실패:', err);
      const errorMessage = handleApiError(err);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">스낵머니 송금</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={isLoading}
          >
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
              <path
                d="M18 6L6 18M6 6l12 12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        {/* 현재 잔액 */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="text-sm text-blue-600 mb-1">현재 잔액</div>
          <div className="text-2xl font-bold text-blue-900">
            {currentMoney.toLocaleString()}S
          </div>
        </div>

        {/* 송금 폼 */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 받는 사람 ID */}
          <div>
            <label
              htmlFor="recipientId"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              받는 사람 ID
            </label>
            <input
              type="text"
              id="recipientId"
              value={formData.recipientId}
              onChange={(e) => handleInputChange('recipientId', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="받는 사람의 ID를 입력하세요"
              disabled={isLoading}
            />
          </div>

          {/* 송금 금액 */}
          <div>
            <label
              htmlFor="amount"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              송금 금액 (S)
            </label>
            <input
              type="number"
              id="amount"
              value={formData.amount || ''}
              onChange={(e) =>
                handleInputChange('amount', parseInt(e.target.value) || 0)
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="송금할 금액을 입력하세요"
              min="1000"
              max={currentMoney}
              disabled={isLoading}
            />
            <div className="text-xs text-gray-500 mt-1">
              최소 1,000S, 최대 {currentMoney.toLocaleString()}S
            </div>
          </div>

          {/* 송금 메시지 */}
          <div>
            <label
              htmlFor="message"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              메시지 (선택사항)
            </label>
            <textarea
              id="message"
              value={formData.message}
              onChange={(e) => handleInputChange('message', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="송금과 함께 보낼 메시지를 입력하세요"
              rows={3}
              maxLength={100}
              disabled={isLoading}
            />
            <div className="text-xs text-gray-500 mt-1">
              {formData.message?.length || 0}/100자
            </div>
          </div>

          {/* 에러 메시지 */}
          {error && (
            <div className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg p-3">
              {error}
            </div>
          )}

          {/* 버튼 */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={isLoading}
            >
              취소
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading ? '송금 중...' : '송금하기'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
