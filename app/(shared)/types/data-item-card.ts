/**
 * @author 이승우
 * @description 데이터 아이템 카드 컴포넌트 속성
 * @interface DataItemCardProps
 * @property {string} imageUrl 이미지 URL
 * @property {string} title 제목
 * @property {number} price 가격
 * @property {Function} onClickBuy 구매 함수
 * @property {boolean} isNew 새 상품 여부
 * @property {string} newBadgeText 뱃지 텍스트
 * @property {string} buyButtonText 버튼 텍스트
 */
export interface DataItemCardProps {
  imageUrl: string;
  title: string;
  price: number;
  onClickBuy: () => void;
  isNew?: boolean;
  newBadgeText?: string;
  buyButtonText?: string;
}
