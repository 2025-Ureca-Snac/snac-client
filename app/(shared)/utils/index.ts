// 클래스 이름 조합 유틸리티
export const cn = (...classes: (string | undefined | null | boolean)[]) => {
  return classes.filter(Boolean).join(' ');
};

// 날짜 포맷 유틸리티
export const formatDate = (date: Date | string) => {
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date));
};

// 딜레이 유틸리티
export const delay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

// 이메일 검증 유틸리티
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * @author 이승우
 * @description 날짜를 YYYYMMDD 형식으로 변환
 * @param date 날짜
 * @returns YYYYMMDD 형식의 문자열
 */
export const formatDateYYYYMMDD = (date: Date) => {
  return `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}`;
};
