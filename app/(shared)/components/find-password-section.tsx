import { AnimatePresence, motion } from 'framer-motion';
import InputWithButton from './input-with-button';
import VerificationInput from './verification-input';
import PasswordInput from './password-input';
import type { FindPasswordSectionProps } from '../types/find-section';

/**
 * @author 이승우
 * @description 비밀번호 찾기 섹션
 * @param props 컴포넌트 속성 {@link FindPasswordSectionProps}(isVerified, passwordFormData, isPasswordVerified, showPasswordVerification, isPasswordSent, passwordTimer, handlePasswordFormChange, handlePasswordVerification, handlePasswordVerificationCheck)
 */
export default function FindPasswordSection({
  isVerified,
  passwordFormData,
  isPasswordVerified,
  showPasswordVerification,
  isPasswordSent,
  passwordTimer,
  handlePasswordFormChange,
  handlePasswordVerification,
  handlePasswordVerificationCheck,
}: FindPasswordSectionProps) {
  return (
    <motion.form
      key="password-form"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="space-y-4"
    >
      <AnimatePresence mode="wait">
        {!isVerified ? (
          <motion.div
            key="verification-step"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <InputWithButton
              label=""
              id="emailOrPhone"
              name="emailOrPhone"
              value={passwordFormData.emailOrPhone}
              onChange={handlePasswordFormChange('emailOrPhone')}
              placeholder="이메일 또는 휴대폰 번호를 입력해주세요"
              buttonText={
                isPasswordVerified
                  ? '완료'
                  : !isPasswordSent
                    ? '인증'
                    : passwordTimer.time > 240
                      ? `재전송 (${60 - (300 - passwordTimer.time)}초)`
                      : '재전송'
              }
              onButtonClick={handlePasswordVerification}
              buttonDisabled={
                isPasswordVerified ||
                (isPasswordSent && passwordTimer.time > 240)
              }
            />
            <VerificationInput
              label=""
              id="passwordVerificationCode"
              name="verificationCode"
              value={passwordFormData.verificationCode}
              onChange={handlePasswordFormChange('verificationCode')}
              placeholder="인증번호"
              onVerify={handlePasswordVerificationCheck}
              verifyDisabled={!showPasswordVerification || isPasswordVerified}
              helpText={`휴대폰으로 전송된 인증코드를 입력해주세요.${passwordTimer.time > 0 ? ` (${Math.floor(passwordTimer.time / 60)}:${(passwordTimer.time % 60).toString().padStart(2, '0')})` : ''}`}
              showHelpText={showPasswordVerification && !isPasswordVerified}
            />
          </motion.div>
        ) : (
          <motion.div
            key="password-step"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <PasswordInput
              label=""
              id="password"
              name="password"
              value={passwordFormData.password}
              onChange={handlePasswordFormChange('password')}
              placeholder="비밀번호"
            />
            <PasswordInput
              label=""
              id="passwordConfirm"
              name="passwordConfirm"
              value={passwordFormData.passwordConfirm}
              onChange={handlePasswordFormChange('passwordConfirm')}
              placeholder="비밀번호 확인"
            />
          </motion.div>
        )}
      </AnimatePresence>
      <button
        type="submit"
        disabled={!isPasswordVerified}
        className="w-full h-12 mt-2 rounded-lg bg-midnight-black text-white font-semibold disabled:bg-gray-300 disabled:text-gray-400 disabled:cursor-not-allowed"
      >
        비밀번호 찾기
      </button>
    </motion.form>
  );
}
