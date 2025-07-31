import { AnimatePresence, motion } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import InputWithButton from './input-with-button';
import VerificationInput from './verification-input';
import PasswordInput from './password-input';
import type { FindPasswordSectionProps } from '../types/find-section';
import { checkPasswordMatch } from '../utils/password-validation';

/**
 * @author 이승우
 * @description 비밀번호 찾기 섹션 (이메일/휴대폰 토글)
 * @params {@link FindPasswordSectionProps}
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
  onReset,
  onSubmit,
  passwordVerificationRef,
  newPasswordInputRef,
  isPasswordVerifying,
}: FindPasswordSectionProps) {
  // 인증 상태 결정 (props와 local state 중 true가 하나라도 있으면 인증 완료)
  const verified = isVerified || isPasswordVerified;
  const sent = isPasswordSent;
  const show = showPasswordVerification;

  // 비밀번호 일치 여부 상태
  const [passwordMatch, setPasswordMatch] = useState<
    'none' | 'match' | 'mismatch'
  >('none');

  const emailInputRef = useRef<HTMLInputElement>(null);
  const phoneInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // 모달 진입 시 첫 번째 입력란에 자동 포커스
    if (!verified) {
      // 약간의 지연을 두어 DOM이 완전히 렌더링된 후 포커스
      const timer = setTimeout(() => {
        if (passwordAuthType === 'email') {
          emailInputRef.current?.focus();
        } else {
          phoneInputRef.current?.focus();
        }
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [verified, passwordAuthType]);

  // 비밀번호 일치 여부 확인
  useEffect(() => {
    if (
      passwordFormData.password === '' ||
      passwordFormData.passwordConfirm === ''
    ) {
      setPasswordMatch('none');
    } else if (
      checkPasswordMatch(
        passwordFormData.password,
        passwordFormData.passwordConfirm
      )
    ) {
      setPasswordMatch('match');
    } else {
      setPasswordMatch('mismatch');
    }
  }, [passwordFormData.password, passwordFormData.passwordConfirm]);

  return (
    <motion.form
      key="password-form"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="space-y-4"
      onSubmit={onSubmit}
    >
      {/* 이메일/휴대폰 토글 버튼 */}
      <div className="flex gap-2 mb-2">
        <button
          type="button"
          tabIndex={0}
          className={`px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${passwordAuthType === 'email' ? 'bg-midnight-black text-white' : 'bg-white text-gray-700'}`}
          onClick={() => handlePasswordAuthTypeChange('email')}
        >
          이메일
        </button>
        <button
          type="button"
          tabIndex={0}
          className={`px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${passwordAuthType === 'phone' ? 'bg-midnight-black text-white' : 'bg-white text-gray-700'}`}
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
                  disabled={sent || verified}
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
                    verified ||
                    (sent && passwordTimer.time > 240) ||
                    isPasswordVerifying
                  }
                  autoComplete="email"
                  ref={emailInputRef}
                />
                <VerificationInput
                  label=""
                  id="passwordVerificationCode"
                  name="verificationCode"
                  value={passwordFormData.verificationCode}
                  onChange={handlePasswordFormChange('verificationCode')}
                  placeholder="인증번호"
                  disabled={verified}
                  onVerify={handlePasswordVerificationCheck}
                  verifyDisabled={!show || verified}
                  helpText={`이메일로 전송된 인증코드를 입력해주세요.${passwordTimer.time > 0 ? ` (${Math.floor(passwordTimer.time / 60)}:${(passwordTimer.time % 60).toString().padStart(2, '0')})` : ''}`}
                  showHelpText={show && !verified}
                  autoComplete="one-time-code"
                  ref={passwordVerificationRef}
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
                  disabled={sent || verified}
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
                    verified ||
                    (sent && passwordTimer.time > 240) ||
                    isPasswordVerifying
                  }
                  autoComplete="tel"
                  ref={phoneInputRef}
                />
                <VerificationInput
                  label=""
                  id="passwordVerificationCode"
                  name="verificationCode"
                  value={passwordFormData.verificationCode}
                  onChange={handlePasswordFormChange('verificationCode')}
                  placeholder="인증번호"
                  disabled={verified}
                  onVerify={handlePasswordVerificationCheck}
                  verifyDisabled={!show || verified}
                  helpText={`휴대폰으로 전송된 인증코드를 입력해주세요.${passwordTimer.time > 0 ? ` (${Math.floor(passwordTimer.time / 60)}:${(passwordTimer.time % 60).toString().padStart(2, '0')})` : ''}`}
                  showHelpText={show && !verified}
                  autoComplete="one-time-code"
                  ref={passwordVerificationRef}
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
              data-new-password-input
              ref={newPasswordInputRef}
            />
            <PasswordInput
              label=""
              id="passwordConfirm"
              name="passwordConfirm"
              value={passwordFormData.passwordConfirm}
              onChange={handlePasswordFormChange('passwordConfirm')}
              placeholder="비밀번호 확인"
            />
            {/* 비밀번호 일치 여부 표시 - 항상 표시하여 높이 유지 */}
            <p
              className={`text-sm mt-2 min-h-[20px] ${passwordMatch === 'match' ? 'text-green-500' : passwordMatch === 'mismatch' ? 'text-red-500' : 'text-transparent'}`}
            >
              {passwordMatch === 'match'
                ? '비밀번호가 일치합니다.'
                : passwordMatch === 'mismatch'
                  ? '비밀번호가 일치하지 않습니다.'
                  : 'placeholder'}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="flex gap-2 mt-2">
        <button
          type="submit"
          disabled={!verified}
          tabIndex={0}
          data-find-password-button
          className="flex-1 h-12 rounded-lg bg-midnight-black text-white font-semibold disabled:bg-gray-300 disabled:text-gray-400 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          비밀번호 찾기
        </button>
        <button
          type="button"
          onClick={onReset}
          disabled={!sent && !verified}
          tabIndex={0}
          className="px-4 h-12 rounded-lg bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300 transition-colors disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          초기화
        </button>
      </div>
    </motion.form>
  );
}
