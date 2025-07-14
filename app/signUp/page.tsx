'use client';

import { useState, useCallback, useMemo, useEffect } from 'react';
import Link from 'next/link';
import InputField from '../(shared)/components/input-field';
import InputWithButton from '../(shared)/components/input-with-button';
import VerificationInput from '../(shared)/components/verification-input';
import PasswordInput from '../(shared)/components/password-input';
import type {
  PasswordMatchState,
  SignUpFormData,
} from '../(shared)/types/sign-up';
import { useTimer } from '../(shared)/hooks/useTimer';
import { api } from '../(shared)/utils/api';
import { useRouter } from 'next/navigation';
import { formatDateYYYYMMDD } from '../(shared)/utils';

/**
 * @author 이승우
 * @description 회원가입 페이지
 */
export default function SignUp() {
  const [showEmailVerification, setShowEmailVerification] = useState(false);
  const [showPhoneVerification, setShowPhoneVerification] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [isPhoneSent, setIsPhoneSent] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const emailTimer = useTimer();
  const phoneTimer = useTimer();
  const router = useRouter();
  const [passwordMatch, setPasswordMatch] =
    useState<PasswordMatchState>('none');
  const [formData, setFormData] = useState<SignUpFormData>({
    name: '',
    nickname: '',
    email: '',
    phoneNumber: '',
    birthDate: new Date(),
    password: '',
    passwordConfirm: '',
    emailVerificationCode: '',
    phoneVerificationCode: '',
  });

  // 비밀번호 일치 확인
  useEffect(() => {
    if (formData.password === '' || formData.passwordConfirm === '') {
      setPasswordMatch('none');
    } else if (formData.password === formData.passwordConfirm) {
      setPasswordMatch('match');
    } else {
      setPasswordMatch('mismatch');
    }
  }, [formData.password, formData.passwordConfirm]);

  /**
   * @author 이승우
   * @description 모든 필드가 입력되고 인증이 완료되었는지 확인
   * @return 모든 필드가 입력되고 인증이 완료되었는지 확인(성공, 실패)
   */
  const isFormValid = useMemo(() => {
    return (
      formData.name.trim() !== '' &&
      formData.nickname.trim() !== '' &&
      formData.email.trim() !== '' &&
      formData.phoneNumber.trim() !== '' &&
      formData.birthDate &&
      formData.password.trim() !== '' &&
      formData.passwordConfirm.trim() !== '' &&
      isEmailVerified &&
      isPhoneVerified &&
      passwordMatch === 'match'
    );
  }, [formData, isEmailVerified, isPhoneVerified, passwordMatch]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    },
    []
  );

  const handleDateChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = e.target;
      setFormData((prev) => ({
        ...prev,
        birthDate: new Date(value),
      }));
    },
    []
  );

  /**
   * @author 이승우
   * @description 이메일 인증 요청
   * @return 이메일 인증 요청에 성공 여부 반환(성공, 중복, 실패)
   */
  const handleEmailVerification = useCallback(async () => {
    if (!formData.email) {
      alert('이메일을 입력해주세요.');
      return;
    }

    console.log('이메일 인증 요청', formData.email);
    try {
      const response = await api.post('/email/send-verification-code', {
        email: formData.email,
      });

      console.log('이메일 인증 요청 응답', response);

      setShowEmailVerification(true);
      setIsEmailSent(true);
      emailTimer.start(300); // 5분 = 300초
    } catch (error) {
      console.error('이메일 인증 요청 오류', error);
    }
  }, [formData.email, emailTimer]);

  /**
   * @author 이승우
   * @description 전화번호 인증 요청
   * @return 전화번호 인증 요청에 성공 여부 반환(성공, 실패)
   */
  const handlePhoneVerification = useCallback(async () => {
    if (!formData.phoneNumber) {
      alert('전화번호를 입력해주세요.');
      return;
    }

    console.log('전화번호 인증 요청', formData.phoneNumber);

    try {
      const phoneVerificationCode = await api.post('/send-verification-code', {
        phone: formData.phoneNumber,
      });

      console.log('전화번호 인증 요청 응답', phoneVerificationCode);

      setShowPhoneVerification(true);
      setIsPhoneSent(true);
      phoneTimer.start(300); // 5분 = 300초
    } catch (error) {
      console.error('전화번호 인증 요청 오류', error);
    }
  }, [formData.phoneNumber, phoneTimer]);

  /**
   * @author 이승우
   * @description 이메일 인증코드 확인
   * @return 이메일 인증코드 확인에 성공 여부 반환(성공, 실패)
   */
  const handleEmailVerificationCheck = useCallback(async () => {
    console.log('이메일 인증코드 확인', formData.emailVerificationCode);

    try {
      const response = await api.post('/email/verify-code', {
        email: formData.email,
        code: formData.emailVerificationCode,
      });

      if (
        (response.data as { code?: string })?.code ===
        'EMAIL_CODE_VERIFICATION_SUCCESS_200'
      ) {
        setIsEmailVerified(true);
        setShowEmailVerification(false);
      } else {
        alert('인증코드가 일치하지 않습니다.');
      }

      console.log('이메일 인증코드 확인 응답', response);
    } catch (error) {
      console.error('이메일 인증코드 확인 오류', error);
    }

    setIsEmailVerified(true);
    setShowEmailVerification(false);
  }, [formData.emailVerificationCode]);

  /**
   * @author 이승우
   * @description 전화번호 인증코드 확인
   * @return 전화번호 인증코드 확인에 성공 여부 반환(성공, 실패)
   */
  const handlePhoneVerificationCheck = useCallback(async () => {
    console.log('전화번호 인증코드 확인', formData.phoneVerificationCode);

    const response = await api.post('/verify-code', {
      phone: formData.phoneNumber,
      code: formData.phoneVerificationCode,
    });

    if (
      (response.data as { code?: string })?.code ===
      'SMS_CODE_VERIFICATION_SUCCESS_200'
    ) {
      setIsPhoneVerified(true);
      setShowPhoneVerification(false);
    } else {
      alert('인증코드가 일치하지 않습니다.');
    }
  }, [formData.phoneVerificationCode]);

  /**
   * @author 이승우
   * @description 회원가입 요청
   * @return 회원가입 요청에 성공 여부 반환(성공, 실패)
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 모든 조건 확인
    if (!isFormValid) {
      return;
    }

    console.log('회원가입 요청', formData);

    try {
      const data = {
        email: formData.email,
        password: formData.password,
        name: formData.name,
        phone: formData.phoneNumber,
        birthDate: formatDateYYYYMMDD(formData.birthDate),
      };

      const response = await api.post('/join', data);

      if (
        (response.data as { code?: string })?.code === 'USER_JOIN_SUCCESS_200'
      ) {
        alert('회원가입이 완료되었습니다.');
        router.push('/login');
      } else {
        alert('회원가입에 실패했습니다.');
      }
    } catch (error) {
      console.error('회원가입 오류', error);
    }
  };

  /**
   * @author 이승우
   * @description 타이머 포맷팅
   * @param seconds (초 단위 타이머)
   * @returns 타이머 포맷팅 문자열(분:초)
   */
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  /**
   * @author 이승우
   * @description 이메일 인증 버튼 텍스트
   * @return 이메일 인증 버튼 텍스트 반환(완료, 인증, 재전송)
   */
  const emailButtonText = useMemo(() => {
    if (isEmailVerified) return '완료';
    if (!isEmailSent) return '인증';
    if (emailTimer.time > 240) {
      const cooldownTime = 300 - emailTimer.time;
      return `재전송 (${60 - cooldownTime}초)`;
    }
    return '재전송';
  }, [isEmailVerified, isEmailSent, emailTimer.time]);

  /**
   * @author 이승우
   * @description 전화번호 인증 버튼 텍스트
   * @return 전화번호 인증 버튼 텍스트 반환(완료, 인증, 재전송)
   */
  const phoneButtonText = useMemo(() => {
    if (isPhoneVerified) return '완료';
    if (!isPhoneSent) return '인증';
    if (phoneTimer.time > 240) {
      const cooldownTime = 300 - phoneTimer.time;
      return `재전송 (${60 - cooldownTime}초)`;
    }
    return '재전송';
  }, [isPhoneVerified, isPhoneSent, phoneTimer.time]);

  /**
   * @author 이승우
   * @description 이메일 인증 도움말 텍스트
   * @return 이메일 인증 도움말 텍스트 반환(분:초)
   */
  const emailHelpText = useMemo(() => {
    return `이메일로 전송된 인증코드를 입력해주세요.${emailTimer.time > 0 ? ` (${formatTime(emailTimer.time)})` : ''}`;
  }, [emailTimer.time]);

  /**
   * @author 이승우
   * @description 전화번호 인증 도움말 텍스트
   * @return 전화번호 인증 도움말 텍스트 반환(분:초)
   */
  const phoneHelpText = useMemo(() => {
    return `휴대폰으로 전송된 인증코드를 입력해주세요.${phoneTimer.time > 0 ? ` (${formatTime(phoneTimer.time)})` : ''}`;
  }, [phoneTimer.time]);

  /**
   * @author 이승우
   * @description 비밀번호 중복확인 도움말 텍스트
   * @return 비밀번호 중복확인 도움말 텍스트 반환(일치, 불일치)
   */
  const passwordHelpText = useMemo(() => {
    return passwordMatch === 'match'
      ? '비밀번호가 일치합니다.'
      : passwordMatch === 'mismatch'
        ? '비밀번호가 일치하지 않습니다.'
        : '';
  }, [passwordMatch]);

  /**
   * @author 이승우
   * @description 비밀번호 중복확인 도움말 텍스트 색상
   * @return 비밀번호 중복확인 도움말 텍스트 색상 반환(일치 시 green, 불일치 시 red, 미입력 시 gray)
   */
  const passwordHelpTextColor = useMemo(() => {
    return passwordMatch === 'match'
      ? 'green'
      : passwordMatch === 'mismatch'
        ? 'red'
        : 'gray';
  }, [passwordMatch]);

  return (
    <div className="w-full flex justify-center px-6 py-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-black mb-4">회원가입</h1>
          <p className="text-gray-600">
            이미 계정이 있으신가요?{' '}
            <Link href="/login" className="text-blue-600 hover:text-blue-800">
              로그인
            </Link>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <InputField
            label="이름"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />

          <InputField
            label="유저 닉네임"
            id="nickname"
            name="nickname"
            value={formData.nickname}
            onChange={handleInputChange}
            required
          />

          <InputField
            label="생년월일"
            type="date"
            id="birthDate"
            name="birthDate"
            value={formData.birthDate.toISOString().split('T')[0]}
            onChange={handleDateChange}
            required
          />

          <InputWithButton
            label="이메일 주소"
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            disabled={isEmailVerified}
            required
            buttonText={emailButtonText}
            onButtonClick={handleEmailVerification}
            buttonDisabled={
              isEmailVerified || (isEmailSent && emailTimer.time > 240)
            }
          />

          <VerificationInput
            label="이메일 인증코드"
            id="emailVerificationCode"
            name="emailVerificationCode"
            value={formData.emailVerificationCode}
            onChange={handleInputChange}
            disabled={!showEmailVerification || isEmailVerified}
            required
            onVerify={handleEmailVerificationCheck}
            verifyDisabled={!showEmailVerification || isEmailVerified}
            helpText={emailHelpText}
            showHelpText={showEmailVerification && !isEmailVerified}
          />

          <InputWithButton
            label="전화번호"
            type="text"
            id="phoneNumber"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleInputChange}
            disabled={isPhoneVerified}
            required
            buttonText={phoneButtonText}
            onButtonClick={handlePhoneVerification}
            buttonDisabled={
              isPhoneVerified || (isPhoneSent && phoneTimer.time > 240)
            }
          />

          <VerificationInput
            label="전화번호 인증코드"
            id="phoneVerificationCode"
            name="phoneVerificationCode"
            value={formData.phoneVerificationCode}
            onChange={handleInputChange}
            disabled={!showPhoneVerification || isPhoneVerified}
            required
            onVerify={handlePhoneVerificationCheck}
            verifyDisabled={!showPhoneVerification || isPhoneVerified}
            helpText={phoneHelpText}
            showHelpText={showPhoneVerification && !isPhoneVerified}
          />

          <PasswordInput
            label="비밀번호"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            required
          />

          <PasswordInput
            label="비밀번호 확인"
            id="passwordConfirm"
            name="passwordConfirm"
            value={formData.passwordConfirm}
            onChange={handleInputChange}
            required
            helpText={passwordHelpText}
            showHelpText={passwordMatch !== 'none'}
            helpTextColor={passwordHelpTextColor}
          />
          <button
            type="submit"
            disabled={!isFormValid}
            className="w-full py-3 px-4 bg-black text-white rounded-md hover:bg-gray-800 transition-colors font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            회원가입
          </button>
        </form>
      </div>
    </div>
  );
}
