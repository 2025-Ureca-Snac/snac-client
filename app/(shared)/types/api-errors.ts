export enum ApiErrorType {
  PAYLOAD_TOO_LARGE = 413,
  NOT_FOUND = 404,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  INTERNAL_SERVER_ERROR = 500,
  NETWORK_ERROR = 'NETWORK_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

export interface ApiErrorInfo {
  type: ApiErrorType;
  message: string;
  userMessage: string;
}

export const API_ERROR_MESSAGES: Record<ApiErrorType, ApiErrorInfo> = {
  [ApiErrorType.PAYLOAD_TOO_LARGE]: {
    type: ApiErrorType.PAYLOAD_TOO_LARGE,
    message: 'Payload too large',
    userMessage: '파일 크기가 너무 큽니다. 5MB 이하의 파일을 선택해주세요.',
  },
  [ApiErrorType.NOT_FOUND]: {
    type: ApiErrorType.NOT_FOUND,
    message: 'Not found',
    userMessage:
      '요청한 거래 정보를 찾을 수 없습니다. 페이지를 새로고침해주세요.',
  },
  [ApiErrorType.BAD_REQUEST]: {
    type: ApiErrorType.BAD_REQUEST,
    message: 'Bad request',
    userMessage: '잘못된 요청입니다. 파일 형식을 확인해주세요.',
  },
  [ApiErrorType.UNAUTHORIZED]: {
    type: ApiErrorType.UNAUTHORIZED,
    message: 'Unauthorized',
    userMessage: '인증이 필요합니다. 다시 로그인해주세요.',
  },
  [ApiErrorType.FORBIDDEN]: {
    type: ApiErrorType.FORBIDDEN,
    message: 'Forbidden',
    userMessage: '접근 권한이 없습니다.',
  },
  [ApiErrorType.INTERNAL_SERVER_ERROR]: {
    type: ApiErrorType.INTERNAL_SERVER_ERROR,
    message: 'Internal server error',
    userMessage: '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
  },
  [ApiErrorType.NETWORK_ERROR]: {
    type: ApiErrorType.NETWORK_ERROR,
    message: 'Network error',
    userMessage: '네트워크 오류가 발생했습니다. 인터넷 연결을 확인해주세요.',
  },
  [ApiErrorType.UNKNOWN_ERROR]: {
    type: ApiErrorType.UNKNOWN_ERROR,
    message: 'Unknown error',
    userMessage: '업로드에 실패했습니다. 다시 시도해주세요.',
  },
};

export const getApiErrorInfo = (error: unknown): ApiErrorInfo => {
  if (error && typeof error === 'object' && 'response' in error) {
    const axiosError = error as {
      response?: { status: number; data: unknown };
    };

    if (axiosError.response) {
      const { status } = axiosError.response;

      switch (status) {
        case 413:
          return API_ERROR_MESSAGES[ApiErrorType.PAYLOAD_TOO_LARGE];
        case 404:
          return API_ERROR_MESSAGES[ApiErrorType.NOT_FOUND];
        case 400:
          return API_ERROR_MESSAGES[ApiErrorType.BAD_REQUEST];
        case 401:
          return API_ERROR_MESSAGES[ApiErrorType.UNAUTHORIZED];
        case 403:
          return API_ERROR_MESSAGES[ApiErrorType.FORBIDDEN];
        case 500:
          return API_ERROR_MESSAGES[ApiErrorType.INTERNAL_SERVER_ERROR];
        default:
          return API_ERROR_MESSAGES[ApiErrorType.UNKNOWN_ERROR];
      }
    } else {
      return API_ERROR_MESSAGES[ApiErrorType.NETWORK_ERROR];
    }
  }

  return API_ERROR_MESSAGES[ApiErrorType.UNKNOWN_ERROR];
};
