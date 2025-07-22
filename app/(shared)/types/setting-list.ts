/**
 * @author 이승우
 * @description 설정 목록 컴포넌트 속성
 * @interface SettingListProps
 * @property {Function} onItemClick 아이템 클릭 함수
 */
export interface SettingListProps {
  onItemClick?: (item: string) => void;
}
