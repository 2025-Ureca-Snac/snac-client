'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import SearchModal from './search-modal';
import { SearchModalType } from '../(shared)/types';
import SocialLoginButtons from '../(shared)/components/social-login-buttons';
import { useAuthStore } from '../(shared)/stores/auth-store';
import { api } from '../(shared)/utils/api';

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

  // Zustand 스토어 사용
  const { user, isLoading, login } = useAuthStore();

  useEffect(() => {
    // 이미 로그인된 상태라면 메인 페이지로 리다이렉트
    if (user) {
      router.push('/');
    }
  }, [user, router]);

  const handleIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setId(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleLogin = async () => {
    if (!id || !password) {
      alert('아이디와 비밀번호를 입력해주세요.');
      return;
    }

    try {
      await login(id, password);
      // 로그인 성공 시 메인 페이지로 이동
      //router.push('/');
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

  const test = async () => {
    try {
      const testResponse = await api.post('/reissue');
      console.log('토큰 재발급 응답', testResponse);
    } catch (error) {
      console.error('토큰 재발급 실패:', error);
    }
  };

  return (
    <div className="w-full md:w-1/2 flex justify-center items-center px-6 py-8 md:px-0 md:h-screen">
      <div className="w-full max-w-sm md:w-[80%]">
        <h2 className="text-heading-2xl md:text-heading-3xl mb-8">로그인</h2>
        <input
          type="text"
          placeholder="아이디"
          value={id}
          onChange={handleIdChange}
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
        <button
          onClick={handleLogin}
          disabled={isLoading}
          className="text-regular-md w-full bg-midnight-black text-cloud-white rounded-xl py-2 text-center text-lg font-normal mb-6 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? '로그인 중...' : '로그인'}
        </button>
        <div className="flex justify-center text-regular-md mb-8">
          <Link href="/signUp">이메일 가입</Link>
          <span className="mx-4 md:mx-7">|</span>
          <button onClick={findEmail}>이메일 찾기</button>
          <span className="mx-4 md:mx-7">|</span>
          <button onClick={findPassword}>비밀번호 찾기</button>
        </div>
        <SocialLoginButtons />
        <button onClick={test}>테스트</button>
      </div>
      {isOpen && <SearchModal isOpen={isOpen} setIsOpen={setIsOpen} />}
    </div>
  );
}
