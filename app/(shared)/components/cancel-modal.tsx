'use client';
import React, { useState } from 'react';
import { api } from '../utils/api';
import { ApiResponse } from '../types/api';
import { CancelModalProps, CancelRequest } from '../types/cancel-modal';
import { toast } from 'sonner';

// 일반적인 취소 사유 목록
const COMMON_CANCEL_REASONS = [
  '실수로 충전했습니다',
  '서비스를 사용하지 않게 되었습니다',
  '중복 충전되었습니다',
  '결제 오류로 인한 취소',
  '기타',
] as const;

/**
 * @author 이승우
 * @description 스낵머니 취소 모달 컴포넌트
 */
export default function CancelModal({
  open,
  onClose,
  amount,
  paymentKey,
  onCancelSuccess,
  onRefreshData,
}: CancelModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [reason, setReason] = useState('');
  const [customReason, setCustomReason] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // 모달이 열릴 때마다 초기화
  React.useEffect(() => {
    if (open) {
      setReason('');
      setCustomReason('');
      setShowConfirmModal(false);
    }
  }, [open]);

  // ESC 키로 모달 닫기
  React.useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && open) {
        if (showConfirmModal) {
          setShowConfirmModal(false);
        } else {
          onClose();
        }
      }
    };

    if (open) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [open, showConfirmModal, onClose]);

  const handleCancel = async () => {
    if (!reason.trim()) {
      toast.error('취소 사유를 선택해주세요.');
      return;
    }

    if (reason === '기타' && !customReason.trim()) {
      toast.error('취소 사유를 입력해주세요.');
      return;
    }

    // 확인 모달 표시
    setShowConfirmModal(true);
  };

  const handleBack = () => {
    setShowConfirmModal(false);
  };

  const handleConfirmCancel = async () => {
    setIsLoading(true);
    setShowConfirmModal(false);

    try {
      const finalReason = reason === '기타' ? customReason.trim() : reason;
      const cancelRequest: CancelRequest = {
        reason: finalReason,
      };

      const response = await api.post(
        `/payments/${paymentKey}/cancel`,
        cancelRequest
      );

      const responseData = response.data as ApiResponse<unknown>;
      if (responseData.status === 'OK') {
        toast.success('취소가 성공적으로 처리되었습니다.');

        if (onCancelSuccess) {
          onCancelSuccess(amount);
        }
      } else {
        toast.error(
          '취소 처리 중 문제가 발생했습니다. 고객센터로 문의해주세요.'
        );
      }
    } catch {
      toast.error('취소 처리 중 오류가 발생했습니다. 고객센터로 문의해주세요.');
    } finally {
      setIsLoading(false);

      // ✅ 모든 경우에 대해 모달 닫고 데이터 새로고침
      onClose();
      // 부모 컴포넌트의 데이터 새로고침 함수 호출
      onRefreshData?.();
    }
  };

  if (!open) return null;

  return (
    <>
      {/* 메인 취소 모달 */}
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              취소 확인
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
            >
              ✕
            </button>
          </div>

          {/* Content */}
          <div className="mb-6">
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              다음 금액을 취소하시겠습니까?
            </p>
            <div className="text-center mb-6">
              <span className="text-2xl font-bold text-red-600 dark:text-red-400">
                {amount.toLocaleString()}원
              </span>
            </div>

            {/* 취소 사유 입력 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                취소 사유
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
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-red-500 mb-3"
              >
                <option value="">취소 사유를 선택해주세요</option>
                {COMMON_CANCEL_REASONS.map((commonReason) => (
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
                  placeholder="취소 사유를 직접 입력해주세요"
                  rows={3}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-none"
                />
              )}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-center">
            <button
              onClick={handleCancel}
              disabled={isLoading}
              className="w-full px-8 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed text-base font-medium"
            >
              {isLoading ? '처리 중...' : '취소'}
            </button>
          </div>
        </div>
      </div>

      {/* 확인 모달 */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-sm mx-4">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                취소 확인
              </h3>
              <p className="text-gray-700 dark:text-gray-300 mb-6">
                정말{' '}
                <span className="font-bold text-red-600 dark:text-red-400">
                  {amount.toLocaleString()}원
                </span>
                을 취소하시겠습니까?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={handleConfirmCancel}
                  disabled={isLoading}
                  className="flex-1 px-8 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed text-base font-medium"
                >
                  {isLoading ? '처리 중...' : '확인'}
                </button>
                <button
                  onClick={handleBack}
                  disabled={isLoading}
                  className="flex-1 px-8 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-base font-medium"
                >
                  뒤로
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
