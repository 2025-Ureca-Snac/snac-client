/**
 * @author 이승우
 * @description 전화번호 변경 모달 컴포넌트 속성
 * @interface ChangePhoneModalProps
 * @property {boolean} open 모달 열림 상태
 * @property {Function} onClose 닫기 함수
 * @property {Function} onSubmit 제출 함수
 */
export interface ChangePhoneModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit?: (password: string, next: string, code: string) => void;
}
