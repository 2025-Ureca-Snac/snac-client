/**
 * @author 이승우
 * @description 결제 관련 계산 유틸리티 함수들
 */

/**
 * 사용 가능한 최대 스낵 포인트 계산
 * @param snackPoints 보유 스낵 포인트
 * @param productPrice 상품 가격
 * @returns 사용 가능한 최대 스낵 포인트
 */
export const getMaxUsableSnackPoints = (
  snackPoints: number,
  productPrice: number
): number => {
  return Math.min(snackPoints, productPrice);
};

/**
 * 최종 결제 금액 계산
 * @param productPrice 상품 가격
 * @param snackPointsToUse 사용할 스낵 포인트
 * @returns 최종 결제 금액
 */
export const getFinalAmount = (
  productPrice: number,
  snackPointsToUse: number
): number => {
  return Math.max(0, productPrice - snackPointsToUse);
};

/**
 * 총 사용 가능한 금액 계산 (스낵 머니 + 스낵 포인트)
 * @param snackMoney 보유 스낵 머니
 * @param snackPoints 보유 스낵 포인트
 * @returns 총 사용 가능한 금액
 */
export const getTotalAvailable = (
  snackMoney: number,
  snackPoints: number
): number => {
  return snackMoney + snackPoints;
};

/**
 * 부족한 금액 계산
 * @param requiredAmount 필요 금액
 * @param totalAvailable 총 사용 가능한 금액
 * @returns 부족한 금액
 */
export const getShortageAmount = (
  requiredAmount: number,
  totalAvailable: number
): number => {
  return Math.max(0, requiredAmount - totalAvailable);
};

/**
 * 결제 후 스낵 머니 잔액 계산
 * @param currentSnackMoney 현재 스낵 머니
 * @param finalAmount 최종 결제 금액
 * @returns 결제 후 스낵 머니 잔액
 */
export const getRemainingSnackMoney = (
  currentSnackMoney: number,
  finalAmount: number
): number => {
  return currentSnackMoney - finalAmount;
};

/**
 * 결제 후 스낵 포인트 잔액 계산
 * @param currentSnackPoints 현재 스낵 포인트
 * @param snackPointsToUse 사용할 스낵 포인트
 * @returns 결제 후 스낵 포인트 잔액
 */
export const getRemainingSnackPoints = (
  currentSnackPoints: number,
  snackPointsToUse: number
): number => {
  return currentSnackPoints - snackPointsToUse;
};
