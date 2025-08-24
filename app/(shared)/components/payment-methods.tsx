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
            ? 'border-primary bg-primary/10'
            : 'border-border bg-card hover:border-primary hover:bg-muted'
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
            ? 'border-primary bg-primary/10'
            : 'border-border bg-card hover:border-primary hover:bg-muted'
        }`}
      >
        <span className="text-sm text-foreground">스낵으로 결제하기</span>
      </button>
    </div>
  );
}
