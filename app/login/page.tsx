'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import SearchModal from './SearchModal';
import axios from 'axios';
import { SearchModalType } from '../(shared)/types';
import SocialLoginButtons from '../(shared)/components/SocialLoginButtons';

/**
 * 로그인 페이지
 */
export default function Login() {
  const [id, setId] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isOpen, setIsOpen] = useState<SearchModalType>(null);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  useEffect(() => {
    /**
     * 로그인 상태 확인
     * 토큰 값이 없다면 로그인 페이지 유지
     * 토큰 값이 있다면 메인 페이지 강제 리다이렉트
     */
  }, []);

  const handleIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setId(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const login = async () => {
    const loginResponse = await axios.post(
      'http://snac-alb-35725453.ap-northeast-2.elb.amazonaws.com/api/login',
      {
        email: id,
        password,
      },
      {
        withCredentials: true,
      }
    );

    console.log('로그인 응답', loginResponse);
  };

  const findEmail = () => {
    setIsOpen('id');
  };
  const findPassword = () => {
    setIsOpen('password');
  };

  const test = async () => {
    const testResponse = await axios.post(
      'http://snac-alb-35725453.ap-northeast-2.elb.amazonaws.com/api/reissue',
      {},
      {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      }
    );

    console.log('토큰 재발급 응답', testResponse);
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
          onClick={login}
          className="text-regular-md w-full bg-midnight-black text-cloud-white rounded-xl py-2 text-center text-lg font-normal mb-6"
        >
          로그인
        </button>
        <div className="flex justify-center text-regular-md mb-8">
          <Link href="/user/signup">이메일 가입</Link>
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
