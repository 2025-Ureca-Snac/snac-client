'use client';

import { api } from '../../(shared)/utils/api';

/**
 * @author 김현훈
 * @description 테스트 환경용 토큰 관리 유틸리티
 * @warning 이 코드는 테스트 환경에서만 사용하세요. 프로덕션에서는 httpOnly 쿠키를 사용하세요.
 */
export const testTokenManager = {
  /**
   * 토큰을 localStorage에 저장하고 axios 헤더에 설정
   */
  setToken: (token: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('test_access_token', token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  },

  /**
   * localStorage에서 토큰을 가져옴
   */
  getToken: (): string | null => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('test_access_token');
    }
    return null;
  },

  /**
   * 토큰을 제거하고 axios 헤더에서도 제거
   */
  removeToken: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('test_access_token');
      delete api.defaults.headers.common['Authorization'];
    }
  },

  /**
   * 앱 시작 시 저장된 토큰이 있다면 axios 헤더에 설정
   */
  initializeToken: () => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('test_access_token');
      if (token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      }
    }
  },

  /**
   * 토큰이 유효한지 확인 (기본적인 형태 검사)
   */
  isValidToken: (token: string): boolean => {
    return !!(token && token.length > 10); // 기본적인 검증
  },

  /**
   * 토큰 정보를 안전하게 표시 (처음 20자만)
   */
  getTokenPreview: (): string => {
    const token = localStorage.getItem('test_access_token');
    if (token) {
      return `${token.slice(0, 20)}...`;
    }
    return '토큰 없음';
  },
};

// 테스트 환경에서만 자동 초기화
if (typeof window !== 'undefined') {
  testTokenManager.initializeToken();
}
