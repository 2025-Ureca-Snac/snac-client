import axios from 'axios';
import { useAuthStore } from '../stores/auth-store';

/**
 * @author 이승우
 * @description API URL 설정
 */
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

/**
/**
 * @author 이승우
 * @description axios 인스턴스 생성( {@link API_BASE_URL}, timeout(10초), headers(Content-Type: application/json), withCredentials=true )
 * @example
 * // GET 요청 예시
 * const response = await api.get('/health');
 * 
 * // POST 요청 예시
 * const response = await api.post('/join', { email, password });
 */
export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// 요청 인터셉터: 매 요청마다 최신 토큰을 헤더에 추가
api.interceptors.request.use((config) => {
  if (
    typeof window !== 'undefined' &&
    !(config.headers && 'Authorization' in config.headers)
  ) {
    const token = useAuthStore.getState().token;
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

/**
 * @author 이승우
 * @description 에러 처리 유틸리티
 * @param error 에러
 * @returns 에러 메시지
 */
export const handleApiError = (error: unknown): string => {
  // axios 에러인지 확인
  if (error && typeof error === 'object' && 'response' in error) {
    const axiosError = error as {
      response?: { status: number; data: unknown };
    };

    if (axiosError.response) {
      const { status, data } = axiosError.response;

      switch (status) {
        case 400:
          return (
            (data as { message?: string })?.message || '잘못된 요청입니다.'
          );
        case 401:
          return '인증이 필요합니다.';
        case 403:
          return '접근 권한이 없습니다.';
        case 404:
          return '요청한 리소스를 찾을 수 없습니다.';
        case 500:
          return '서버 오류가 발생했습니다.';
        default:
          return (
            (data as { message?: string })?.message ||
            '알 수 없는 오류가 발생했습니다.'
          );
      }
    } else if ('request' in error) {
      // 요청은 보냈지만 응답을 받지 못한 경우
      return '서버에 연결할 수 없습니다.';
    }
  }

  // 요청 자체를 보내지 못한 경우
  return error instanceof Error
    ? error.message
    : '네트워크 오류가 발생했습니다.';
};

export default api;
