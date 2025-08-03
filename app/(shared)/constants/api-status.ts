// API 상태 코드 상수
export const API_STATUS = {
  OK: 'OK',
  BAD_REQUEST: 'BAD_REQUEST',
  GATEWAY_TIMEOUT: 'GATEWAY_TIMEOUT',
} as const;

// 업로드 오류 메시지 상수
export const UPLOAD_ERROR_MESSAGE = {
  DEFAULT: '이미지 업로드 중 오류가 발생했습니다. 다시 시도해주세요.',
  TIMEOUT: '이미지 검증 중에 문제가 발생했습니다. 잠시 후 다시 시도해주세요.',
  BAD_IMAGE: '다른 사진을 보내주세요.',
} as const;

export type ApiStatus = (typeof API_STATUS)[keyof typeof API_STATUS];
export type UploadErrorMessage =
  (typeof UPLOAD_ERROR_MESSAGE)[keyof typeof UPLOAD_ERROR_MESSAGE];
