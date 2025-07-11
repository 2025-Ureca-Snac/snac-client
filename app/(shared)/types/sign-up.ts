/**
 * 회원가입 폼 데이터
 * @author 이승우
 * @description 회원가입 폼 데이터
 * @property name : 이름
 * @property nickname: 닉네임
 * @property email: 이메일
 * @property phoneNumber: 전화번호
 * @property password: 비밀번호
 * @property passwordConfirm: 비밀번호 확인
 * @property emailVerificationCode: 이메일 인증코드
 * @property phoneVerificationCode: 전화번호 인증코드
 */
export interface SignUpFormData {
  name: string;
  nickname: string;
  email: string;
  phoneNumber: string;
  password: string;
  passwordConfirm: string;
  emailVerificationCode: string;
  phoneVerificationCode: string;
}

/**
 * @author 이승우
 * @description 비밀번호 일치 상태
 * @property none: 비밀번호 입력 안됨
 * @property match: 비밀번호 일치
 * @property mismatch: 비밀번호 불일치
 */
export type PasswordMatchState = 'none' | 'match' | 'mismatch';
