import React, { useState, useRef, useCallback, useEffect } from 'react';
import ModalPortal from './modal-portal';
import Image from 'next/image';
import InputWithButton from './input-with-button';
import VerificationInput from './verification-input';
import PasswordInput from './password-input';
import type { ChangePhoneModalProps } from '../types/change-phone-modal';
import { api } from '../utils/api';
import { useTimer } from '../hooks/useTimer';

/**
 * @author 이승우
 * @description 전화번호 변경 모달 컴포넌트
 * @param {ChangePhoneModalProps} props
 */
export default function ChangePhoneModal({
  open,
  onClose,
  onSubmit,
}: ChangePhoneModalProps) {
  // 폼 데이터
  const [formData, setFormData] = useState({
    password: '',
    phone: '',
    verificationCode: '',
  });

  // 상태 관리
  const [isVerified, setIsVerified] = useState(false);
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // 타이머
  const codeTimer = useTimer();

  // refs
  const passwordRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const verificationRef = useRef<HTMLInputElement>(null);

  // 모달이 열릴 때 비밀번호 필드에 자동 포커스
  useEffect(() => {
    if (open) {
      setTimeout(() => {
        passwordRef.current?.focus();
      }, 100);
    }
  }, [open]);

  // 모달이 닫힐 때 타이머 정지
  useEffect(() => {
    if (!open) {
      codeTimer.stop();
    }
  }, [open, codeTimer]);

  // 폼 데이터 변경 핸들러
  const handleFormChange =
    (field: keyof typeof formData) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({ ...prev, [field]: e.target.value }));
      setError(null);
    };

  // 인증코드 전송
  const handleSendCode = useCallback(async () => {
    if (!formData.password.trim() || !formData.phone.trim()) {
      setError('비밀번호와 전화번호를 입력해주세요.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await api.post('/member/change-phone/check', {
        pwd: formData.password,
        newPhone: formData.phone,
      });

      if (response.status === 200) {
        setIsCodeSent(true);
        setShowVerification(true);
        // 타이머 시작 (5분 = 300초)
        codeTimer.start(300);
        // 인증 코드 필드로 포커스 - 더 긴 지연시간으로 안전하게 처리
        setTimeout(() => {
          if (verificationRef.current) {
            verificationRef.current.focus();
          }
        }, 200);
      } else {
        setError('인증 코드 전송에 실패했습니다.');
      }
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'response' in error) {
        const apiError = error as { response: { data: { message?: string } } };
        setError(
          apiError.response.data.message || '인증 코드 전송에 실패했습니다.'
        );
      } else {
        setError('인증 코드 전송에 실패했습니다.');
      }
    } finally {
      setIsLoading(false);
    }
  }, [formData.password, formData.phone, codeTimer]);

  // 인증코드 확인
  const handleVerifyCode = useCallback(async () => {
    if (!formData.verificationCode.trim()) {
      setError('인증코드를 입력해주세요.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await api.post('/sns/verify-code', {
        phone: formData.phone,
        code: formData.verificationCode,
      });

      if (response.status === 200) {
        setIsVerified(true);
        setError(null);
      } else {
        setError('인증코드가 올바르지 않습니다.');
      }
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'response' in error) {
        const apiError = error as { response: { data: { message?: string } } };
        setError(
          apiError.response.data.message || '인증코드가 올바르지 않습니다.'
        );
      } else {
        setError('인증코드가 올바르지 않습니다.');
      }
    } finally {
      setIsLoading(false);
    }
  }, [formData.phone, formData.verificationCode]);

  // 전화번호 변경
  const handleChangePhone = useCallback(async () => {
    if (!isVerified) {
      setError('인증을 완료해주세요.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await api.post('/member/change-phone', {
        password: formData.password,
        phone: formData.phone,
        code: formData.verificationCode,
      });

      if (response.status === 200) {
        setSuccess(true);
        // 성공 시 콜백 호출
        if (onSubmit) {
          onSubmit(
            formData.password,
            formData.phone,
            formData.verificationCode
          );
        }
        // 모달을 닫지 않고 disable 상태로 유지
      } else {
        setError('전화번호 변경에 실패했습니다.');
      }
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'response' in error) {
        const apiError = error as { response: { data: { message?: string } } };
        setError(
          apiError.response.data.message || '전화번호 변경에 실패했습니다.'
        );
      } else {
        setError('전화번호 변경에 실패했습니다.');
      }
    } finally {
      setIsLoading(false);
    }
  }, [isVerified, formData, onClose, onSubmit]);

  // 초기화
  const handleReset = () => {
    setFormData({ password: '', phone: '', verificationCode: '' });
    setIsVerified(false);
    setIsCodeSent(false);
    setShowVerification(false);
    setError(null);
    setSuccess(false);
    codeTimer.stop();
  };

  // Web OTP API 지원 확인 및 자동완성
  useEffect(() => {
    if ('OTPCredential' in window) {
      const abortController = new AbortController();

      navigator.credentials
        .get({
          otp: { transport: ['sms'] },
          signal: abortController.signal,
        } as CredentialRequestOptions)
        .then((credential) => {
          if (credential && 'code' in credential && credential.code) {
            setFormData((prev) => ({
              ...prev,
              verificationCode: credential.code as string,
            }));
            // 자동으로 인증 확인
            setTimeout(() => {
              handleVerifyCode();
            }, 100);
          }
        })
        .catch(() => {
          // 사용자가 취소하거나 지원하지 않는 경우 무시
        });

      return () => {
        abortController.abort();
      };
    }
  }, [handleVerifyCode]);

  if (!open) return null;

  return (
    <ModalPortal
      isOpen={open}
      onClose={() => {
        handleReset();
        onClose();
      }}
    >
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
          {/* 헤더 */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              전화번호 변경
            </h2>
            <button
              onClick={() => {
                handleReset();
                onClose();
              }}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              tabIndex={0}
            >
              <Image src="/close.png" alt="닫기" width={24} height={24} />
            </button>
          </div>

          {/* 성공 메시지 */}
          {success && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-800 text-center">
                전화번호가 성공적으로 변경되었습니다.
              </p>
            </div>
          )}

          {/* 에러 메시지 */}
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 text-center">{error}</p>
            </div>
          )}

          <div className="space-y-4">
            {/* 비밀번호 입력 */}
            <PasswordInput
              label=""
              id="password"
              name="password"
              value={formData.password}
              onChange={handleFormChange('password')}
              placeholder="현재 비밀번호"
              disabled={isVerified || success}
              ref={passwordRef}
            />

            {/* 전화번호 입력 */}
            <InputWithButton
              label=""
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleFormChange('phone')}
              placeholder="변경하려는 전화번호"
              disabled={isCodeSent || isVerified || success}
              buttonText={
                success
                  ? '완료'
                  : isVerified
                    ? '완료'
                    : !isCodeSent
                      ? '인증'
                      : codeTimer.time > 240
                        ? `재전송 (${60 - (300 - codeTimer.time)}초)`
                        : '재전송'
              }
              onButtonClick={handleSendCode}
              buttonDisabled={
                success ||
                isVerified ||
                (isCodeSent && codeTimer.time > 240) ||
                isLoading
              }
              autoComplete="tel"
              ref={phoneRef}
              onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                // Enter 키를 눌렀을 때만 인증코드 전송
                if (
                  e.key === 'Enter' &&
                  !isLoading &&
                  formData.password.trim() &&
                  formData.phone.trim()
                ) {
                  e.preventDefault();
                  handleSendCode();
                }
              }}
            />

            {/* 인증코드 입력 */}
            <VerificationInput
              label=""
              id="verificationCode"
              name="verificationCode"
              value={formData.verificationCode}
              onChange={handleFormChange('verificationCode')}
              placeholder="인증번호"
              disabled={!showVerification || isVerified || success}
              onVerify={handleVerifyCode}
              verifyDisabled={
                !showVerification || isVerified || success || isLoading
              }
              helpText={`휴대폰으로 전송된 인증코드를 입력해주세요.${codeTimer.time > 0 ? ` (${Math.floor(codeTimer.time / 60)}:${(codeTimer.time % 60).toString().padStart(2, '0')})` : ''}`}
              showHelpText={showVerification && !isVerified && !success}
              autoComplete="one-time-code"
              ref={verificationRef}
            />

            {/* 상태 메시지 */}
            {isVerified && (
              <div className="space-y-4">
                <p className="text-sm text-gray-600 text-center">
                  {success
                    ? '전화번호가 성공적으로 변경되었습니다.'
                    : '인증이 완료되었습니다. 전화번호를 변경하시겠습니까?'}
                </p>
              </div>
            )}
          </div>

          {/* 버튼들 */}
          <div className="flex gap-2 mt-6">
            <button
              type="button"
              onClick={handleChangePhone}
              disabled={!isVerified || isLoading || success}
              className="flex-1 h-12 rounded-lg bg-midnight-black text-white font-semibold disabled:bg-gray-300 disabled:text-gray-400 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              tabIndex={0}
            >
              {success ? '완료' : isLoading ? '처리중...' : '변경하기'}
            </button>
            <button
              type="button"
              onClick={handleReset}
              disabled={(!isCodeSent && !isVerified) || success}
              className="px-4 h-12 rounded-lg bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300 transition-colors disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              tabIndex={0}
            >
              초기화
            </button>
          </div>
        </div>
      </div>
    </ModalPortal>
  );
}
