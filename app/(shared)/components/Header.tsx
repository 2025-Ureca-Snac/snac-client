'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

//TODO: 로그인 기능 다 되면, 부모로부터 USER 객체 PROPS 받아오도록 수정하기! (2025-07-09)
interface HeaderProps {}

export const Header = ({}: HeaderProps) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  return (
    <header className="w-full bg-white h-[57px] lg:h-[67px] white px-6 flex justify-between items-center lg:pl-[160px] lg:pr-[51px]">
      <Link href="/">
        <Image src="/logo_mobile.svg" alt="스낵 로고" width={68} height={25} />
      </Link>

      <div className="flex gap-4">
        <Link href="/mypage" className="flex gap-2">
          <Image src="/matching.png" alt="스낵 로고" width={24} height={24} />
          <span className="hidden md:flex text-midnight-black text-regular-sm ">
            실시간 매칭
          </span>
        </Link>
        {isLoggedIn ? (
          <Link href="/mypage" className="flex gap-2">
            <Image src="/user.png" alt="스낵 로고" width={24} height={24} />
            <span className="hidden md:flex text-midnight-black text-regular-sm ">
              마이페이지
            </span>
          </Link>
        ) : (
          <Link
            href="/login"
            className="ml-4 text-regular-sm text-midnight-black"
          >
            로그인
          </Link>
        )}
      </div>
      {/* --- 테스트용 버튼: 나중에 삭제하기! --- */}
      <button
        onClick={() => setIsLoggedIn(!isLoggedIn)}
        className="absolute top-20 right-4 bg-blue-500 text-white p-2 rounded"
      >
        로그인 상태 전환
      </button>
    </header>
  );
};
