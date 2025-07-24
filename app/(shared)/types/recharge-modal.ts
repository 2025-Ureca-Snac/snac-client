/**
 * @author 이승우
 * @description 충전 모달 컴포넌트 타입
 * @interface RechargeModalProps
 * @property {boolean} open: 모달 열림 여부
 * @property {function} onClose: 모달 닫기 이벤트
 * @property {number} currentPoints: 현재 스낵 포인트
 * @property {number} shortage: 부족한 금액 (선택적)
 * @property {function} onRechargeSuccess: 충전 성공 이벤트
 */
export interface RechargeModalProps {
  open: boolean;
  onClose: () => void;
  currentPoints: number;
  shortage?: number; // 부족한 금액 (선택적)
  onRechargeSuccess?: (rechargedAmount: number) => void;
}
