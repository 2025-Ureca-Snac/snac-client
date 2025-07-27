/**
 * @author 이승우
 * @description 휴대폰 번호 정규화
 * @params phoneNumber 휴대폰 번호
 * @returns 정규화된 휴대폰 번호
 */
export const normalizePhoneNumber = (phoneNumber: string): string => {
  return phoneNumber.replace(/[^0-9]/g, '');
};
