'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import SearchModal from './search-modal';
import { SearchModalType } from '../(shared)/types';
import { toast } from 'sonner';
import SocialLoginButtons from '../(shared)/components/social-login-buttons';
import { useAuthStore } from '../(shared)/stores/auth-store';
import PasswordInputField from '../(shared)/components/password-input-field';
import ErrorMessage from '../(shared)/components/error-message';
import LoginBottomLinks from '../(shared)/components/login-bottom-links';
import LoadingSpinner from '../(shared)/components/LoadingSpinner';

/**
 * @author 이승우
 * @description 로그인 페이지
 */
export default function Login() {
  const router = useRouter();
  const [id, setId] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isOpen, setIsOpen] = useState<SearchModalType>(null);
  const [socialError, setSocialError] = useState<string | null>(null);

  // Zustand 스토어 사용
  const { user, isLoading, error, login } = useAuthStore();

  // 아이디 입력란 ref
  const idInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // 이미 로그인된 상태라면 메인 페이지로 리다이렉트
    if (user) {
      router.push('/');
    }
  }, [user, router]);

  useEffect(() => {
    // 페이지 진입 시 아이디 입력란 자동 포커스
    idInputRef.current?.focus();
  }, []);

  /**
   * @author 이승우
   * @description 아이디 입력값 변경 핸들러
   * @param e - 입력 이벤트
   */
  const handleIdChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setId(e.target.value);
    },
    []
  );

  /**
   * @author 이승우
   * @description 비밀번호 입력값 변경 핸들러
   * @param e - 입력 이벤트
   */
  const handlePasswordChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setPassword(e.target.value);
    },
    []
  );

  /**
   * @author 이승우
   * @description 로그인 처리 핸들러
   * @param e - 폼 제출 이벤트 (선택사항)
   */
  const handleLogin = useCallback(
    async (e?: React.FormEvent) => {
      if (e) e.preventDefault();

      // 입력값 검증
      if (!id.trim() || !password.trim()) {
        toast.error('아이디와 비밀번호를 입력해주세요.');
        return;
      }

      try {
        await login(id.trim(), password);
      } catch {
        // 에러는 스토어에서 처리됨
      }
    },
    [id, password, login]
  );

  /**
   * @author 이승우
   * @description 이메일 찾기 모달 열기
   */
  const findEmail = () => {
    setIsOpen('id');
  };

  /**
   * @author 이승우
   * @description 비밀번호 찾기 모달 열기
   */
  const findPassword = () => {
    setIsOpen('password');
  };

  /**
   * @author 이승우
   * @description 소셜 로그인 에러 처리
   * @param message - 에러 메시지
   */
  const handleSocialError = (message: string) => {
    setSocialError(message);
  };

  // 로딩 중일 때 스피너 표시
  if (isLoading) {
    return (
      <div className="w-full md:w-1/2 flex justify-center items-center px-6 py-8 md:px-0 md:h-screen">
        <div className="w-full max-w-sm md:w-[80%] text-center">
          <LoadingSpinner size="lg" color="border-blue-600" />
          <p className="text-muted-foreground">로그인 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full md:w-1/2 flex justify-center items-center px-6 py-8 md:px-0 md:h-screen">
      <div className="w-full max-w-sm md:w-[80%]">
        <h2 className="text-heading-2xl md:text-heading-3xl mb-8">로그인</h2>
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="아이디"
            value={id}
            onChange={handleIdChange}
            ref={idInputRef}
            className="text-regular-md block w-full border-b-2 border-border p-2 py-4 focus:outline-none focus:border-b-2 focus:border-border mb-4"
          />
          <PasswordInputField
            value={password}
            onChange={handlePasswordChange}
            placeholder="비밀번호"
            className="mb-6"
          />

          {/* 오류 메시지 */}
          {(error || socialError) && (
            <ErrorMessage
              message={error || socialError || ''}
              className="mb-4"
            />
          )}

          <button
            type="submit"
            disabled={isLoading}
            tabIndex={0}
            className="text-regular-md w-full bg-black text-cloud-white rounded-xl py-2 text-center text-lg font-normal mb-6 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {isLoading ? '로그인 중...' : '로그인'}
          </button>
        </form>
        <LoginBottomLinks
          onFindEmail={findEmail}
          onFindPassword={findPassword}
        />
        <SocialLoginButtons onError={handleSocialError} />
      </div>
      {isOpen && <SearchModal isOpen={isOpen} setIsOpen={setIsOpen} />}
    </div>
  );
}
