/**
 * @author 이승우
 * @description 비밀번호 유효성 검사 유틸리티 함수들
 */

/**
 * 비밀번호 유효성 검사 결과 타입
 */
export interface PasswordValidationResult {
  isValid: boolean;
  errors: string[];
  strength: 'weak' | 'medium' | 'strong';
}

/**
 * 비밀번호 유효성 검사
 * @param password 비밀번호
 * @returns 비밀번호 유효성 검사 결과
 */
export const validatePassword = (
  password: string
): PasswordValidationResult => {
  const errors: string[] = [];

  // 길이 검사 (6-12자)
  if (password.length < 6) {
    errors.push('비밀번호는 6자 이상이어야 합니다.');
  } else if (password.length > 12) {
    errors.push('비밀번호는 12자 이하여야 합니다.');
  }

  // 대소문자 상관없이 영어 하나 이상
  if (!/[a-zA-Z]/.test(password)) {
    errors.push('영어를 하나 이상 포함해야 합니다.');
  }

  // 숫자 하나 이상
  if (!/\d/.test(password)) {
    errors.push('숫자를 하나 이상 포함해야 합니다.');
  }

  // 특수기호 하나 이상 (! ? @ # $ % ^ & * ( ) ~ ` + - _)
  if (!/[!?@#$%^&*()~`+\-_]/.test(password)) {
    errors.push(
      '특수기호를 하나 이상 포함해야 합니다. (! ? @ # $ % ^ & * ( ) ~ ` + - _)'
    );
  }

  // 연속된 문자 검사 (3개 이상)
  if (/(.)\1{2,}/.test(password)) {
    errors.push('연속된 문자는 3개 이상 사용할 수 없습니다.');
  }

  // 키보드 연속 패턴 검사
  const keyboardPatterns = [
    'qwerty',
    'asdfgh',
    'zxcvbn',
    '123456',
    'abcdef',
    'password',
  ];

  const lowerPassword = password.toLowerCase();
  if (keyboardPatterns.some((pattern) => lowerPassword.includes(pattern))) {
    errors.push('키보드 연속 패턴은 사용할 수 없습니다.');
  }

  // 강도 평가
  let strength: 'weak' | 'medium' | 'strong' = 'weak';
  const hasEnglish = /[a-zA-Z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChars = /[!?@#$%^&*()~`+\-_]/.test(password);

  const criteriaCount = [hasEnglish, hasNumbers, hasSpecialChars].filter(
    Boolean
  ).length;

  if (password.length >= 10 && criteriaCount >= 3) {
    strength = 'strong';
  } else if (password.length >= 8 && criteriaCount >= 2) {
    strength = 'medium';
  }

  return {
    isValid: errors.length === 0,
    errors,
    strength,
  };
};

/**
 * 비밀번호 일치 여부 확인
 * @param password 비밀번호
 * @param passwordConfirm 비밀번호 확인
 * @returns 일치 여부
 */
export const checkPasswordMatch = (
  password: string,
  passwordConfirm: string
): boolean => {
  return password === passwordConfirm;
};

/**
 * 비밀번호 강도에 따른 색상 반환
 * @param strength 비밀번호 강도
 * @returns Tailwind CSS 색상 클래스
 */
export const getPasswordStrengthColor = (
  strength: 'weak' | 'medium' | 'strong'
): string => {
  switch (strength) {
    case 'weak':
      return 'text-red-500';
    case 'medium':
      return 'text-yellow-500';
    case 'strong':
      return 'text-green-500';
    default:
      return 'text-gray-500';
  }
};

/**
 * 비밀번호 강도에 따른 텍스트 반환
 * @param strength 비밀번호 강도
 * @returns 강도 텍스트
 */
export const getPasswordStrengthText = (
  strength: 'weak' | 'medium' | 'strong'
): string => {
  switch (strength) {
    case 'weak':
      return '약함';
    case 'medium':
      return '보통';
    case 'strong':
      return '강함';
    default:
      return '';
  }
};
