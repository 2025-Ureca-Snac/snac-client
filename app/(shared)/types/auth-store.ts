/**
 * @author 이승우
 * @description 인증 상태
 * @param user 사용자 이름
 * @param role 사용자 역할
 * @param token 토큰
 * @param isLoading 로딩 상태
 *
 * @param login 로그인 액션( 이메일, 비밀번호 )
 * @param logout 로그아웃 액션
 * @param setLoading 로딩 상태 설정 액션
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
}

/**
 * @author 이승우
 * @description JWT 토큰 디코딩 결과
 */
export interface JwtPayload {
  category: string;
  exp: number;
  iat: number;
  role: string;
  username: string;
}
