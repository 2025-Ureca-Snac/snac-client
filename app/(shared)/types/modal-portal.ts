/**
 * @author 이승우
 * @description 모달 포탈 컴포넌트 속성
 * @interface ModalPortalProps
 * @property {React.ReactNode} children 모달 포탈 컴포넌트 자식 요소
 * @property {boolean} isOpen 모달 포탈 컴포넌트 열림 여부
 * @property {Function} onClose 모달 포탈 컴포넌트 닫기 핸들러
 * @property {string} className 모달 포탈 컴포넌트 클래스 이름( tailwindcss 클래스 이름 )
 */
export interface ModalPortalProps {
  children: React.ReactNode;
  isOpen: boolean;
  onClose?: () => void;
  className?: string;
}
