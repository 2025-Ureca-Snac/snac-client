import React, { useState, useRef, useEffect, useCallback } from 'react';
import ModalPortal from './modal-portal';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import type { ChangePasswordModalProps } from '../types/change-password-modal';
import {
  checkPasswordMatch,
  validatePassword,
} from '../utils/password-validation';
import { api } from '../utils/api';
import { useAuthStore } from '../stores/auth-store';
import { toast } from 'sonner';

/**
 * @author 이승우
 * @description 비밀번호 변경 모달 컴포넌트{@link ChangePasswordModalProps(open, onClose, onSubmit)}
 * @param {boolean} open 모달 열림 상태
 * @param {Function} onClose 모달 닫기 함수
 * @param {Function} onSubmit 비밀번호 변경 함수
 */
export default function ChangePasswordModal({
  open,
  onClose,
  onSubmit,
}: ChangePasswordModalProps) {
  const router = useRouter();
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');

  // 비밀번호 표시/숨기기 상태
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // 비밀번호 일치 여부 상태
  const [passwordMatch, setPasswordMatch] = useState<
    'none' | 'match' | 'mismatch'
  >('none');

  // 새 비밀번호 유효성 검사 상태
  const [passwordValidation, setPasswordValidation] = useState<{
    isValid: boolean;
    errors: string[];
    strength: 'weak' | 'medium' | 'strong';
  }>({ isValid: false, errors: [], strength: 'weak' });

  // API 호출 상태
  const [isLoading, setIsLoading] = useState(false);

  // 키보드 접근성을 위한 ref들
  const currentPasswordRef = useRef<HTMLInputElement>(null);
  const newPasswordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);
  const submitButtonRef = useRef<HTMLButtonElement>(null);

  // 모달이 열릴 때 현재 비밀번호 필드에 자동 포커스
  useEffect(() => {
    if (open) {
      setTimeout(() => {
        currentPasswordRef.current?.focus();
      }, 100);
    }
  }, [open]);

  // 비밀번호 일치 여부 확인
  useEffect(() => {
    if (next === '' || confirm === '') {
      setPasswordMatch('none');
    } else if (checkPasswordMatch(next, confirm)) {
      setPasswordMatch('match');
    } else {
      setPasswordMatch('mismatch');
    }
  }, [next, confirm]);

  // 새 비밀번호 유효성 검사
  useEffect(() => {
    if (next.trim()) {
      const validation = validatePassword(next);
      setPasswordValidation(validation);
    } else {
      setPasswordValidation({ isValid: false, errors: [], strength: 'weak' });
    }
  }, [next]);

  // 비밀번호 변경 API 호출
  const handlePasswordChange = useCallback(async () => {
    if (!current.trim() || !next.trim() || !confirm.trim()) {
      toast.error('모든 필드를 입력해주세요.');
      return;
    }

    // 새 비밀번호 유효성 검사
    const validation = validatePassword(next);
    if (!validation.isValid) {
      toast.error(validation.errors[0]);
      return;
    }

    if (passwordMatch !== 'match') {
      toast.error('비밀번호가 일치하지 않습니다.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await api.post('/member/change-pwd', {
        currentPwd: current,
        newPwd: next,
      });

      if (response.status === 200) {
        toast.success(
          '비밀번호가 성공적으로 변경되었습니다. 다시 로그인해주세요.'
        );

        // 성공 시 콜백 호출
        if (onSubmit) {
          onSubmit(current, next, confirm);
        }

        // 비밀번호 변경 성공 후 로그아웃 처리
        const { logout } = useAuthStore.getState();
        await logout();

        // 모달 닫기
        onClose();

        // 로그인 페이지로 리다이렉트
        router.push('/login');
      } else {
        toast.error('비밀번호 변경에 실패했습니다.');
      }
    } catch (error: unknown) {
      // 에러 메시지 처리
      if (error && typeof error === 'object' && 'response' in error) {
        const apiError = error as {
          response?: { data?: { message?: string }; status?: number };
        };
        if (apiError.response?.data?.message) {
          toast.error(apiError.response.data.message);
        } else if (apiError.response?.status === 400) {
          toast.error('현재 비밀번호가 올바르지 않습니다.');
        } else if (apiError.response?.status === 401) {
          toast.error('인증이 필요합니다. 다시 로그인해주세요.');
        } else {
          toast.error('비밀번호 변경 중 오류가 발생했습니다.');
        }
      } else {
        toast.error('비밀번호 변경 중 오류가 발생했습니다.');
      }
    } finally {
      setIsLoading(false);
    }
  }, [current, next, confirm, passwordMatch, onSubmit, onClose, router]);

  // 초기화
  const handleReset = () => {
    setCurrent('');
    setNext('');
    setConfirm('');
    setIsLoading(false);
  };

  // 폼 제출 핸들러
  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      handlePasswordChange();
    },
    [handlePasswordChange]
  );

  // 키보드 이벤트 핸들러
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    },
    [onClose]
  );

  // 현재 비밀번호 입력 후 새 비밀번호로 포커스 이동
  const handleCurrentPasswordKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && current.trim()) {
        e.preventDefault();
        newPasswordRef.current?.focus();
      }
    },
    [current]
  );

  // 새 비밀번호 입력 후 확인 비밀번호로 포커스 이동
  const handleNewPasswordKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && next.trim()) {
        e.preventDefault();
        confirmPasswordRef.current?.focus();
      }
    },
    [next]
  );

  // 확인 비밀번호 입력 후 바로 API 호출
  const handleConfirmPasswordKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && confirm.trim()) {
        e.preventDefault();
        // 비밀번호 일치하고 모든 필드가 입력되었으면 바로 API 호출
        if (passwordMatch === 'match' && current.trim() && next.trim()) {
          handlePasswordChange();
        } else {
          // 조건이 맞지 않으면 제출 버튼으로 포커스
          submitButtonRef.current?.focus();
        }
      }
    },
    [confirm, passwordMatch, current, next, handlePasswordChange]
  );

  return (
    <ModalPortal
      isOpen={open}
      onClose={() => {
        handleReset();
        onClose();
      }}
    >
      <div
        className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50"
        onClick={() => {
          handleReset();
          onClose();
        }}
        tabIndex={-1}
        aria-modal="true"
        role="dialog"
        onKeyDown={handleKeyDown}
      >
        <form
          className="bg-card rounded-2xl shadow-xl w-[370px] max-w-full pt-6 pb-8 px-6 relative flex flex-col items-center"
          onClick={(e) => e.stopPropagation()}
          onSubmit={handleSubmit}
        >
          {/* 상단 아이콘 */}
          <div className="flex flex-col items-center -mt-12 mb-2">
            <div
              className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-2 border-4 border-white shadow"
              style={{ marginTop: '-32px' }}
            >
              <svg width="32" height="32" fill="none" viewBox="0 0 24 24">
                <path
                  d="M19 11H5C3.89543 11 3 11.8954 3 13V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V13C21 11.8954 20.1046 11 19 11Z"
                  fill="#DBEAFE"
                  stroke="#2563EB"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M7 11V7C7 5.67392 7.52678 4.40215 8.46447 3.46447C9.40215 2.52678 10.6739 2 12 2C13.3261 2 14.5979 2.52678 15.5355 3.46447C16.4732 4.40215 17 5.67392 17 7V11"
                  fill="#DBEAFE"
                  stroke="#2563EB"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div className="text-xl font-extrabold text-card-foreground text-center">
              비밀번호 변경
            </div>
            <button
              onClick={() => {
                handleReset();
                onClose();
              }}
              type="button"
              className="absolute right-4 top-4 text-2xl text-muted-foreground hover:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
              aria-label="닫기"
              tabIndex={0}
            >
              ×
            </button>
          </div>
          <div className="w-full text-center text-muted-foreground mb-4 text-sm">
            변경하려면 비밀번호를 입력하세요.
          </div>
          <div className="w-full flex flex-col gap-3 mb-4">
            <div>
              <label
                htmlFor="current-password"
                className="block text-sm font-medium text-foreground mb-2"
              >
                현재 비밀번호
              </label>
              <div className="relative">
                <input
                  ref={currentPasswordRef}
                  id="current-password"
                  type={showCurrentPassword ? 'text' : 'password'}
                  className="w-full px-3 py-3 pr-10 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-secondary disabled:cursor-not-allowed h-[48px]"
                  value={current}
                  onChange={(e) => setCurrent(e.target.value)}
                  onKeyDown={handleCurrentPasswordKeyDown}
                  placeholder="현재 비밀번호"
                  autoComplete="current-password"
                  required
                  tabIndex={0}
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  tabIndex={0}
                  aria-label={
                    showCurrentPassword
                      ? '현재 비밀번호 숨기기'
                      : '현재 비밀번호 보기'
                  }
                >
                  <Image
                    src={
                      showCurrentPassword ? '/eye-open.png' : '/eye-closed.png'
                    }
                    alt={
                      showCurrentPassword ? '비밀번호 숨기기' : '비밀번호 보기'
                    }
                    width={20}
                    height={20}
                  />
                </button>
              </div>
            </div>
            <div>
              <label
                htmlFor="new-password"
                className="block text-sm font-medium text-foreground mb-2"
              >
                새 비밀번호
              </label>
              <div className="relative">
                <input
                  ref={newPasswordRef}
                  id="new-password"
                  type={showNewPassword ? 'text' : 'password'}
                  className={`w-full px-3 py-3 pr-10 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent disabled:bg-secondary disabled:cursor-not-allowed h-[48px] ${
                    next.trim() && !passwordValidation.isValid
                      ? 'border-red-300 focus:ring-red-200'
                      : next.trim() && passwordValidation.isValid
                        ? 'border-green-300 focus:ring-green-200'
                        : 'border-border focus:ring-blue-500'
                  }`}
                  value={next}
                  onChange={(e) => setNext(e.target.value)}
                  onKeyDown={handleNewPasswordKeyDown}
                  placeholder="새 비밀번호"
                  autoComplete="new-password"
                  required
                  tabIndex={0}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  tabIndex={0}
                  aria-label={
                    showNewPassword ? '새 비밀번호 숨기기' : '새 비밀번호 보기'
                  }
                >
                  <Image
                    src={showNewPassword ? '/eye-open.png' : '/eye-closed.png'}
                    alt={showNewPassword ? '비밀번호 숨기기' : '비밀번호 보기'}
                    width={20}
                    height={20}
                  />
                </button>
              </div>
              {/* 비밀번호 요구사항 체크리스트 */}
              <div className="text-sm mt-2 space-y-1">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-3 h-3 rounded-full flex items-center justify-center ${
                      next.length >= 6 && next.length <= 12
                        ? 'bg-green-500'
                        : 'bg-red-300'
                    }`}
                  >
                    {next.length >= 6 && next.length <= 12 && (
                      <svg
                        className="w-2 h-2 text-primary-foreground"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                  <span
                    className={
                      next.length >= 6 && next.length <= 12
                        ? 'text-green-600'
                        : 'text-red-500'
                    }
                  >
                    6~12자 길이
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className={`w-3 h-3 rounded-full flex items-center justify-center ${
                      /[a-zA-Z]/.test(next) ? 'bg-green-500' : 'bg-red-300'
                    }`}
                  >
                    {/[a-zA-Z]/.test(next) && (
                      <svg
                        className="w-2 h-2 text-primary-foreground"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                  <span
                    className={
                      /[a-zA-Z]/.test(next) ? 'text-green-600' : 'text-red-500'
                    }
                  >
                    영어 포함 (대소문자 구분 없음)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className={`w-3 h-3 rounded-full flex items-center justify-center ${
                      /\d/.test(next) ? 'bg-green-500' : 'bg-red-300'
                    }`}
                  >
                    {/\d/.test(next) && (
                      <svg
                        className="w-2 h-2 text-primary-foreground"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                  <span
                    className={
                      /\d/.test(next) ? 'text-green-600' : 'text-red-500'
                    }
                  >
                    숫자 포함
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className={`w-3 h-3 rounded-full flex items-center justify-center ${
                      /[!?@#$%^&*()~`+\-_]/.test(next)
                        ? 'bg-green-500'
                        : 'bg-red-300'
                    }`}
                  >
                    {/[!?@#$%^&*()~`+\-_]/.test(next) && (
                      <svg
                        className="w-2 h-2 text-primary-foreground"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                  <span
                    className={
                      /[!?@#$%^&*()~`+\-_]/.test(next)
                        ? 'text-green-600'
                        : 'text-red-500'
                    }
                  >
                    특수기호 포함 (! ? @ # $ % ^ & * ( ) ~ ` + - _)
                  </span>
                </div>
              </div>
            </div>
            <div>
              <label
                htmlFor="confirm-password"
                className="block text-sm font-medium text-foreground mb-2"
              >
                새 비밀번호 한 번 더 입력
              </label>
              <div className="relative">
                <input
                  ref={confirmPasswordRef}
                  id="confirm-password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  className="w-full px-3 py-3 pr-10 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-secondary disabled:cursor-not-allowed h-[48px]"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  onKeyDown={handleConfirmPasswordKeyDown}
                  placeholder="새 비밀번호 한 번 더 입력"
                  autoComplete="new-password"
                  required
                  tabIndex={0}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  tabIndex={0}
                  aria-label={
                    showConfirmPassword
                      ? '확인 비밀번호 숨기기'
                      : '확인 비밀번호 보기'
                  }
                >
                  <Image
                    src={
                      showConfirmPassword ? '/eye-open.png' : '/eye-closed.png'
                    }
                    alt={
                      showConfirmPassword ? '비밀번호 숨기기' : '비밀번호 보기'
                    }
                    width={20}
                    height={20}
                  />
                </button>
              </div>
              {/* 비밀번호 일치 여부 표시 - 항상 표시하여 높이 유지 */}
              <p
                className={`text-sm mt-2 min-h-[20px] ${passwordMatch === 'match' ? 'text-green-500' : passwordMatch === 'mismatch' ? 'text-red-500' : 'text-transparent'}`}
              >
                {passwordMatch === 'match'
                  ? '비밀번호가 일치합니다.'
                  : passwordMatch === 'mismatch'
                    ? '비밀번호가 일치하지 않습니다.'
                    : '\u00A0'}
              </p>
            </div>
          </div>
          <div className="w-full flex gap-2 mb-2">
            <button
              ref={submitButtonRef}
              type="submit"
              disabled={
                passwordMatch !== 'match' ||
                !current.trim() ||
                !passwordValidation.isValid ||
                isLoading
              }
              className="w-2/3 py-3 rounded-lg bg-blue-200 text-card-foreground font-medium hover:bg-blue-300 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed"
              tabIndex={0}
            >
              {isLoading ? '변경 중...' : '변경하기'}
            </button>
            <button
              type="button"
              className="w-1/3 py-3 rounded-lg bg-secondary text-foreground font-medium hover:bg-muted transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              onClick={onClose}
              disabled={isLoading}
              tabIndex={0}
            >
              취소
            </button>
          </div>
        </form>
      </div>
    </ModalPortal>
  );
}
