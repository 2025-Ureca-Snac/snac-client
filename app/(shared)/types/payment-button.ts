/**
 * @author 이승우
 * @description 결제 컴포넌트 타입
 * @interface PaymentButtonProps
 * @property {number} snackMoney: 스낵머니 금액
 * @property {number} snackPoints: 스낵포인트 금액
 * @property {number} finalAmount: 최종 결제 금액
 * @property {boolean} showSnackPayment: 스낵머니 결제 여부
 * @property {function} onPaymentClick: 결제 클릭 이벤트
 */
export interface PaymentButtonProps {
  snackMoney: number;
  snackPoints: number;
  finalAmount: number;
  showSnackPayment: boolean; // 스낵 결제 모드 (스낵 머니 + 스낵 포인트)
  onPaymentClick: () => void;
}
