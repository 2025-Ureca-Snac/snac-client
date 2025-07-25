import { RechargeConfirmModalProps } from '../types/recharge-confirm-modal';

/**
 * @author 이승우
 * @description 충전 확인 모달 컴포넌트
 * @params {@link RechargeConfirmModalProps}: 충전 확인 모달 컴포넌트 타입
 */
export default function RechargeConfirmModal({
  open,
  onClose,
  onConfirm,
  snackMoney,
  snackPoints,
  shortage,
}: RechargeConfirmModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          스낵 충전 필요
        </h3>

        <div className="space-y-3 mb-6">
          <p className="text-gray-600">
            스낵 머니({snackMoney.toLocaleString()}원) + 스낵 포인트(
            {snackPoints.toLocaleString()}원)가 부족합니다.
          </p>

          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-red-800 font-medium">
              부족한 금액: {shortage.toLocaleString()}원
            </p>
          </div>

          <p className="text-gray-600">스낵 충전하러 가시겠습니까?</p>
        </div>

        <div className="flex space-x-3">
          <button
            onClick={onClose}
            className="flex-1 py-2 px-4 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
          >
            취소
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2 px-4 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors"
          >
            충전하기
          </button>
        </div>
      </div>
    </div>
  );
}
