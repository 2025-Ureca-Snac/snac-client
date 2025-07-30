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

/**
 * @description 날짜가 오늘 날짜인지 확인
 * @param dateString 날짜 문자열
 * @returns 오늘 날짜이면 true, 아니면 false
 */
export const isToday = (dateString: string): boolean => {
  const today = new Date();
  const itemDate = new Date(dateString);

  return (
    today.getFullYear() === itemDate.getFullYear() &&
    today.getMonth() === itemDate.getMonth() &&
    today.getDate() === itemDate.getDate()
  );
};

/**
 * @author 이승우
 * @description 닉네임 변경 가능까지 남은 시간을 계산
 * @param {Date} lastUpdatedAt 마지막 닉네임 변경 시간
 * @returns {number} 남은 시간 (밀리초), 0 이하면 변경 가능
 */
export function getRemainingTimeForNicknameChange(lastUpdatedAt: Date): number {
  const now = new Date();
  const nextAvailableTime = new Date(
    lastUpdatedAt.getTime() + 24 * 60 * 60 * 1000
  ); // 24시간 후
  return Math.max(0, nextAvailableTime.getTime() - now.getTime());
}

/**
 * @author 이승우
 * @description 남은 시간을 시:분:초 형식으로 변환
 * @param {number} remainingTimeMs 남은 시간 (밀리초)
 * @returns {string} "HH:MM:SS" 형식의 문자열
 */
export function formatRemainingTime(remainingTimeMs: number): string {
  if (remainingTimeMs <= 0) return '00:00:00';

  const hours = Math.floor(remainingTimeMs / (1000 * 60 * 60));
  const minutes = Math.floor(
    (remainingTimeMs % (1000 * 60 * 60)) / (1000 * 60)
  );
  const seconds = Math.floor((remainingTimeMs % (1000 * 60)) / 1000);

  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}
