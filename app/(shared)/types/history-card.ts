/**
 * @author 이승우
 * @description 거래 내역 아이템
 * @interface HistoryItem
 * @property {number} id 거래 아이템 ID
 * @property {string} date 거래 날짜
 * @property {string} title 거래 제목
 * @property {number} price 거래 가격
 * @property {string} status 거래 상태
 * @property {string} transactionNumber 거래 번호
 * @property {string} carrier 거래 통신사
 * @property {string} dataAmount 거래 데이터 양
 * @property {string} phoneNumber 거래 전화번호
 */
export interface HistoryItem {
  id: number;
  date: string;
  title: string;
  price: number;
  status:
    | 'purchasing'
    | 'selling'
    | 'completed'
    | 'BUY_REQUESTED'
    | 'SELL_REQUESTED'
    | 'ACCEPTED'
    | 'PAYMENT_CONFIRMED'
    | 'PAYMENT_CONFIRMED_ACCEPTED'
    | 'DATA_SENT'
    | 'COMPLETED'
    | 'CANCELED'
    | 'AUTO_REFUND'
    | 'AUTO_PAYOUT';
  transactionNumber?: string;
  carrier?: string;
  partnerId?: number;
  partnerFavorite: boolean;
  partnerNickname: string;
  dataAmount?: string;
  phoneNumber?: string;
  cancelReason?: string;
  cancelRequested: boolean;
  cancelRequestReason: string | null;
  cancelRequestStatus: string | null;
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
