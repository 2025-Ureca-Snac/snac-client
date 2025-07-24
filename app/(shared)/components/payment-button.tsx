import { PaymentButtonProps } from '../types/payment-button';

/**
 * @author 이승우
 * @description 결제 버튼 컴포넌트 (일반 결제 vs 스낵 결제)
 * @params {@link PaymentButtonProps}: 결제 컴포넌트 타입
 */
export default function PaymentButton({
  snackMoney,
  snackPoints,
  finalAmount,
  showSnackPayment,
  onPaymentClick,
}: PaymentButtonProps) {
  const totalAvailable = snackMoney + snackPoints;
  const isInsufficient = showSnackPayment && totalAvailable < finalAmount;

  return (
    <button
      className={`w-full mt-6 py-3 px-4 rounded-md transition-colors font-medium ${
        isInsufficient
          ? 'bg-gray-400 cursor-not-allowed'
          : 'bg-gray-900 text-white hover:bg-gray-800'
      }`}
      onClick={onPaymentClick}
      disabled={isInsufficient}
    >
      {showSnackPayment
        ? isInsufficient
          ? '포인트 부족'
          : '결제하기'
        : '결제'}
    </button>
  );
}
