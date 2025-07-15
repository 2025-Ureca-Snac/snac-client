'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MenuLink } from './MenuLink';

// TODO: 실제 로그인 상태를 부모 또는 컨텍스트에서 받아오도록 수정 예정 (2025-07-09)
export const Header = () => {
  const isLoggedIn = false; // 로그인 로직 연동 전 기본값

  return (
    <header className="w-full bg-white h-[57px] md:h-[67px] px-6 flex justify-between items-center md:pl-[160px] md:pr-[51px]">
      <Link href="/">
        <Image src="/logo_mobile.svg" alt="스낵 로고" width={68} height={25} />
      </Link>

      <div className="flex gap-4">
        <MenuLink
          href="/matching"
          imgSrc="/matching.png"
          alt="실시간 매칭"
          text="실시간 매칭"
        />

        {isLoggedIn ? (
          <MenuLink
            href="/mypage"
            imgSrc="/user.png"
            alt="마이페이지"
            text="마이페이지"
          />
        ) : (
          <Link
            href="/login"
            className="ml-4 text-regular-sm text-midnight-black"
          >
            로그인
          </Link>
        )}
      </div>
    </header>
  );
};
