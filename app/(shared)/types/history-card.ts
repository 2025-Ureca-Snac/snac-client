/**
 * @author 이승우
 * @description 거래 내역 아이템
 * @interface HistoryItem
 * @property {number} id 거래 아이템 ID
 * @property {string} date 거래 날짜
 * @property {string} title 거래 제목
 * @property {number} price 거래 가격
 */
export interface HistoryItem {
  id: number;
  date: string;
  title: string;
  price: number;
  status: 'purchasing' | 'selling' | 'completed';
  transactionNumber?: string;
  carrier?: string;
  dataAmount?: string;
  phoneNumber?: string;
}

/**
 * @author 이승우
 * @description 거래 내역 카드 속성
 * @interface HistoryCardProps
 * @property {HistoryItem} item 거래 내역 아이템
 * @property {'purchase' | 'sales'} type 거래 유형
 * @property {Function} onClick 거래 내역 클릭 함수
 */
export interface HistoryCardProps {
  item: HistoryItem;
  type: 'purchase' | 'sales';
  onClick: (item: HistoryItem) => void;
}
