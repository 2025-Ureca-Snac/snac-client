import { AnimatePresence, motion } from 'framer-motion';
import InputWithButton from './input-with-button';
import VerificationInput from './verification-input';
import PasswordInput from './password-input';
import type { FindPasswordSectionProps } from '../types/find-section';

/**
 * @author 이승우
 * @description 비밀번호 찾기 섹션 (이메일/휴대폰 토글){@link FindPasswordSectionProps(isVerified, isPasswordVerified, showPasswordVerification, isPasswordSent, passwordTimer, handlePasswordFormChange, passwordFormData, handlePasswordVerification, handlePasswordVerificationCheck, passwordAuthType, handlePasswordAuthTypeChange) }
 * @param {boolean} isVerified 인증 여부
 * @param {boolean} isPasswordVerified 비밀번호 인증 여부
 * @param {boolean} showPasswordVerification 비밀번호 인증 표시 여부
 * @param {boolean} isPasswordSent 비밀번호 인증 전송 여부
 * @param {Timer} passwordTimer 비밀번호 인증 타이머
 * @param {Function} handlePasswordFormChange 비밀번호 폼 변경 함수
 * @param {PasswordFormData} passwordFormData 비밀번호 폼 데이터
 * @param {Function} handlePasswordVerification 비밀번호 인증 함수
 * @param {Function} handlePasswordVerificationCheck 비밀번호 인증 확인 함수
 * @param {string} passwordAuthType 비밀번호 인증 타입
 * @param {Function} handlePasswordAuthTypeChange 비밀번호 인증 타입 변경 함수
 */
export default function FindPasswordSection({
  isVerified,
  isPasswordVerified,
  showPasswordVerification,
  isPasswordSent,
  passwordTimer,
  handlePasswordFormChange,
  passwordFormData,
  handlePasswordVerification,
  handlePasswordVerificationCheck,
  passwordAuthType,
  handlePasswordAuthTypeChange,
}: FindPasswordSectionProps) {
  // 인증 상태 결정 (props와 local state 중 true가 하나라도 있으면 인증 완료)
  const verified = isVerified || isPasswordVerified;
  const sent = isPasswordSent;
  const show = showPasswordVerification;

  return (
    <motion.form
      key="password-form"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="space-y-4"
    >
      {/* 이메일/휴대폰 토글 버튼 */}
      <div className="flex gap-2 mb-2">
        <button
          type="button"
          className={`px-4 py-2 rounded-lg border ${passwordAuthType === 'email' ? 'bg-midnight-black text-white' : 'bg-white text-gray-700'}`}
          onClick={() => handlePasswordAuthTypeChange('email')}
        >
          이메일
        </button>
        <button
          type="button"
          className={`px-4 py-2 rounded-lg border ${passwordAuthType === 'phone' ? 'bg-midnight-black text-white' : 'bg-white text-gray-700'}`}
          onClick={() => handlePasswordAuthTypeChange('phone')}
        >
          휴대폰 번호
        </button>
      </div>
      <AnimatePresence mode="wait">
        {!verified ? (
          <motion.div
            key="verification-step"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {passwordAuthType === 'email' ? (
              <>
                <InputWithButton
                  label=""
                  id="email"
                  name="email"
                  value={passwordFormData.email}
                  onChange={handlePasswordFormChange('email')}
                  placeholder="이메일을 입력해주세요"
                  buttonText={
                    verified
                      ? '완료'
                      : !sent
                        ? '인증'
                        : passwordTimer.time > 240
                          ? `재전송 (${60 - (300 - passwordTimer.time)}초)`
                          : '재전송'
                  }
                  onButtonClick={handlePasswordVerification}
                  buttonDisabled={
                    verified || (sent && passwordTimer.time > 240)
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
                  verifyDisabled={!show || verified}
                  helpText={`이메일로 전송된 인증코드를 입력해주세요.${passwordTimer.time > 0 ? ` (${Math.floor(passwordTimer.time / 60)}:${(passwordTimer.time % 60).toString().padStart(2, '0')})` : ''}`}
                  showHelpText={show && !verified}
                />
              </>
            ) : (
              <>
                <InputWithButton
                  label=""
                  id="phone"
                  name="phone"
                  value={passwordFormData.phone}
                  onChange={handlePasswordFormChange('phone')}
                  placeholder="휴대폰 번호를 입력해주세요"
                  buttonText={
                    verified
                      ? '완료'
                      : !sent
                        ? '인증'
                        : passwordTimer.time > 240
                          ? `재전송 (${60 - (300 - passwordTimer.time)}초)`
                          : '재전송'
                  }
                  onButtonClick={handlePasswordVerification}
                  buttonDisabled={
                    verified || (sent && passwordTimer.time > 240)
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
                  verifyDisabled={!show || verified}
                  helpText={`휴대폰으로 전송된 인증코드를 입력해주세요.${passwordTimer.time > 0 ? ` (${Math.floor(passwordTimer.time / 60)}:${(passwordTimer.time % 60).toString().padStart(2, '0')})` : ''}`}
                  showHelpText={show && !verified}
                />
              </>
            )}
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
        disabled={!verified}
        className="w-full h-12 mt-2 rounded-lg bg-midnight-black text-white font-semibold disabled:bg-gray-300 disabled:text-gray-400 disabled:cursor-not-allowed"
      >
        비밀번호 찾기
      </button>
    </motion.form>
  );
}
