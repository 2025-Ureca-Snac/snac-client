'use client';

import { useAuthStore } from '@/app/(shared)/stores/auth-store';
import React, { FC } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MenuLink } from './MenuLink';

export const Header: FC = () => {
  const user = useAuthStore((state) => state.user);
  const isLoggedIn: boolean = !!user;

  return (
    <header className="w-full bg-white h-[57px] md:h-[67px] px-6 flex justify-between items-center md:pl-[160px] md:pr-[51px]">
      <Link href="/">
        <Image src="/logo_mobile.svg" alt="스낵 로고" width={68} height={25} />
      </Link>

      <div className="flex gap-4 items-center">
        <MenuLink
          href="/match"
          imgSrc="/matching.svg"
          alt="실시간 매칭"
          text="실시간 매칭"
        />

        {isLoggedIn ? (
          <MenuLink
            href="/mypage"
            imgSrc="/user.svg"
            alt="마이페이지"
            text="마이페이지"
          />
        ) : (
          <MenuLink
            href="/login"
            imgSrc="/login.svg"
            alt="로그인"
            text="로그인"
          />
        )}
      </div>
    </header>
  );
};
