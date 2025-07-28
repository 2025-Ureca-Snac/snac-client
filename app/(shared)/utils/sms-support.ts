import {
  getBrowserInfo,
  isMobileDevice,
  isHTTPS,
  getPlatform,
} from './browser-detection';
import { SMSSupportInfo } from '../types/sms-types';

/**
 * @author 이승우
 * @description SMS 자동완성 지원 여부 확인
 * @returns 지원 정보 객체
 */
export const checkSMSSupport = (): SMSSupportInfo => {
  const support: SMSSupportInfo = {
    webOTP: false,
    credentials: false,
    autocomplete: true, // HTML autocomplete는 대부분 지원
    browser: '',
    platform: '',
    isMobile: false,
    isHTTPS: false,
  };

  // 브라우저 정보
  const userAgent = navigator.userAgent;
  support.browser = getBrowserInfo(userAgent);
  support.platform = getPlatform();
  support.isMobile = isMobileDevice(userAgent);
  support.isHTTPS = isHTTPS();

  // Web OTP API 지원 확인
  support.webOTP = 'OTPCredential' in window;

  // Credentials API 지원 확인
  support.credentials = 'credentials' in navigator;

  return support;
};

/**
 * @author 이승우
 * @description SMS 자동완성 사용 가능 여부 확인
 * @returns 사용 가능 여부
 */
export const canUseSMSAutocomplete = (): boolean => {
  const support = checkSMSSupport();
  return support.isMobile && support.isHTTPS;
};
