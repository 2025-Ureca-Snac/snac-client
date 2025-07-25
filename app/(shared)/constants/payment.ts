/**
 * @author 이승우
 * @description 결제 관련 상수
 */

// 결제 방법
export const PAYMENT_METHODS = {
  TOSS: 'toss',
  SNACK: 'snack',
} as const;

// 결제 유형
export const PAYMENT_TYPES = {
  BUY: 'buy',
  SELL: 'sell',
} as const;

// 결제 상태
export const PAYMENT_STATUS = {
  PENDING: 'pending',
  SUCCESS: 'success',
  FAILED: 'failed',
} as const;

// 타입 정의
export type PaymentMethod =
  (typeof PAYMENT_METHODS)[keyof typeof PAYMENT_METHODS];
export type PaymentType = (typeof PAYMENT_TYPES)[keyof typeof PAYMENT_TYPES];
export type PaymentStatus =
  (typeof PAYMENT_STATUS)[keyof typeof PAYMENT_STATUS];
