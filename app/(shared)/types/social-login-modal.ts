/**
 * @author 이승우
 * @description 소셜 로그인 모달 props 인터페이스
 * @interface SocialLoginModalProps
 * @property {boolean} open 모달 열림 상태
 * @property {Function} onClose 닫기 함수
 * @property {Function} onSubmit 제출 함수
 */
export interface SocialLoginModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit?: (provider: string, isLinked: boolean) => void;
}
