/**
 * @author 이승우
 * @description 개인정보처리방침 모달 컴포넌트 속성
 * @interface PrivacyPolicyModalProps
 * @property {boolean} open 모달 열림 상태
 * @property {Function} onClose 닫기 함수
 */
export interface PrivacyPolicyModalProps {
  open: boolean;
  onClose: () => void;
}
