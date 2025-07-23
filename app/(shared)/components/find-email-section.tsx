import { motion } from 'framer-motion';
import InputWithButton from './input-with-button';
import VerificationInput from './verification-input';
import type { FindEmailSectionProps } from '../types/find-section';

/**
 *
 * @author 이승우
 * @description 이메일 찾기 섹션{@link FindEmailSectionProps(foundEmail, formHeight, formRef, idFormData, isIdVerified, showIdVerification, isIdSent, idTimer, handleIdFormChange, handleIdVerification, handleIdVerificationCheck, handleFindId, goToLogin)}
 * @param {string} foundEmail 찾은 이메일
 * @param {number} formHeight 폼 높이
 * @param {React.RefObject<HTMLFormElement>} formRef 폼 참조
 * @param {FindEmailSectionFormData} idFormData 아이디 폼 데이터
 * @param {boolean} isIdVerified 아이디 인증 여부
 * @param {boolean} showIdVerification 아이디 인증 표시 여부
 * @param {boolean} isIdSent 아이디 인증 전송 여부
 * @param {Timer} idTimer 아이디 인증 타이머
 * @param {Function} handleIdFormChange 아이디 폼 변경 함수
 * @param {Function} handleIdVerification 아이디 인증 함수
 * @param {Function} handleIdVerificationCheck 아이디 인증 확인 함수
 * @param {Function} handleFindId 아이디 찾기 함수
 * @param {Function} goToLogin 로그인 페이지로 이동 함수
 */
export default function FindEmailSection({
  foundEmail,
  formHeight,
  formRef,
  idFormData,
  isIdVerified,
  showIdVerification,
  isIdSent,
  idTimer,
  handleIdFormChange,
  handleIdVerification,
  handleIdVerificationCheck,
  handleFindId,
  goToLogin,
}: FindEmailSectionProps) {
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
        className="w-full h-12 rounded-lg bg-midnight-black text-white font-semibold"
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
      <InputWithButton
        label=""
        id="phone"
        name="phone"
        value={idFormData.phone}
        onChange={handleIdFormChange('phone')}
        placeholder="휴대폰 번호를 입력해주세요"
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
        buttonDisabled={isIdVerified || (isIdSent && idTimer.time > 240)}
      />
      <VerificationInput
        label=""
        id="idVerificationCode"
        name="verificationCode"
        value={idFormData.verificationCode}
        onChange={handleIdFormChange('verificationCode')}
        placeholder="인증번호"
        onVerify={handleIdVerificationCheck}
        verifyDisabled={!showIdVerification || isIdVerified}
        helpText={`휴대폰으로 전송된 인증코드를 입력해주세요.${idTimer.time > 0 ? ` (${Math.floor(idTimer.time / 60)}:${(idTimer.time % 60).toString().padStart(2, '0')})` : ''}`}
        showHelpText={showIdVerification && !isIdVerified}
      />
      <button
        type="submit"
        disabled={!isIdVerified}
        className="w-full h-12 mt-2 rounded-lg bg-midnight-black text-white font-semibold disabled:bg-gray-300 disabled:text-gray-400 disabled:cursor-not-allowed"
      >
        아이디 찾기
      </button>
    </motion.form>
  );
}
