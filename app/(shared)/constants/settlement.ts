/**
 * @author 이승우
 * @description 정산 관련 상수 정의
 */

// 최소 정산 금액 (원)
export const MIN_SETTLEMENT_AMOUNT = 1000;

// 기본 은행 목록 (API 실패 시 사용)
export const DEFAULT_BANKS = [
  { id: 1, name: '신한은행' },
  { id: 2, name: 'KB국민은행' },
  { id: 3, name: '우리은행' },
  { id: 4, name: '하나은행' },
  { id: 5, name: 'NH농협은행' },
  { id: 6, name: '기업은행' },
  { id: 7, name: 'SC제일은행' },
  { id: 8, name: '케이뱅크' },
  { id: 9, name: '카카오뱅크' },
  { id: 10, name: '토스뱅크' },
  { id: 11, name: '새마을금고' },
  { id: 12, name: '신협' },
  { id: 13, name: '우체국' },
  { id: 14, name: '수협은행' },
  { id: 15, name: '대구은행' },
  { id: 16, name: '부산은행' },
];
