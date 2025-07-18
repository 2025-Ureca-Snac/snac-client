/**
 * @description 매칭 페이지에서 사용하는 사용자 정보 타입
 * @param id 사용자 고유 ID
 * @param type 거래 유형 (구매자/판매자)
 * @param name 사용자 이름
 * @param carrier 통신사
 * @param data 데이터 용량 (GB 단위, 1 = 1GB, 0.5 = 500MB)
 * @param price 가격 (원 단위)
 */
export interface User {
  id: number;
  type: 'buyer' | 'seller';
  name: string;
  carrier: string;
  data: number; // GB 단위 (1 = 1GB, 0.5 = 500MB)
  price: number; // 원 단위
}

/**
 * @description 필터 옵션 타입
 */
export interface Filters {
  transactionType: string[];
  carrier: string[];
  dataAmount: string[];
  price: string[];
}

/**
 * @description 카테고리 필터 옵션 타입
 */
export interface CategoryOption {
  id: string;
  label: string;
}
