/**
 * @author 이승우
 * @description API 응답 타입 정의
 * @interface ApiResponse
 * @property {string} code 응답 코드
 * @property {string} status 응답 상태
 * @property {string} message 응답 메시지
 * @property {T} data 응답 데이터
 * @property {string} timestamp 응답 시간
 */
export interface ApiResponse<T = unknown> {
  code: string;
  status: string;
  message: string;
  data: T;
  timestamp: string;
}
