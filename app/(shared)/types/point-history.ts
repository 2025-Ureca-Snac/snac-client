/**
 * @author 이승우
 * @description 자산 유형
 */
export type AssetType = 'POINT' | 'MONEY';

/**
 * @author 이승우
 * @description 머니 카테고리 (백엔드 enum과 일치)
 */
export type MoneyCategory = '충전' | '머니 구매' | '판매' | '취소' | '정산';

/**
 * @author 이승우
 * @description 포인트 카테고리 (백엔드 enum과 일치)
 */
export type PointCategory = '적립' | '포인트 사용' | '취소';

/**
 * @author 이승우
 * @description 포인트/머니 내역 아이템 (API 응답 구조)
 * @interface PointHistoryItem
 * @property {number} id 내역 아이템 ID
 * @property {string} title 내역 제목
 * @property {string} category 내역 카테고리
 * @property {string} signedAmount 부호가 포함된 금액 (양수: 충전, 음수: 사용)
 * @property {string | number} balanceAfter 거래 후 잔액 (백엔드에서 문자열로 반환될 수 있음)
 * @property {string} createdAt 내역 날짜
 * @property {string | null} paymentKey 결제 키 (null일 수 있음)
 */
export interface PointHistoryItem {
  id: number;
  title: string;
  category: string;
  signedAmount: string;
  balanceAfter: string | number;
  createdAt: string;
  paymentKey: string | null;
}

/**
 * @author 이승우
 * @description 포인트/머니 잔액 응답
 * @interface BalanceResponse
 * @property {number} point 포인트 잔액
 * @property {number} money 머니 잔액
 */
export interface BalanceResponse {
  point: number;
  money: number;
}

/**
 * @author 이승우
 * @description 포인트/머니 내역 응답
 * @interface PointHistoryResponse
 * @property {PointHistoryItem[]} contents 내역 목록
 * @property {boolean} hasNext 다음 페이지 존재 여부
 */
export interface PointHistoryResponse {
  contents: PointHistoryItem[];
  hasNext: boolean;
}
