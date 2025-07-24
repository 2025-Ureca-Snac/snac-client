/**
 * @author 이승우
 * @description 결제 방법 컴포넌트 타입
 * @interface PaymentMethodsProps
 * @property {string} paymentMethod: 결제 방법(toss로 충전 후 결제, 스낵 결제)
 * @property {function} onPaymentMethodChange: 결제 방법 변경 이벤트
 * @property {boolean} showSnackPayment: 스낵 결제 모드 여부 (스낵 머니 + 스낵 포인트)
 */
export interface PaymentMethodsProps {
  paymentMethod: string;
  onPaymentMethodChange: (method: string) => void;
  showSnackPayment: boolean;
}
