/**
 * @author 이승우
 * @description 브라우저 정보 추출
 * @param userAgent User Agent 문자열
 * @returns 브라우저 이름
 */
export const getBrowserInfo = (userAgent: string): string => {
  if (userAgent.includes('Chrome')) return 'Chrome';
  if (userAgent.includes('Safari') && !userAgent.includes('Chrome'))
    return 'Safari';
  if (userAgent.includes('Firefox')) return 'Firefox';
  if (userAgent.includes('Edge')) return 'Edge';
  return 'Unknown';
};

/**
 * @author 이승우
 * @description 모바일 기기 감지
 * @param userAgent User Agent 문자열
 * @returns 모바일 여부
 */
export const isMobileDevice = (userAgent: string): boolean => {
  return /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    userAgent
  );
};

/**
 * @author 이승우
 * @description HTTPS 환경 확인
 * @returns HTTPS 여부
 */
export const isHTTPS = (): boolean => {
  return window.location.protocol === 'https:';
};

/**
 * @author 이승우
 * @description 플랫폼 정보 가져오기
 * @returns 플랫폼 정보
 */
export const getPlatform = (): string => {
  return navigator.platform;
};
