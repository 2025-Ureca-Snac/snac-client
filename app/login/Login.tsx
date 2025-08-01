'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import SearchModal from './search-modal';
import { SearchModalType } from '../(shared)/types';
import { toast } from 'sonner';
import SocialLoginButtons from '../(shared)/components/social-login-buttons';
import { useAuthStore } from '../(shared)/stores/auth-store';

/**
 * @author 이승우
 * @description 로그인 페이지
 */
export default function Login() {
  const router = useRouter();
  const [id, setId] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isOpen, setIsOpen] = useState<SearchModalType>(null);
  const [showPassword, setShowPassword] = useState<boolean>(false);
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

  const handleIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setId(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!id || !password) {
      toast.error('아이디와 비밀번호를 입력해주세요.');
      return;
    }

    try {
      await login(id, password);
    } catch (error) {
      // 에러는 스토어에서 처리됨
      console.error('로그인 실패:', error);
    }
  };

  const findEmail = () => {
    setIsOpen('id');
  };
  const findPassword = () => {
    setIsOpen('password');
  };

  const handleSocialError = (message: string) => {
    setSocialError(message);
  };

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
            className="text-regular-md block w-full border-b-2 border-gray-300 p-2 py-4 focus:outline-none focus:border-b-2 focus:border-gray-700 mb-4"
          />
          <div className="relative flex items-center w-full mb-6">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="비밀번호"
              value={password}
              onChange={handlePasswordChange}
              className="text-regular-md block w-full border-b-2 border-gray-300 p-2 py-4 pr-10 focus:outline-none focus:border-b-2 focus:border-gray-700"
            />
            <button
              type="button"
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? '비밀번호 숨기기' : '비밀번호 보기'}
            >
              {showPassword ? (
                <Image
                  src="/eye-open.png"
                  width={22}
                  height={22}
                  alt="비밀번호 보기"
                />
              ) : (
                // 눈 가린 아이콘 (비밀번호 숨김 상태)
                <Image
                  src="/eye-closed.png"
                  width={22}
                  height={22}
                  alt="비밀번호 숨기기"
                />
              )}
            </button>
          </div>

          {/* 오류 메시지 */}
          {(error || socialError) && (
            <div className="flex items-start gap-2 mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex-shrink-0 mt-0.5">
                <svg
                  className="w-4 h-4 text-red-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <p className="text-sm text-red-800">{error || socialError}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            tabIndex={0}
            className="text-regular-md w-full bg-midnight-black text-cloud-white rounded-xl py-2 text-center text-lg font-normal mb-6 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {isLoading ? '로그인 중...' : '로그인'}
          </button>
        </form>
        <div className="flex justify-center text-regular-md mb-8">
          <Link
            href="/signUp"
            className="focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 rounded px-1"
          >
            회원가입
          </Link>
          <span className="mx-4 md:mx-7">|</span>
          <button
            onClick={findEmail}
            className="focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 rounded px-1"
            tabIndex={0}
          >
            이메일 찾기
          </button>
          <span className="mx-4 md:mx-7">|</span>
          <button
            onClick={findPassword}
            className="focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 rounded px-1"
            tabIndex={0}
          >
            비밀번호 찾기
          </button>
        </div>
        <SocialLoginButtons onError={handleSocialError} />
      </div>
      {isOpen && <SearchModal isOpen={isOpen} setIsOpen={setIsOpen} />}
    </div>
  );
}
