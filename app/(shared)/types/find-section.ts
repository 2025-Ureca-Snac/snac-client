/**
 * @author 이승우
 * @description 이메일 찾기 섹션 속성
 * @param foundEmail 찾은 이메일
 * @param formHeight 폼 높이( 높이를 고정시키기 위해 사용 )
 * @param formRef 폼 참조(이 form이 DOM에 존재하는지 확인)
 * @param idFormData 아이디 찾기 폼 데이터(phone, verificationCode)
 * @param isIdVerified 아이디 인증 여부
 * @param showIdVerification 아이디 인증 표시 여부
 * @param isIdSent 아이디 인증 전송 여부
 * @param idTimer 아이디 인증 타이머( 초 단위 )
 * @param handleIdFormChange 아이디 폼 변경 핸들러
 * @param handleIdVerification 아이디 인증 핸들러
 * @param handleIdVerificationCheck 아이디 인증 확인 핸들러
 * @param handleFindId 아이디 찾기 핸들러
 * @param goToLogin 로그인 이동 핸들러
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
 * @param isVerified 인증 여부
 * @param passwordFormData 비밀번호 폼 데이터(emailOrPhone, verificationCode, password, passwordConfirm)
 * @param isPasswordVerified 비밀번호 인증 여부
 * @param showPasswordVerification 비밀번호 인증 표시 여부
 * @param isPasswordSent 비밀번호 인증 전송 여부
 * @param passwordTimer 비밀번호 인증 타이머( 초 단위 )
 * @param handlePasswordFormChange 비밀번호 폼 변경 핸들러
 * @param handlePasswordVerification 비밀번호 인증 핸들러
 * @param handlePasswordVerificationCheck 비밀번호 인증 확인 핸들러
 */
export type FindPasswordSectionProps = {
  isVerified: boolean;
  passwordFormData: {
    emailOrPhone: string;
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
};
