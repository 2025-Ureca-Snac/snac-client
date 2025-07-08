// API 관련 상수
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

// 앱 관련 상수
export const APP_NAME = 'Snac';
export const APP_DESCRIPTION = 'Share Network Allocation & Commerce';

// 로컬 스토리지 키
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_PREFERENCES: 'user_preferences',
} as const;

// 페이지 경로
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
} as const;
