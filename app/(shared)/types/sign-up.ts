/**
 * 회원가입 폼 데이터
 * @author 이승우
 * @description 회원가입 폼 데이터
 * @interface SignUpFormData
 * @property {string} name 이름
 * @property {string} nickname 닉네임
 * @property {string} email 이메일
 * @property {string} phoneNumber 전화번호
 * @property {Date} birthDate 생년월일
 * @property {string} password 비밀번호
 * @property {string} passwordConfirm 비밀번호 확인
 * @property {string} emailVerificationCode 이메일 인증코드
 * @property {string} phoneVerificationCode 전화번호 인증코드
 */
export interface SignUpFormData {
  name: string;
  nickname: string;
  email: string;
  phoneNumber: string;
  birthDate: Date;
  password: string;
  passwordConfirm: string;
  emailVerificationCode: string;
  phoneVerificationCode: string;
}

/**
 * @author 이승우
 * @description 비밀번호 일치 상태
 * @interface PasswordMatchState
 * @property {string} none 비밀번호 입력 안됨
 * @property {string} match 비밀번호 일치
 * @property {string} mismatch 비밀번호 불일치
 */
export type PasswordMatchState = 'none' | 'match' | 'mismatch';
