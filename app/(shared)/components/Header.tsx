'use client';

import { useAuthStore } from '@/app/(shared)/stores/auth-store';
import { AuthState } from '@/app/(shared)/types/auth-store';
import React, { FC } from 'react';
import Link from 'next/link';
import { MenuLink } from './MenuLink';
import LogoMobile from '@/public/logo_mobile.svg';
import Matching from '@/public/matching.svg';
import User from '@/public/user.svg';
import Admin from '@/public/admin.svg';
import Login from '@/public/login.svg';

const ADMIN_ROLE = 'ADMIN';
export const Header: FC<{
  isTrading?: boolean;
  isDarkmode?: boolean;
}> = ({ isTrading = false, isDarkmode = false }) => {
  const user = useAuthStore((state: AuthState) => state.user);
  const role = useAuthStore((state: AuthState) => state.role);
  const isLoggedIn: boolean = !!user;
  const isAdmin: boolean = role === ADMIN_ROLE;

  return (
    <header
      className={`w-full h-[57px] md:h-[67px] px-6 flex justify-between items-center md:pl-[160px] md:pr-[51px] relative ${
        isDarkmode
          ? 'bg-gradient-to-r from-gray-900 via-black to-gray-900 border-b border-gray-800/50'
          : 'bg-white'
      }`}
    >
      {/* 다크모드일 때 서브틀한 글로우 효과 */}
      {isDarkmode && (
        <>
          <div className="absolute inset-0 bg-gradient-to-r from-green-400/5 via-transparent to-blue-300/3"></div>
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-96 h-16 bg-green-400 rounded-full mix-blend-multiply filter blur-3xl opacity-5"></div>
        </>
      )}

      <div className="relative z-10">
        {isDarkmode ? (
          <Link href="/">
            <Image
              src="/logo_mobile_dark.png"
              alt="스낙 로고"
              width={100}
              height={25}
            />
          </Link>
        ) : (
          <Link href="/">
            <Image
              src="/logo_mobile.svg"
              alt="스낙 로고"
              width={100}
              height={25}
              className={isDarkmode ? 'filter brightness-0 invert' : ''}
            />
          </Link>
        )}
      </div>

      <div className="relative z-10 flex gap-4 items-center">
        {isAdmin && (
          <MenuLink
            href="/admin"
            IconComponent={Admin}
            alt="관리자 페이지"
            text="관리자"
          />
        )}

        {isTrading ? (
          <></>
        ) : (
          <MenuLink
            href="/match"
            IconComponent={Matching}
            alt="실시간 매칭"
            text="실시간 매칭"
            isDarkMode={isDarkmode}
          />
        )}

        {isLoggedIn ? (
          <MenuLink
            href="/mypage"
            IconComponent={User}
            alt="마이페이지"
            text="마이페이지"
            isDarkMode={isDarkmode}
          />
        ) : (
          <MenuLink
            href="/login"
            IconComponent={Login}
            alt="로그인"
            text="로그인"
            isDarkMode={isDarkmode}
          />
        )}
      </div>
    </header>
  );
};
