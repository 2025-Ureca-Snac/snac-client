import Image from 'next/image';
import { PaymentMethodsProps } from '../types/payment-methods';
import { PAYMENT_METHODS } from '../constants/payment';

/**
 * @author 이승우
 * @description 결제 방법 선택 컴포넌트 (토스페이먼츠 vs 스낵 결제)
 * @params {@link PaymentMethodsProps}: 결제 방법 컴포넌트 타입
 */
export default function PaymentMethods({
  paymentMethod,
  onPaymentMethodChange,
  showSnackPayment,
}: PaymentMethodsProps) {
  if (showSnackPayment) return null;

  return (
    <div className="space-y-3 mb-6">
      <button
        type="button"
        onClick={() => {
          console.log('토스페이먼츠 선택');
          onPaymentMethodChange(PAYMENT_METHODS.TOSS);
        }}
        className={`w-full p-3 border rounded-lg flex items-center justify-center transition-colors ${
          paymentMethod === PAYMENT_METHODS.TOSS
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
      >
        <Image
          src="/toss.svg"
          alt="Toss Pay"
          width={240}
          height={48}
          className="mr-2"
        />
      </button>

      <button
        type="button"
        onClick={() => {
          console.log('스낵 포인트 선택');
          onPaymentMethodChange(PAYMENT_METHODS.SNACK);
        }}
        className={`w-full p-3 border rounded-lg flex items-center justify-center transition-colors ${
          paymentMethod === PAYMENT_METHODS.SNACK
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
      >
        <span className="text-sm text-gray-700">스낵으로 결제하기</span>
      </button>
    </div>
  );
}
