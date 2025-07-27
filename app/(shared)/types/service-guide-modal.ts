/**
 * @author 이승우
 * @description 서비스 가이드 모달 컴포넌트 속성
 * @interface ServiceGuideModalProps
 * @property {boolean} open 모달 열림 상태
 * @property {Function} onClose 닫기 함수
 */
export interface ServiceGuideModalProps {
  open: boolean;
  onClose: () => void;
}
