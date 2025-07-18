// 공통 타입 정의
export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
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
