/**
 * @author 이승우
 * @description 단골 목록 모달 컴포넌트 속성
 * @interface FavoriteListModalProps
 * @property {boolean} open 모달 열림 상태
 * @property {Function} onClose 닫기 함수
 * @property {string[]} favorites 단골 목록
 */
export interface FavoriteListModalProps {
  open: boolean;
  onClose: () => void;
  favorites: string[];
}
