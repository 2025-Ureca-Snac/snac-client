/**
 * @author 이승우
 * @description 충전 확인 모달 컴포넌트 타입
 * @interface RechargeConfirmModalProps
 * @property {boolean} open: 모달 열림 여부
 * @property {function} onClose: 모달 닫기 이벤트
 * @property {function} onConfirm: 충전 확인 이벤트
 * @property {number} snackMoney: 스낵 머니 금액
 * @property {number} snackPoints: 스낵 포인트 금액
 * @property {number} shortage: 부족한 금액
 */
export interface RechargeConfirmModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  snackMoney: number;
  snackPoints: number;
  shortage: number;
}
