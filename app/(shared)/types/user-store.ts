/**
 * @author 이승우
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
 * @author 이승우
 * @description 사용자 환경설정 인터페이스
 * @interface UserPreferences
 * @property {UserNotificationPreferences} notifications 알림 설정
 */
export interface UserPreferences {
  notifications: UserNotificationPreferences;
}

/**
 * @author 이승우
 * @description API 응답 사용자 정보 타입
 * @interface ApiUserResponse
 * @property {string} name 사용자 이름
 * @property {string} phone 사용자 전화번호
 * @property {string} birthDate 사용자 생년월일 (문자열)
 * @property {number} score 사용자 스코어
 * @property {number} favoriteCount 즐겨찾기 개수
 * @property {boolean} googleConnected 구글 연동 여부
 * @property {boolean} kakaoConnected 카카오 연동 여부
 * @property {boolean} naverConnected 네이버 연동 여부
 * @property {string} nextNicknameChangeAllowedAt 다음 닉네임 변경 가능 시간 (문자열)
 */
export interface ApiUserResponse {
  name: string;
  nickname: string;
  phone: string;
  birthDate: string;
  score: number;
  favoriteCount: number;
  googleConnected: boolean;
  kakaoConnected: boolean;
  naverConnected: boolean;
  nextNicknameChangeAllowedAt: string;
}

/**
 * @author 이승우
 * @description 사용자 프로필 정보
 * @interface UserProfile
 * @property {string} name 사용자 이름
 * @property {string} nickname 사용자 닉네임
 * @property {string} phone 사용자 전화번호
 * @property {Date} birthDate 사용자 생년월일
 * @property {number} score 바삭 스코어 점수
 * @property {number} favoriteCount 즐겨찾기 개수
 * @property {Date} nextNicknameChangeAllowedAt 다음 닉네임 변경 가능 시간
 * @property {boolean} googleConnected 구글 연동 여부
 * @property {boolean} kakaoConnected 카카오 연동 여부
 * @property {boolean} naverConnected 네이버 연동 여부
 */
export interface UserProfile {
  name: string;
  nickname: string;
  phone: string;
  birthDate: Date;
  score: number;
  favoriteCount: number;
  nextNicknameChangeAllowedAt: Date;
  googleConnected: boolean;
  kakaoConnected: boolean;
  naverConnected: boolean;
}

/**
 * @author 이승우
 * @description 사용자 상태
 * @interface UserState
 * @property {UserProfile | null} profile 사용자 프로필
 * @property {boolean} isLoading 로딩 상태
 * @property {string | null} error 에러 메시지
 *
 * @property {Function} fetchUserProfile 사용자 정보 가져오기 액션
 * @property {Function} setProfile 프로필 설정 액션
 * @property {Function} updateProfile 프로필 업데이트 액션 (닉네임 제외)
 * @property {Function} updateNickname 닉네임 업데이트 액션
 * @property {Function} updateNextNicknameChangeAllowedAt 닉네임 변경 가능 시간 업데이트 액션
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
  fetchUserProfile: () => Promise<void>;
  setProfile: (profile: UserProfile) => void;
  updateProfile: (
    updates: Partial<
      Omit<UserProfile, 'nickname' | 'nextNicknameChangeAllowedAt'>
    >
  ) => void;
  updateNickname: (nickname: string) => void;
  updateNextNicknameChangeAllowedAt: (
    nextNicknameChangeAllowedAt: Date
  ) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearProfile: () => void;
}
