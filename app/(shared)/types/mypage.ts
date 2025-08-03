/**
 * @author 이승우
 * @description 단골 목록 아이템
 */
export interface FavoriteItem {
  memberId: number;
  nickname: string;
}

/**
 * @author 이승우
 * @description 단골 목록 API 응답
 */
export interface FavoriteResponse {
  contents: FavoriteItem[];
}
