import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

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

export const DesktopFooter = () => {
  return (
    <footer className="text-white bg-black md:px-[160px] pt-[80px] pb-8 px-8">
      <div className="flex justify-between">
        {/* 로고, 설명, 소셜 */}
        <div className="flex flex-col">
          <span className="text-regular-2xl">Snac</span>
          <p className="text-regular-xl pt-8">
            남는 데이터를 연결하는
            <br />
            가장 간편한 거래 플랫폼
          </p>
          <div className="flex gap-6 pt-8">
            {socialLinks.map((link) => (
              <Link href={link.href} key={link.alt} target="_blank">
                <Image src={link.src} alt={link.alt} width={24} height={24} />
              </Link>
            ))}
          </div>
        </div>

        <div className="flex gap-16">
          {/* 페이지 메뉴 */}
          <div className="space-y-10">
            <h3 className="text-medium-md text-white">페이지</h3>
            <ul className="flex flex-col gap-y-6">
              {pageLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-regular-sm text-white hover:text-gray-400"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          {/* 회사 정보 */}
          <div className="space-y-10">
            <h3 className="text-medium-md text-white">회사</h3>
            <div className="text-regular-sm text-white leading-relaxed">
              <p>
                06192 강남구 테헤란로M
                <br /> 212,
              </p>
              <p>멀티캠퍼스 선릉</p>
              <p>서울특별시</p>
              <p className="pt-4">1544-9001</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-16 pt-8 border-t border-gray-700 flex justify-between items-center">
        {/* 저작권 및 약관 */}
        <div className="flex items-center gap-4 text-regular-xs text-gray-200">
          <span>Copyright © 2025 Snac. All rights reserved</span>
          <span className="border-l border-gray-600 h-4"></span>
          <Link
            href="#"
            className="text-regular-xs text-gray-500 hover:underline"
          >
            Privacy Policy
          </Link>
          <Link
            href="#"
            className="text-regular-xs text-gray-500 hover:underline"
          >
            Terms & Conditions
          </Link>
        </div>
        {/* 결제 아이콘 */}
        <div className="flex gap-1 pr-[190px]">
          <Image
            src="/tossPayment.svg"
            alt="토스페이먼츠"
            width={48}
            height={32}
          />
        </div>
      </div>
    </footer>
  );
};
