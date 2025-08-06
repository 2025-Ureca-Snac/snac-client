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
          onPaymentMethodChange(PAYMENT_METHODS.TOSS);
        }}
        className={`w-full p-3 border rounded-lg flex items-center justify-center transition-colors ${
          paymentMethod === PAYMENT_METHODS.TOSS
            ? 'border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20'
            : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 hover:border-gray-400 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-600'
        }`}
      >
        <Image
          src="/toss.svg"
          alt="Toss Pay"
          width={240}
          height={48}
          className="mr-2 dark:hidden"
        />
        <Image
          src="/toss_dark.svg"
          alt="Toss Pay"
          width={240}
          height={48}
          className="mr-2 hidden dark:block"
        />
      </button>

      <button
        type="button"
        onClick={() => {
          onPaymentMethodChange(PAYMENT_METHODS.SNACK);
        }}
        className={`w-full p-3 border rounded-lg flex items-center justify-center transition-colors ${
          paymentMethod === PAYMENT_METHODS.SNACK
            ? 'border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20'
            : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 hover:border-gray-400 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-600'
        }`}
      >
        <span className="text-sm text-gray-700 dark:text-gray-300">
          스낵으로 결제하기
        </span>
      </button>
    </div>
  );
}
