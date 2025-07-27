/**
 * @author 이승우
 * @description 결제 요약 컴포넌트 타입
 * @interface PaymentSummaryProps
 * @property {number} productPrice: 상품 가격
 * @property {number} snackMoney: 스낵 머니 금액
 * @property {number} snackPoints: 스낵 포인트 금액
 * @property {number} snackPointsToUse: 사용할 스낵 포인트 금액
 * @property {number} finalAmount: 최종 결제 금액
 * @property {boolean} showSnackPayment: 스낵 결제 모드 (스낵 머니 + 스낵 포인트)
 * @property {function} onSnackPointsChange: 스낵 포인트 변경 이벤트
 */
export interface PaymentSummaryProps {
  productPrice: number;
  snackMoney: number;
  snackPoints: number;
  snackPointsToUse: number;
  finalAmount: number;
  showSnackPayment: boolean; // 스낵 결제 모드 (스낵 머니 + 스낵 포인트)
  onSnackPointsChange: (value: number) => void;
}
