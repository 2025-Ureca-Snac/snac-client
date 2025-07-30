/**
 * @author 이승우
 * @description 자산 유형
 */
export type AssetType = 'POINT' | 'MONEY';

/**
 * @author 이승우
 * @description 포인트/머니 내역 아이템 (API 응답 구조)
 * @interface PointHistoryItem
 * @property {number} id 내역 아이템 ID
 * @property {string} title 내역 제목
 * @property {string} category 내역 카테고리
 * @property {string} signedAmount 부호가 포함된 금액 (양수: 충전, 음수: 사용)
 * @property {number} balanceAfter 거래 후 잔액
 * @property {string} createdAt 내역 날짜
 * @property {string | null} paymentKey 결제 키 (null일 수 있음)
 */
export interface PointHistoryItem {
  id: number;
  title: string;
  category: string;
  signedAmount: string;
  balanceAfter: number;
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
 * @property {PointHistoryItem[]} historyList 내역 목록
 */
export interface PointHistoryResponse {
  contents: PointHistoryItem[];
}
