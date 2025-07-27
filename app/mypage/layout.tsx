'use client';

import { Header } from '../(shared)/components/Header';
import { usePathname, useRouter } from 'next/navigation';

/**
 * @author 이승우
 * @description 마이페이지 레이아웃
 */
export default function MyPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const getPageTitle = (pathname: string) => {
    if (pathname === '/mypage') return '마이페이지';
    if (pathname === '/mypage/point') return '포인트 • 머니';
    return '마이페이지';
  };

  const handleBackClick = () => {
    if (pathname === '/mypage/point') {
      router.push('/mypage');
    } else if (pathname === '/mypage') {
      router.back();
    }
  };

  const pageTitle = getPageTitle(pathname);

  return (
    <>
      {/* 모바일 상단 헤더 */}
      <div className="md:hidden relative h-14 flex items-center border-b border-gray-200 bg-white sticky top-0 z-20">
        <button
          className="absolute left-4 text-2xl text-gray-700 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded p-1"
          aria-label="뒤로가기"
          onClick={handleBackClick}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleBackClick();
            }
          }}
          tabIndex={0}
        >
          ←
        </button>
        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-bold text-lg">
          {pageTitle}
        </span>
      </div>
      <div className="hidden md:block">
        <Header />
      </div>
      {children}
    </>
  );
}
