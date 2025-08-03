'use client';

import React, { FC, useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

import { useAuthStore } from '@/app/(shared)/stores/auth-store';
import { AuthState } from '@/app/(shared)/types/auth-store';

import { MenuLink } from './MenuLink';
import { ThemeSwitch } from '@/app/(shared)/components/ThemSwitch';

import Matching from '@/public/matching.svg';
import User from '@/public/user.svg';
import Admin from '@/public/admin.svg';
import Login from '@/public/login.svg';

const ADMIN_ROLE = 'ADMIN';

interface HeaderProps {
  isDarkmode?: boolean;
  onToggle?: () => void;
  isTrading?: boolean;
}

export const Header: FC<HeaderProps> = ({
  isDarkmode,
  onToggle,
  isTrading = false,
}) => {
  const user = useAuthStore((state: AuthState) => state.user);
  const role = useAuthStore((state: AuthState) => state.role);
  const isLoggedIn: boolean = !!user;
  const isAdmin: boolean = role === ADMIN_ROLE;

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <header className="w-full h-[57px] md:h-[67px]" />;
  }

  return (
    <header
      className={`w-full h-[57px] md:h-[67px] px-6 flex md:px-0 justify-between items-center relative transition-colors duration-300 ${
        isDarkmode
          ? 'bg-gradient-to-r from-gray-900 via-black to-gray-900 border-b border-gray-800/50'
          : 'bg-white border-b'
      }`}
    >
      {isDarkmode && (
        <>
          <div className="absolute inset-0 bg-gradient-to-r from-green-400/5 via-transparent to-blue-300/3"></div>
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-96 h-16 bg-green-400 rounded-full mix-blend-multiply filter blur-3xl opacity-5"></div>
        </>
      )}

      <div className="relative z-10">
        <Link href="/">
          <Image
            src={isDarkmode ? '/logo_mobile_dark.png' : '/logo_mobile.svg'}
            alt="스낙 로고"
            width={100}
            height={25}
            priority
          />
        </Link>
      </div>

      <div className="relative z-10 flex gap-4 items-center">
        {isAdmin && (
          <MenuLink
            href="/admin"
            IconComponent={Admin}
            alt="관리자 페이지"
            text="관리자"
            isDarkmode={isDarkmode}
          />
        )}

        {isTrading ? null : (
          <MenuLink
            href="/match"
            IconComponent={Matching}
            alt="실시간 매칭"
            text="실시간 매칭"
            isDarkmode={isDarkmode}
          />
        )}

        {isLoggedIn ? (
          <MenuLink
            href="/mypage"
            IconComponent={User}
            alt="마이페이지"
            text="마이페이지"
            isDarkmode={isDarkmode}
          />
        ) : (
          <MenuLink
            href="/login"
            IconComponent={Login}
            alt="로그인"
            text="로그인"
            isDarkmode={isDarkmode}
          />
        )}

        {/* ThemeSwitch에 isDarkmode onToggle props 전달 */}
        {onToggle && <ThemeSwitch isDark={isDarkmode} onToggle={onToggle} />}
      </div>
    </header>
  );
};
