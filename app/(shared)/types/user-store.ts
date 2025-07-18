/**
 * @author 이승우
 * @description 사용자 프로필 정보
 * @param id 사용자 아이디
 * @param email 사용자 이메일
 * @param name 사용자 이름
 * @param nickname 사용자 닉네임
 * @param phone 사용자 전화번호
 * @param birthDate 사용자 생년월일
 * @param preferences 사용자 설정 정보( 테마, 언어, 알림 )
 * @param createdAt 사용자 생성 일시
 * @param updatedAt 사용자 수정 일시
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
  preferences: {
    theme: 'light' | 'dark' | 'auto';
    language: 'ko' | 'en';
    notifications: {
      email: boolean;
      push: boolean;
      sms: boolean;
    };
  };
  createdAt: Date;
  updatedAt: Date;
}

/**
 * @author 이승우
 * @description 사용자 상태
 * @param profile 사용자 프로필
 * @param isLoading 로딩 상태
 * @param error 에러 메시지
 *
 * @param setProfile 프로필 설정 액션
 * @param updateProfile 프로필 업데이트 액션
 * @param updatePreferences 설정 업데이트 액션
 * @param setLoading 로딩 상태 설정 액션
 * @param setError 에러 설정 액션
 * @param clearProfile 프로필 초기화 액션
 */
export interface UserState {
  // 상태
  profile: UserProfile | null;
  isLoading: boolean;
  error: string | null;

  // 액션
  setProfile: (profile: UserProfile) => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  updatePreferences: (preferences: Partial<UserProfile['preferences']>) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearProfile: () => void;
}
