/**
 * @author 이승우
 * @description 닉네임 유효성 검사 유틸리티 함수들
 */

/**
 * 닉네임 유효성 검사 결과 타입
 */
export interface NicknameValidationResult {
  isValid: boolean;
  errors: string[];
  criteria: {
    hasLength: boolean;
    startsWithLetter: boolean;
    hasValidChars: boolean;
  };
}

/**
 * 닉네임 유효성 검사
 * @param nickname 닉네임
 * @returns 닉네임 유효성 검사 결과
 */
export const validateNickname = (
  nickname: string
): NicknameValidationResult => {
  const errors: string[] = [];

  // 길이 검사 (2-10자)
  if (nickname.length < 2) {
    errors.push('닉네임은 2자 이상이어야 합니다.');
  } else if (nickname.length > 10) {
    errors.push('닉네임은 10자 이하여야 합니다.');
  }

  // 첫 글자가 영어 또는 한글로 시작하는지 검사
  if (nickname.length > 0 && !/^[가-힣a-zA-Z]/.test(nickname)) {
    errors.push('닉네임은 영어 또는 한글로 시작해야 합니다.');
  }

  // 공백 검사
  if (nickname.trim() !== nickname) {
    errors.push('닉네임 앞뒤에 공백을 사용할 수 없습니다.');
  }

  // 특수문자 검사 (한글, 영문, 숫자, 특수기호만 허용)
  if (!/^[가-힣a-zA-Z0-9!?@#$%^&*()~`+\-_]+$/.test(nickname)) {
    errors.push(
      '닉네임은 한글, 영문, 숫자, 특수기호(! ? @ # $ % ^ & * ( ) ~ ` + - _)만 사용할 수 있습니다.'
    );
  }

  // 연속된 공백 검사
  if (/\s{2,}/.test(nickname)) {
    errors.push('연속된 공백을 사용할 수 없습니다.');
  }

  // 각 기준별 검사 결과
  const criteria = {
    hasLength: nickname.length >= 2 && nickname.length <= 10,
    startsWithLetter: nickname.length > 0 && /^[가-힣a-zA-Z]/.test(nickname),
    hasValidChars: /^[가-힣a-zA-Z0-9!?@#$%^&*()~`+\-_]+$/.test(nickname),
  };

  return {
    isValid: errors.length === 0,
    errors,
    criteria,
  };
};
