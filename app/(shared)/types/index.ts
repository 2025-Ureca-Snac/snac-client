// 공통 타입 정의
export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
}

export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export interface VerificationInputProps {
  label: string;
  id: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  helpText?: string;
  showHelpText?: boolean;
  codeLength?: number;
  onCodeChange?: (code: string) => void;
  codeDisabled?: boolean;
  codeValue?: string;
  onVerify?: () => void;
  verifyDisabled?: boolean;
}

export type SearchModalType = 'id' | 'password' | null;

export interface SearchModalProps {
  isOpen: SearchModalType;
  setIsOpen: React.Dispatch<React.SetStateAction<SearchModalType>>;
}

// TabNavigation 타입들
export interface Tab {
  id: string;
  label: string;
}

/**
 * @author 이승우
 * @description 탭 네비게이션 컴포넌트 타입
 * @interface TabNavigationProps
 * @property {Tab[]} tabs 탭 목록
 * @property {string} activeTab 현재 활성화된 탭 ID
 * @property {Function} onTabChange 탭 변경 핸들러
 * @property {string} className 추가 클래스 이름
 * @property {string} activeTextColor 활성 탭 텍스트 색상
 * @property {string} inactiveTextColor 비활성 탭 텍스트 색상
 * @property {string} underlineColor 언더라인 색상
 */
export interface TabNavigationProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  className?: string;
  activeTextColor?: string;
  inactiveTextColor?: string;
  underlineColor?: string;
}

// Store 타입들
export * from './auth-store';
export * from './user-store';
export * from './modal-store';
