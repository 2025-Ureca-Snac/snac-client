// 공통 타입 정의
export type PriceUnit = 'snack' | 'won';

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
}

export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

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
  disableDrag?: boolean;
}

// Store 타입들
export * from './auth-store';
export * from './user-store';
export * from './modal-store';

// 훅 타입들
export * from './timer';
export * from './theme';

// 모달 타입들
export * from './modal-portal';
export * from './change-password-modal';
export * from './change-phone-modal';
export * from './change-nickname-modal';
export * from './social-login-modal';
export * from './service-guide-modal';
export * from './privacy-policy-modal';
export * from './favorite-list-modal';
export * from './history-detail-modal';
