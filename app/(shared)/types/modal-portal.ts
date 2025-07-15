/**
 * @author 이승우
 * @description 모달 포탈 컴포넌트 속성
 * @param children 모달 포탈 컴포넌트 자식 요소
 * @param isOpen 모달 포탈 컴포넌트 열림 여부
 * @param onClose 모달 포탈 컴포넌트 닫기 핸들러
 * @param className 모달 포탈 컴포넌트 클래스 이름( tailwindcss 클래스 이름 )
 */
export interface ModalPortalProps {
  children: React.ReactNode;
  isOpen: boolean;
  onClose?: () => void;
  className?: string;
}
