export type CardCategory = 'BUY' | 'SELL';
export type PriceRange =
  | 'ALL'
  | 'P0_999'
  | 'P1000_1499'
  | 'P1500_1999'
  | 'P2000_2499'
  | 'P2500_PLUS';
export type SellStatus = 'ALL' | 'SELLING' | 'SOLD_OUT';
export type Carrier = 'SKT' | 'KT' | 'LG';

export interface GenerateQueryParamsOptions {
  cardCategory: CardCategory; // 필수
  priceRanges: PriceRange[]; // 필수
  sellStatusFilter: SellStatus; // 필수
  highRatingFirst?: boolean; // 선택
  size?: number; // 선택
  carrier?: Carrier; // 선택
  lastCardId?: number; // 선택
  lastUpdatedAt?: string; // 선택
}

export function generateQueryParams({
  cardCategory,
  priceRanges,
  sellStatusFilter,
  highRatingFirst = true,
  size = 54,
  carrier,
  lastCardId,
  lastUpdatedAt,
}: GenerateQueryParamsOptions): string {
  const params = new URLSearchParams();

  params.append('cardCategory', cardCategory);
  priceRanges.forEach((range) => params.append('priceRanges', range));
  params.append('sellStatusFilter', sellStatusFilter);

  params.append('highRatingFirst', highRatingFirst.toString());
  params.append('size', size.toString());

  if (carrier) params.append('carrier', carrier);
  if (lastCardId !== undefined)
    params.append('lastCardId', lastCardId.toString());
  if (lastUpdatedAt) params.append('lastUpdatedAt', lastUpdatedAt);

  return params.toString();
}
