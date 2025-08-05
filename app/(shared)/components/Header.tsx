'use client';

import React, { FC, useEffect, useState, Fragment } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';

import { useAuthStore } from '@/app/(shared)/stores/auth-store';
import { AuthState } from '@/app/(shared)/types/auth-store';
import { useTheme } from '@/app/(shared)/hooks/useTheme';

import { ThemeSwitch } from '@/app/(shared)/components/ThemSwitch';

import Matching from '@/public/matching.svg';
import User from '@/public/user.svg';
import Admin from '@/public/admin.svg';
import Login from '@/public/login.svg';
import Blog from '@/public/blog.svg';
import Menu from '@/public/menu.svg';

import { Dialog, Transition } from '@headlessui/react';

const ADMIN_ROLE = 'ADMIN';

interface HeaderProps {
  isTrading?: boolean;
}

interface NavItemShowProps {
  isAdmin: boolean;
  isTrading: boolean;
  isLoggedIn: boolean;
}

const NAV_ITEMS = [
  {
    key: 'admin',
    href: '/admin',
    icon: Admin,
    text: '관리자',
    show: ({ isAdmin }: NavItemShowProps) => isAdmin,
  },
  {
    key: 'match',
    href: '/match',
    icon: Matching,
    text: '실시간 매칭',
    show: ({ isTrading }: NavItemShowProps) => !isTrading,
  },
  {
    key: 'blog',
    href: '/blog',
    icon: Blog,
    text: '블로그',
    show: () => true,
  },
  {
    key: 'mypage',
    href: '/mypage',
    icon: User,
    text: '마이페이지',
    show: ({ isLoggedIn }: NavItemShowProps) => isLoggedIn,
  },
  {
    key: 'login',
    href: '/login',
    icon: Login,
    text: '로그인',
    show: ({ isLoggedIn }: NavItemShowProps) => !isLoggedIn,
  },
];

export const Header: FC<HeaderProps> = ({ isTrading = false }) => {
  const user = useAuthStore((state: AuthState) => state.user);
  const role = useAuthStore((state: AuthState) => state.role);
  const isLoggedIn: boolean = !!user;
  const isAdmin: boolean = role === ADMIN_ROLE;
  const pathname = usePathname();
  const router = useRouter();

  const { actualTheme, changeTheme } = useTheme();
  const isDark = actualTheme === 'dark';
  const [menuOpen, setMenuOpen] = useState(false);

  const isMatchPage = pathname?.startsWith('/match');
  const isDarkmode = isMatchPage ? true : isDark;

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleMobileNav = (path: string) => {
    setMenuOpen(false);
    setTimeout(() => {
      router.push(path);
    }, 200);
  };

  if (!mounted) {
    return <header className="w-full h-[57px] md:h-[67px]" />;
  }

  const headerHeight = 57;
  const headerHeightMd = 67;

  return (
    <>
      <header
        className={`w-full h-[57px] md:h-[67px] px-6 flex justify-between items-center relative transition-colors duration-300 z-50 ${
          isDarkmode
            ? 'bg-gradient-to-r from-gray-900 via-black to-gray-900 border-b border-gray-800/50'
            : 'bg-white border-b'
        }`}
      >
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

        {/* PC 메뉴 */}
        <div className="relative z-10 gap-4 items-center md:flex hidden">
          {NAV_ITEMS.map(
            (item) =>
              item.show({ isAdmin, isTrading, isLoggedIn }) && (
                <Link
                  href={item.href}
                  key={item.key}
                  className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition focus:outline-none"
                >
                  <item.icon
                    className={`w-6 h-6 ${isDarkmode ? 'text-white' : 'text-gray-800'}`}
                  />
                  <span
                    className={`text-sm ${isDarkmode ? 'text-white' : 'text-gray-900'}`}
                  >
                    {item.text}
                  </span>
                </Link>
              )
          )}
          <ThemeSwitch
            isDark={isDarkmode}
            onToggle={() => changeTheme(isDarkmode ? 'light' : 'dark')}
          />
        </div>

        {/* 모바일 메뉴 버튼 */}
        <div className="md:hidden flex items-center">
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label="메뉴 열기"
            className="focus:outline-none"
          >
            <Menu
              className={`w-7 h-7 ${isDarkmode ? 'text-white' : 'text-gray-900'}`}
            />
          </button>
        </div>
      </header>

      {/* 모바일 드롭다운 */}
      <Transition.Root show={menuOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-[9999] md:hidden"
          onClose={setMenuOpen}
        >
          <Transition.Child
            as={Fragment}
            enter="transition-opacity duration-200"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity duration-150"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div
              className="fixed bottom-0 left-0 right-0 bg-black/40 dark:bg-gray-400/20"
              style={{ top: `${headerHeight}px` }}
            />
          </Transition.Child>

          <Transition.Child
            as={Fragment}
            enter="transition duration-200 transform"
            enterFrom="opacity-0 -translate-y-4"
            enterTo="opacity-100 translate-y-0"
            leave="transition duration-150 transform"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 -translate-y-4"
          >
            <Dialog.Panel
              className="fixed left-0 w-full z-10 bg-white dark:bg-gray-900 px-4 py-4 flex flex-col gap-1 rounded-b-2xl shadow-none"
              style={{
                top:
                  typeof window !== 'undefined' && window.innerWidth >= 768
                    ? `${headerHeightMd}px`
                    : `${headerHeight}px`,
              }}
            >
              {NAV_ITEMS.map(
                (item) =>
                  item.show({ isAdmin, isTrading, isLoggedIn }) && (
                    <button
                      type="button"
                      key={item.key}
                      onClick={() => handleMobileNav(item.href)}
                      className="flex items-center gap-3 px-2 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition focus:outline-none w-full text-left"
                    >
                      <item.icon
                        className={`w-6 h-6 ${isDarkmode ? 'text-white' : 'text-gray-800'}`}
                      />
                      <span
                        className={`text-base font-medium ${isDarkmode ? 'text-white' : 'text-gray-900'}`}
                      >
                        {item.text}
                      </span>
                    </button>
                  )
              )}
              <div className="pt-2">
                <ThemeSwitch
                  isDark={isDarkmode}
                  onToggle={() => {
                    changeTheme(isDarkmode ? 'light' : 'dark');
                  }}
                />
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </Dialog>
      </Transition.Root>
    </>
  );
};
