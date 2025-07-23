/**
 * @author 이승우
 * @description 이메일 찾기 섹션 속성
 * @property {string} foundEmail 찾은 이메일
 * @property {number} formHeight 폼 높이( 높이를 고정시키기 위해 사용 )
 * @property {React.RefObject<HTMLFormElement | null>} formRef 폼 참조(이 form이 DOM에 존재하는지 확인)
 * @property {object} idFormData 아이디 찾기 폼 데이터(phone, verificationCode)
 * @property {boolean} isIdVerified 아이디 인증 여부
 * @property {boolean} showIdVerification 아이디 인증 표시 여부
 * @property {boolean} isIdSent 아이디 인증 전송 여부
 * @property {object} idTimer 아이디 인증 타이머( 초 단위 )
 * @property {Function} handleIdFormChange 아이디 폼 변경 핸들러
 * @property {Function} handleIdVerification 아이디 인증 핸들러
 * @property {Function} handleIdVerificationCheck 아이디 인증 확인 핸들러
 * @property {Function} handleFindId 아이디 찾기 핸들러
 * @property {Function} goToLogin 로그인 이동 핸들러
 */
export type FindEmailSectionProps = {
  foundEmail: string | null;
  formHeight: number | null;
  formRef: React.RefObject<HTMLFormElement | null>;
  idFormData: { phone: string; verificationCode: string };
  isIdVerified: boolean;
  showIdVerification: boolean;
  isIdSent: boolean;
  idTimer: { time: number };
  handleIdFormChange: (
    field: string
  ) => (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleIdVerification: () => void;
  handleIdVerificationCheck: () => void;
  handleFindId: (e: React.FormEvent) => void;
  goToLogin: () => void;
};

/**
 * @author 이승우
 * @description 비밀번호 찾기 섹션 속성
 * @interface FindPasswordSectionProps
 * @property {boolean} isVerified 인증 여부
 * @property {object} passwordFormData 비밀번호 폼 데이터(email, phone, verificationCode, password, passwordConfirm)
 * @property {boolean} isPasswordVerified 비밀번호 인증 여부
 * @property {boolean} showPasswordVerification 비밀번호 인증 표시 여부
 * @property {boolean} isPasswordSent 비밀번호 인증 전송 여부
 * @property {object} passwordTimer 비밀번호 인증 타이머( 초 단위 )
 * @property {Function} handlePasswordFormChange 비밀번호 폼 변경 핸들러
 */
export type FindPasswordSectionProps = {
  isVerified?: boolean;
  passwordFormData: {
    email: string;
    phone: string;
    verificationCode: string;
    password: string;
    passwordConfirm: string;
  };
  isPasswordVerified: boolean;
  showPasswordVerification: boolean;
  isPasswordSent: boolean;
  passwordTimer: { time: number };
  handlePasswordFormChange: (
    field: string
  ) => (e: React.ChangeEvent<HTMLInputElement>) => void;
  handlePasswordVerification: () => void;
  handlePasswordVerificationCheck: () => void;
  passwordAuthType: 'email' | 'phone';
  handlePasswordAuthTypeChange: (authType: 'email' | 'phone') => void;
};
