'use client';

import React, { FC, useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/app/(shared)/stores/auth-store';
import { AuthState } from '@/app/(shared)/types/auth-store';

import { MenuLink } from './MenuLink';
import { ThemeSwitch } from '@/app/(shared)/components/ThemSwitch'; // 오타 수정: ThemSwitch -> ThemeSwitch

import LogoMobile from '@/public/logo_mobile.svg';
import Matching from '@/public/matching.svg';
import User from '@/public/user.svg';
import Admin from '@/public/admin.svg';
import Login from '@/public/login.svg';

const ADMIN_ROLE = 'ADMIN';

// isDarkMode와 onToggle을 props로 받도록 인터페이스 정의
interface HeaderProps {
  isDarkMode: boolean;
  onToggle: () => void;
}

export const Header: FC<HeaderProps> = ({ isDarkMode, onToggle }) => {
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
      className={`w-full h-[57px] md:h-[67px] px-6 md:px-0 flex justify-between items-center ${isDarkMode ? 'dark' : ''}`}
    >
      <Link href="/" aria-label="스낵 로고">
        <LogoMobile
          width={100}
          height={25}
          className="text-black dark:text-white"
          aria-hidden="true"
        />
      </Link>

      <div className="flex gap-4 items-center">
        {isAdmin && (
          <MenuLink
            href="/admin"
            IconComponent={Admin}
            alt="관리자 페이지"
            text="관리자"
          />
        )}

        <MenuLink
          href="/match"
          IconComponent={Matching}
          alt="실시간 매칭"
          text="실시간 매칭"
        />

        {isLoggedIn ? (
          <MenuLink
            href="/mypage"
            IconComponent={User}
            alt="마이페이지"
            text="마이페이지"
          />
        ) : (
          <MenuLink
            href="/login"
            IconComponent={Login}
            alt="로그인"
            text="로그인"
          />
        )}

        {/* isDarkMode와 onToggle props를 그대로 전달 */}
        <ThemeSwitch isDarkMode={isDarkMode} onToggle={onToggle} />
      </div>
    </header>
  );
};
