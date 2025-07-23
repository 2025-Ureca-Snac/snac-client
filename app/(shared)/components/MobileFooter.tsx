'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

const pageLinks = [
  { name: '홈', href: '/' },
  { name: '실시간 매칭', href: '#' },
  { name: '마이페이지', href: '#' },
  { name: '고객센터', href: '#' },
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
  const [isPagesOpen, setIsPagesOpen] = useState(false);

  return (
    <footer className=" text-white bg-black md:px-[160px] pt-[64px] px-8">
      {/* 로고, 설명, 소셜 */}
      <span className="text-regular-2xl">Snac</span>
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
          <span className="text-medium-md hover:text-gray-300">페이지</span>
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
                {pageLinks.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-regular-sm text-white hover:text-gray-300 "
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
      {/* 회사 정보 */}
      <div className="py-8 border-b border-gray-700">
        <h3 className="text-medium-md text-white">회사</h3>

        <div className="mt-4 text-regular-sm text-white leading-relaxed">
          <p>
            06192 강남구 테헤란로 212,
            <br />
            멀티캠퍼스 선릉
            <br />
            서울특별시
          </p>

          <p className="mt-[18px]">1544-9001</p>
        </div>
      </div>
      {/* 결제 아이콘 */}
      <div className="py-6 ">
        <div className="flex justify-center gap-1">
          <Image
            src="/bcPayment.svg"
            alt="BC카드 결제"
            width={48}
            height={32}
            style={{ width: 'auto', height: '32px' }}
          />
          <Image
            src="/tossPayment.svg"
            alt="토스 결제"
            width={48}
            height={32}
            style={{ width: 'auto', height: '32px' }}
          />
        </div>
        {/* 저작권 및 약관 */}
        <div className="flex flex-col items-center gap-4 pt-8">
          <div className="flex gap-4">
            <span className="text-regular-xs text-gray-500">
              Privacy Policy
            </span>
            <span className="text-regular-xs text-gray-500">Terms of Use</span>
          </div>

          <p className="text-regular-xs text-gray-200">
            Copyright © 2025 Snac. All rights reserved
          </p>
        </div>
      </div>
    </footer>
  );
};
