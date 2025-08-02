/**
 * @author 이승우
 * @description 단골 목록 모달 컴포넌트 속성
 * @interface FavoriteListModalProps
 * @property {boolean} open 모달 열림 상태
 * @property {Function} onClose 닫기 함수
 * @property {Array<{memberId: number, nickname: string}>} favorites 단골 목록
 * @property {Function} onDelete 단골 삭제 함수
 */
export interface FavoriteListModalProps {
  open: boolean;
  onClose: () => void;
  favorites: Array<{ memberId: number; nickname: string }>;
  onDelete?: (memberId: number, nickname: string) => void;
}
