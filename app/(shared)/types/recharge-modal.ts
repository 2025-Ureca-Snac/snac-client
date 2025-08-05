/**
 * @author 이승우
 * @description 충전 모달 컴포넌트 타입
 * @interface RechargeModalProps
 * @property {boolean} open: 모달 열림 여부
 * @property {function} onClose: 모달 닫기 이벤트
 * @property {number} currentMoney: 현재 스낵머니
 * @property {number} shortage: 부족한 금액 (선택적)
 */
export interface RechargeModalProps {
  open: boolean;
  onClose: () => void;
  currentMoney: number;
  shortage?: number; // 부족한 금액 (선택적)
  onRefreshData?: () => void; // 데이터 새로고침 함수 (선택적)
}
