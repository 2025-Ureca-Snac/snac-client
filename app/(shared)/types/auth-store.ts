/**
 * @author 이승우
 * @description 인증 상태
 * @interface AuthState
 * @property {string} user 사용자 이름
 * @property {string} role 사용자 역할
 * @property {string} token 토큰
 * @property {boolean} isLoading 로딩 상태
 *
 * @property {Function} login 로그인 액션( 이메일, 비밀번호 )
 * @property {Function} logout 로그아웃 액션
 * @property {Function} setLoading 로딩 상태 설정 액션
 * @property {Function} linkSocialAccount 소셜 로그인 연동 액션
 * @property {Function} unlinkSocialAccount 소셜 로그인 해제 액션
 */
export interface AuthState {
  // 상태
  user: string | null;
  role: string | null;
  token: string | null;
  isLoading: boolean;

  // 액션
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  setLoading: (loading: boolean) => void;
  linkSocialAccount: (providerId: string) => Promise<boolean>;
  unlinkSocialAccount: (providerId: string) => Promise<void>;
}

/**
 * @author 이승우
 * @description JWT 토큰 디코딩 결과
 * @interface JwtPayload
 * @property {string} category 카테고리
 * @property {number} exp 만료 시간
 * @property {number} iat 발급 시간
 * @property {string} role 역할
 * @property {string} username 사용자 이름
 */
export interface JwtPayload {
  category: string;
  exp: number;
  iat: number;
  role: string;
  username: string;
}
