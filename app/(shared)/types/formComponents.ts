/**
 * @author 이승우
 * @description 일반 입력 필드 컴포넌트 타입
 * @interface InputFieldProps
 * @property {string} label 라벨
 * @property {string} type 타입(선택)
 * @property {string} id 아이디
 * @property {string} name 이름
 * @property {string} value 값
 * @property {Function} onChange 변경 이벤트
 * @property {string} placeholder 플레이스홀더(선택)
 * @property {boolean} required 필수 여부(선택)
 * @property {boolean} disabled 비활성화 여부(선택)
 * @property {string} className 클래스 이름(선택)
 * @property {string} max 최대값(선택)
 */
export interface InputFieldProps {
  label: string;
  type?: string;
  id: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  max?: string;
}

/**
 * @author 이승우
 * @description 버튼 입력 필드 컴포넌트 타입
 * @property label 라벨
 * @property type 타입(선택)
 * @property id 아이디
 * @property name 이름
 * @property value 값
 * @property onChange 변경 이벤트
 * @property placeholder 플레이스홀더(선택)
 * @property required 필수 여부(선택)
 * @property disabled 비활성화 여부(선택)
 * @property buttonText 버튼 텍스트
 * @property onButtonClick 버튼 클릭 이벤트
 * @property buttonDisabled 버튼 비활성화 여부(선택)
 * @property className 클래스 이름(선택)
 */
export interface InputWithButtonProps {
  label: string;
  type?: string;
  id: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  buttonText: string;
  onButtonClick: () => void;
  buttonDisabled?: boolean;
  className?: string;
}

/**
 * @author 이승우
 * @description 인증 입력 필드 컴포넌트 타입(이메일 인증, 전화번호 인증)
 * @property label 라벨
 * @property id 아이디
 * @property name 이름
 * @property value 값
 * @property onChange 변경 이벤트
 * @property placeholder 플레이스홀더(선택)
 * @property required 필수 여부(선택)
 * @property disabled 비활성화 여부(선택)
 * @property onVerify 인증 이벤트
 * @property verifyDisabled 인증 비활성화 여부(선택)
 * @property helpText 도움말 텍스트(선택)
 * @property showHelpText 도움말 텍스트 표시 여부(선택)
 */
export interface VerificationInputProps {
  label: string;
  id: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  onVerify: () => void;
  verifyDisabled?: boolean;
  helpText?: string;
  showHelpText?: boolean;
}

/**
 * @author 이승우
 * @description 비밀번호 입력 필드 컴포넌트 타입
 * @property label 라벨
 * @property id 아이디
 * @property name 이름
 * @property value 값
 * @property onChange 변경 이벤트
 * @property placeholder 플레이스홀더(선택)
 * @property required 필수 여부(선택)
 * @property disabled 비활성화 여부(선택)
 * @property helpText 비밀번호 일치 여부(선택)
 * @property showHelpText 비밀번호 일치 여부 표시 여부(선택)
 * @property helpTextColor 비밀번호 일치 여부(실패 | 성공 | 미입력)
 */
export interface PasswordInputProps {
  label: string;
  id: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  helpText?: string;
  showHelpText?: boolean;
  helpTextColor?: 'red' | 'green' | 'gray';
}
