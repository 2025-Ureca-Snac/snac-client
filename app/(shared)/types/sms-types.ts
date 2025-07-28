/**
 * @author 이승우
 * @description SMS 검증 매개변수 인터페이스
 * @interface SMSValidationParams
 * @property {string} message - SMS 메시지
 * @property {string} phoneNumber - 휴대폰 번호
 */
export interface SMSValidationParams {
  message: string;
  phoneNumber: string;
}

/**
 * @author 이승우
 * @description SMS 지원 정보 인터페이스
 * @interface SMSSupportInfo
 * @property {boolean} webOTP - Web OTP API 지원 여부
 * @property {boolean} credentials - Credentials API 지원 여부
 * @property {boolean} autocomplete - HTML autocomplete 지원 여부
 * @property {string} browser - 브라우저 정보
 * @property {string} platform - 플랫폼 정보
 * @property {boolean} isMobile - 모바일 여부
 * @property {boolean} isHTTPS - HTTPS 여부
 */
export interface SMSSupportInfo {
  webOTP: boolean;
  credentials: boolean;
  autocomplete: boolean;
  browser: string;
  platform: string;
  isMobile: boolean;
  isHTTPS: boolean;
}
