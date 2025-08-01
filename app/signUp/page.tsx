'use client';

import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import Link from 'next/link';
import InputField from '../(shared)/components/input-field';
import InputWithButton from '../(shared)/components/input-with-button';
import VerificationInput from '../(shared)/components/verification-input';
import PasswordInput from '../(shared)/components/password-input';
import NicknameInputField from '../(shared)/components/nickname-input-field';
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

  // 인증 요청 중복 방지 상태
  const [isEmailVerifying, setIsEmailVerifying] = useState(false);
  const [isPhoneVerifying, setIsPhoneVerifying] = useState(false);

  const [passwordMatch, setPasswordMatch] =
    useState<PasswordMatchState>('none');
  const [formData, setFormData] = useState<SignUpFormData>({
    name: '',
    nickname: '',
    email: '',
    phoneNumber: '',
    birthDate: new Date('1990-01-01'), // 유효한 기본 날짜로 설정
    password: '',
    passwordConfirm: '',
    emailVerificationCode: '',
    phoneVerificationCode: '',
  });
  const nameInputRef = useRef<HTMLInputElement>(null);
  const emailVerificationRef = useRef<HTMLInputElement>(null);
  const phoneVerificationRef = useRef<HTMLInputElement>(null);
  const phoneInputRef = useRef<HTMLInputElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    nameInputRef.current?.focus();
  }, []);

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
      !isNaN(formData.birthDate.getTime()) && // 유효한 날짜인지 확인
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
      const selectedDate = new Date(value);
      const today = new Date();

      // 오늘 날짜 이상은 선택 불가
      if (selectedDate >= today) {
        alert('오늘 날짜 이상은 선택할 수 없습니다.');
        return;
      }

      // 유효성 검사 없이 바로 상태 업데이트 (Invalid Date도 허용)
      setFormData((prev) => ({
        ...prev,
        birthDate: selectedDate,
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
    if (isEmailVerifying) return; // 이미 인증 요청 중이면 무시

    if (!formData.email) {
      alert('이메일을 입력해주세요.');
      return;
    }

    console.log('이메일 인증 요청', formData.email);
    try {
      setIsEmailVerifying(true); // 인증 요청 시작
      const response = await api.post('/email/send-verification-code', {
        email: formData.email,
      });

      console.log('이메일 인증 요청 응답', response);

      if ((response.data as { status?: string })?.status === 'OK') {
        setShowEmailVerification(true);
        setIsEmailSent(true);
        emailTimer.start(300); // 5분 = 300초
        // 인증코드 입력 필드에 포커스
        setTimeout(() => {
          emailVerificationRef.current?.focus();
        }, 100);
      } else {
        alert('인증코드 전송에 실패했습니다.');
      }
    } catch (error) {
      console.error('이메일 인증 요청 오류', error);
      alert('인증코드 전송에 실패했습니다.');
    } finally {
      setIsEmailVerifying(false); // 인증 요청 완료
    }
  }, [formData.email, emailTimer, isEmailVerifying]);

  /**
   * @author 이승우
   * @description 전화번호 인증 요청
   * @return 전화번호 인증 요청에 성공 여부 반환(성공, 실패)
   */
  const handlePhoneVerification = useCallback(async () => {
    if (isPhoneVerifying) return; // 이미 인증 요청 중이면 무시

    if (!formData.phoneNumber) {
      alert('전화번호를 입력해주세요.');
      return;
    }

    console.log('전화번호 인증 요청', formData.phoneNumber);

    try {
      setIsPhoneVerifying(true); // 인증 요청 시작
      const phoneVerificationCode = await api.post(
        '/sns/send-verification-code',
        {
          phone: formData.phoneNumber,
        }
      );

      console.log('전화번호 인증 요청 응답', phoneVerificationCode);

      if (
        (phoneVerificationCode.data as { status?: string })?.status === 'OK'
      ) {
        setShowPhoneVerification(true);
        setIsPhoneSent(true);
        phoneTimer.start(300); // 5분 = 300초
        // 인증코드 입력 필드에 포커스
        setTimeout(() => {
          phoneVerificationRef.current?.focus();
        }, 100);
      } else {
        alert('인증코드 전송에 실패했습니다.');
      }
    } catch (error) {
      console.error('전화번호 인증 요청 오류', error);
      alert('인증코드 전송에 실패했습니다.');
    } finally {
      setIsPhoneVerifying(false); // 인증 요청 완료
    }
  }, [formData.phoneNumber, phoneTimer, isPhoneVerifying]);

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

      if ((response.data as { status?: string })?.status === 'OK') {
        setIsEmailVerified(true);
        setShowEmailVerification(false);
        // 전화번호 입력 필드로 포커스
        setTimeout(() => {
          phoneInputRef.current?.focus();
        }, 100);
      } else {
        alert('인증코드가 일치하지 않습니다.');
      }

      console.log('이메일 인증코드 확인 응답', response);
    } catch (error) {
      console.error('이메일 인증코드 확인 오류', error);
    }
  }, [formData.emailVerificationCode, formData.email]);

  /**
   * @author 이승우
   * @description 전화번호 인증코드 확인
   * @return 전화번호 인증코드 확인에 성공 여부 반환(성공, 실패)
   */
  const handlePhoneVerificationCheck = useCallback(async () => {
    console.log('전화번호 인증코드 확인', formData.phoneVerificationCode);

    const response = await api.post('/sns/verify-code', {
      phone: formData.phoneNumber,
      code: formData.phoneVerificationCode,
    });

    if ((response.data as { status?: string })?.status === 'OK') {
      setIsPhoneVerified(true);
      setShowPhoneVerification(false);
      // 비밀번호 입력 필드로 포커스
      setTimeout(() => {
        passwordInputRef.current?.focus();
      }, 100);
    } else {
      alert('인증코드가 일치하지 않습니다.');
    }
  }, [formData.phoneVerificationCode, formData.phoneNumber]);

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
        nickname: formData.nickname,
        password: formData.password,
        name: formData.name,
        phone: formData.phoneNumber,
        birthDate: formatDateYYYYMMDD(formData.birthDate),
      };

      const response = await api.post('/join', data);

      if ((response.data as { status?: string })?.status === 'CREATED') {
        alert('회원가입이 완료되었습니다.');
        router.push('/login');
      } else {
        alert('회원가입에 실패했습니다.');
      }
    } catch (error: unknown) {
      console.error('회원가입 오류', error);

      // 닉네임 중복 에러 처리
      if (error && typeof error === 'object' && 'response' in error) {
        const apiError = error as {
          response?: {
            data?: { message?: string };
            status?: number;
          };
        };

        if (apiError.response?.status === 409) {
          alert('이미 사용 중인 닉네임입니다.');
        } else if (apiError.response?.data?.message) {
          alert(apiError.response.data.message);
        } else {
          alert('회원가입에 실패했습니다.');
        }
      } else {
        alert('회원가입에 실패했습니다.');
      }
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
            ref={nameInputRef}
          />

          <NicknameInputField
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
            value={
              formData.birthDate && !isNaN(formData.birthDate.getTime())
                ? formData.birthDate.toISOString().split('T')[0]
                : ''
            }
            onChange={handleDateChange}
            required
            max={new Date().toISOString().split('T')[0]}
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
              isEmailVerified ||
              (isEmailSent && emailTimer.time > 240) ||
              isEmailVerifying
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
            ref={emailVerificationRef}
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
              isPhoneVerified ||
              (isPhoneSent && phoneTimer.time > 240) ||
              isPhoneVerifying
            }
            ref={phoneInputRef}
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
            ref={phoneVerificationRef}
          />

          <PasswordInput
            label="비밀번호"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            required
            ref={passwordInputRef}
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
            className="w-full py-3 px-4 bg-black text-white rounded-md hover:bg-gray-800 transition-colors font-medium disabled:bg-gray-400 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            회원가입
          </button>
        </form>
      </div>
    </div>
  );
}
