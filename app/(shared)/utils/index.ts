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
