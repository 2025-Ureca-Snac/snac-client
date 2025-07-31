import { normalizePhoneNumber } from './phone-utils';
import { SMSValidationParams } from '../types/sms-types';

/**
 * @author 이승우
 * @description SMS 메시지 형식 검증
 * @params {@link SMSValidationParams message, phoneNumber} - SMS 검증 매개변수
 * @returns 형식이 올바른지 여부
 */
export const validateSMSFormat = ({
  message,
  phoneNumber,
}: SMSValidationParams): boolean => {
  // 기본 형식: #[휴대폰번호] [인증코드]
  const basicPattern = new RegExp(
    `#${phoneNumber.replace(/[^0-9]/g, '')}\\s+([0-9]{4,8})`
  );

  // 앱해시 형식: @[앱해시] #[휴대폰번호] [인증코드]
  const hashPattern = new RegExp(
    `@[A-Fa-f0-9]+\\s+#${phoneNumber.replace(/[^0-9]/g, '')}\\s+([0-9]{4,8})`
  );

  return basicPattern.test(message) || hashPattern.test(message);
};

/**
 * @author 이승우
 * @description 인증코드 추출
 * @params {@link SMSValidationParams message, phoneNumber} - SMS 검증 매개변수
 * @returns 추출된 인증코드 또는 null
 */
export const extractVerificationCode = ({
  message,
  phoneNumber,
}: SMSValidationParams): string | null => {
  const normalizedPhone = normalizePhoneNumber(phoneNumber);

  // 기본 형식에서 추출
  const basicMatch = message.match(
    new RegExp(`#${normalizedPhone}\\s+([0-9]{4,8})`)
  );

  if (basicMatch) {
    return basicMatch[1];
  }

  // 앱해시 형식에서 추출
  const hashMatch = message.match(
    new RegExp(`@[A-Fa-f0-9]+\\s+#${normalizedPhone}\\s+([0-9]{4,8})`)
  );

  return hashMatch ? hashMatch[1] : null;
};
