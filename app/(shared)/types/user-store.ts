/**
 * @description 사용자 알림 설정 인터페이스
 * @interface UserNotificationPreferences
 * @property {boolean} email 이메일 알림 설정
 * @property {boolean} push 푸시 알림 설정
 * @property {boolean} sms 문자 알림 설정
 */
export interface UserNotificationPreferences {
  email: boolean;
  push: boolean;
  sms: boolean;
}

/**
 * @description 사용자 환경설정 인터페이스
 * @interface UserPreferences
 * @property {string} theme 테마
 * @property {string} language 언어
 * @property {UserNotificationPreferences} notifications 알림 설정
 */
export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  language: 'ko' | 'en';
  notifications: UserNotificationPreferences;
}

/**
 * @author 이승우
 * @description 사용자 프로필 정보
 * @interface UserProfile
 * @property {string} id 사용자 아이디
 * @property {string} email 사용자 이메일
 * @property {string} name 사용자 이름
 * @property {string} nickname 사용자 닉네임
 * @property {string} phone 사용자 전화번호
 * @property {Date} birthDate 사용자 생년월일
 * @property {number} points 사용자 포인트
 * @property {number} money 사용자 돈
 * @property {UserPreferences} preferences 사용자 설정 정보( 테마, 언어, 알림 )
 * @property {Date} createdAt 사용자 생성 일시
 * @property {Date} updatedAt 사용자 수정 일시
 */
export interface UserProfile {
  id: string;
  email: string;
  name: string;
  nickname: string;
  phone: string;
  birthDate: Date;
  points: number;
  money: number;
  preferences: UserPreferences;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * @author 이승우
 * @description 사용자 상태
 * @interface UserState
 * @property {UserProfile | null} profile 사용자 프로필
 * @property {boolean} isLoading 로딩 상태
 * @property {string | null} error 에러 메시지
 *
 * @property {Function} setProfile 프로필 설정 액션
 * @property {Function} updateProfile 프로필 업데이트 액션
 * @property {Function} updatePreferences 설정 업데이트 액션
 * @property {Function} setLoading 로딩 상태 설정 액션
 * @property {Function} setError 에러 설정 액션
 * @property {Function} clearProfile 프로필 초기화 액션
 */
export interface UserState {
  // 상태
  profile: UserProfile | null;
  isLoading: boolean;
  error: string | null;

  // 액션
  setProfile: (profile: UserProfile) => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  updatePreferences: (preferences: Partial<UserPreferences>) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearProfile: () => void;
}
