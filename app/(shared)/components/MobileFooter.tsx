'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '@/app/(shared)/stores/auth-store';

const ADMIN_ROLE = 'ADMIN';

const pageLinks = [
  { name: '홈', href: '/' },
  { name: '실시간 매칭', href: '/match' },
  { name: '블로그', href: '/blog' },
  { name: '마이페이지', href: '/mypage' },
  { name: '관리자', href: '/admin' },
];

const socialLinks = [
  {
    src: '/youtube.svg',
    alt: '유튜브 바로가기',
    href: 'https://www.youtube.com/',
  },
  {
    src: '/figma.svg',
    alt: '피그마 바로가기',
    href: 'https://www.figma.com/design/eO8GHGStmnF8NgLo4BKyaK/%EC%9C%B5%ED%95%A9%ED%94%84%EB%A1%9C%EC%A0%9D%ED%8A%B8-1%EC%A1%B0?node-id=276-8523&t=SjC355WSDp5F1mxd-1',
  },
  {
    src: '/notion.svg',
    alt: '노션 바로가기',
    href: 'https://www.notion.so/Snac-2224a475c7f780d5a9dbd467cf15fe0b?source=copy_link',
  },
];

// interface MobileFooter {}

export const MobileFooter = () => {
  const user = useAuthStore((state) => state.user);
  const role = useAuthStore((state) => state.role);

  const [isPagesOpen, setIsPagesOpen] = useState(false);

  const filteredPageLinks = pageLinks.filter((link) => {
    if (link.name === '마이페이지') {
      return !!user;
    }
    if (link.name === '관리자 페이지') {
      return role === ADMIN_ROLE; // 관리자 권한일 때만
    }
    return true;
  });

  return (
    <footer className=" text-white bg-black md:px-[160px] pt-[64px] px-8">
      {/* 로고, 설명, 소셜 */}
      <span className="text-regular-2xl">SNAC</span>
      <p className="text-regular-sm py-8">
        남는 데이터를 연결하는
        <br /> 가장 간편한 거래 플랫폼
      </p>
      {/* 소셜 */}
      <div className="flex gap-6 pb-8 border-b border-gray-700">
        {socialLinks.map((link) => (
          <Link href={link.href} key={link.alt} target="_blank">
            <Image src={link.src} alt={link.alt} width={24} height={24} />
          </Link>
        ))}
      </div>
      {/* 페이지 메뉴 */}
      <div className="border-b border-gray-500">
        <button
          onClick={() => setIsPagesOpen(!isPagesOpen)}
          className="w-full flex justify-between items-center py-8"
        >
          <span className="text-medium-md font-semibold hover:text-gray-300">
            페이지
          </span>
          {isPagesOpen ? (
            <Image src="/upArrow.svg" alt="메뉴 닫기" width={24} height={24} />
          ) : (
            <Image
              src="/downArrow.svg"
              alt="메뉴 열기"
              width={24}
              height={24}
            />
          )}
        </button>
        <AnimatePresence>
          {isPagesOpen && (
            <motion.nav
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="overflow-hidden "
            >
              <ul className="space-y-6 pb-6">
                {filteredPageLinks.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-regular-sm  text-white hover:text-gray-400"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
      {/* 팀원 정보 */}
      <div className="py-8 border-b border-gray-700">
        <h3 className="text-medium-md font-semibold text-white">팀원</h3>
        <div className="mt-4 text-regular-sm text-white leading-relaxed">
          <div className="mb-3">프론트엔드: 김현훈, 양세현, 이승우</div>
          <div>백엔드: 이재윤, 정동현, 정유민, 홍석준</div>
        </div>
      </div>

      {/* 결제 아이콘 */}
      <div className="py-6 ">
        <div className="flex justify-center gap-1">
          <Image
            src="/tossPayment.svg"
            alt="토스 결제"
            width={48}
            height={32}
            style={{ width: 'auto', height: '32px' }}
          />
        </div>
        {/* 저작권 및 약관 */}
        <div className="flex flex-col  pt-8">
          <p className="text-regular-xs text-gray-200">
            Copyright © 2025 Snac. All rights reserved
          </p>
        </div>
      </div>
    </footer>
  );
};
