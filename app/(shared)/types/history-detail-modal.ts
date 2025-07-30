import type { HistoryItem } from './history-card';

/**
 * @author 이승우
 * @description 거래 내역 상세 모달 컴포넌트 속성
 * @interface HistoryDetailModalProps
 * @property {boolean} open 모달 열림 상태
 * @property {Function} onClose 닫기 함수
 * @property {HistoryItem | null} item 거래 아이템
 * @property {'purchase' | 'sales'} type 거래 타입
 */
export interface HistoryDetailModalProps {
  open: boolean;
  onClose: () => void;
  item: HistoryItem | null;
  type: 'purchase' | 'sales';
}
