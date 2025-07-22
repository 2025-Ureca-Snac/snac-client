/**
 * @description 테마 타입
 * @interface ThemeType
 * @enum {string} light 라이트 모드
 * @enum {string} dark 다크 모드
 * @enum {string} auto 시스템 설정
 */
export type ThemeType = 'light' | 'dark' | 'auto';

/**
 * @description ThemeModal 컴포넌트의 props 타입
 * @interface ThemeModalProps
 * @property {boolean} open 모달 열림 상태
 * @property {Function} onClose 모달 닫기 함수
 * @property {ThemeType} currentTheme 현재 테마
 * @property {Function} onThemeChange 테마 변경 함수
 */
export interface ThemeModalProps {
  open: boolean;
  onClose: () => void;
  currentTheme: ThemeType;
  onThemeChange: (theme: ThemeType) => void;
}

/**
 * @description ThemeOptionButton 컴포넌트의 props 타입
 * @interface ThemeOptionButtonProps
 * @property {string} label 버튼 라벨
 * @property {boolean} selected 선택 여부
 * @property {string} colorClass 버튼 색상 클래스
 * @property {Function} onClick 버튼 클릭 함수
 * @property {string} checkColorClass 선택 시 체크 색상 클래스
 */
export interface ThemeOptionButtonProps {
  label: string;
  selected: boolean;
  colorClass: string;
  onClick: () => void;
  checkColorClass: string;
}
