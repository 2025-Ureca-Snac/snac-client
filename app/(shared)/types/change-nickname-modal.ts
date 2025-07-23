/**
 * @author 이승우
 * @description 닉네임 변경 모달 컴포넌트 속성
 * @interface ChangeNicknameModalProps
 * @property {boolean} open 모달 열림 상태
 * @property {Function} onClose 닫기 함수
 * @property {Function} onSubmit 제출 함수
 * @property {string} currentNickname 현재 닉네임
 */
export interface ChangeNicknameModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit?: (nickname: string) => void;
  currentNickname?: string;
}
