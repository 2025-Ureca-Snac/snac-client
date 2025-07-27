import { motion } from 'framer-motion';
import { useRef, useEffect } from 'react';
import InputWithButton from './input-with-button';
import VerificationInput from './verification-input';
import type { FindEmailSectionProps } from '../types/find-section';

/**
 *
 * @author 이승우
 * @description 이메일 찾기 섹션
 * @params {@link FindEmailSectionProps}
 */
export default function FindEmailSection({
  foundEmail,
  formHeight,
  formRef,
  idFormData,
  isIdVerified,
  isIdSent,
  idTimer,
  handleIdFormChange,
  handleIdVerification,
  handleIdVerificationCheck,
  handleFindId,
  goToLogin,
  onReset,
  idVerificationRef,
  isIdVerifying,
}: FindEmailSectionProps) {
  const phoneInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // 모달 진입 시 휴대폰 번호 입력란에 자동 포커스
    if (!foundEmail) {
      // 약간의 지연을 두어 DOM이 완전히 렌더링된 후 포커스
      const timer = setTimeout(() => {
        phoneInputRef.current?.focus();
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [foundEmail]);

  return foundEmail ? (
    <motion.div
      key="id-found"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center justify-center py-8"
      style={formHeight ? { minHeight: formHeight } : undefined}
    >
      <div className="text-lg font-semibold mb-10">{foundEmail}</div>
      <button
        type="button"
        onClick={goToLogin}
        tabIndex={0}
        className="w-full h-12 rounded-lg bg-midnight-black text-white font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        로그인하러 가기
      </button>
    </motion.div>
  ) : (
    <motion.form
      key="id-form"
      ref={formRef}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="space-y-4"
      onSubmit={handleFindId}
    >
      {/* 비밀번호 찾기와 높이 맞추기 위한 빈 공간 */}
      <div className="h-10 mb-2"></div>
      <InputWithButton
        label=""
        id="phone"
        name="phone"
        value={idFormData.phone}
        onChange={handleIdFormChange('phone')}
        placeholder="휴대폰 번호를 입력해주세요"
        disabled={isIdSent || isIdVerified}
        buttonText={
          isIdVerified
            ? '완료'
            : !isIdSent
              ? '인증'
              : idTimer.time > 240
                ? `재전송 (${60 - (300 - idTimer.time)}초)`
                : '재전송'
        }
        onButtonClick={handleIdVerification}
        buttonDisabled={
          isIdVerified || (isIdSent && idTimer.time > 240) || isIdVerifying
        }
        autoComplete="tel"
        ref={phoneInputRef}
      />
      <VerificationInput
        label=""
        id="idVerificationCode"
        name="verificationCode"
        value={idFormData.verificationCode}
        onChange={handleIdFormChange('verificationCode')}
        onVerify={handleIdVerificationCheck}
        verifyDisabled={isIdVerified || !isIdSent}
        disabled={isIdVerified || !isIdSent}
        autoComplete="one-time-code"
        ref={idVerificationRef}
      />
      <div className="flex gap-2 mt-2">
        <button
          type="submit"
          disabled={!isIdVerified}
          tabIndex={0}
          data-find-id-button
          className="flex-1 h-12 rounded-lg bg-midnight-black text-white font-semibold disabled:bg-gray-300 disabled:text-gray-400 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          아이디 찾기
        </button>
        <button
          type="button"
          onClick={onReset}
          disabled={!isIdSent && !isIdVerified}
          tabIndex={0}
          className="px-4 h-12 rounded-lg bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300 transition-colors disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          초기화
        </button>
      </div>
    </motion.form>
  );
}
