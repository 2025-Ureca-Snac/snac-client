'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

/**
 * 로그인 페이지
 */
export default function Login() {
  const [id, setId] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isOpen, setIsOpen] = useState<number>(0);

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

  const login = () => {
    console.log('로그인');
  };

  const findEmail = () => {
    setIsOpen(1);
  };
  const findPassword = () => {
    setIsOpen(2);
  };

  return (
    <div className="w-1/2 h-screen flex justify-center items-center">
      <div>
        <h2 className="text-2xl font-bold">로그인</h2>
        <input
          type="text"
          placeholder="아이디"
          value={id}
          onChange={handleIdChange}
          className="block border-b-2 border-gray-300 p-2 focus:outline-none focus:border-b-2 focus:border-gray-700"
        />
        <input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={handlePasswordChange}
          className="block border-b-2 border-gray-300 p-2 focus:outline-none focus:border-b-2 focus:border-gray-700"
        />
        <button onClick={login}>로그인</button>
        <div>
          <Link href="/user/signup">이메일 가입</Link>
          <span className="mx-2">|</span>
          <button onClick={findEmail}>이메일 찾기</button>
          <span className="mx-2">|</span>
          <button onClick={findPassword}>비밀번호 찾기</button>
        </div>
        <button>카카오톡 로그인</button>
        <button>네이버 로그인</button>
      </div>
    </div>
  );
}
