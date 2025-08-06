'use client';

import { usePathname } from 'next/navigation';
import { Header } from './Header';

export default function ConditionalHeader() {
  const pathname = usePathname();

  // 헤더를 숨길 경로들
  const hideHeaderPaths = [
    '/login',
    '/signUp',
    '/certification',
    '/payment/process',
    '/payment/success',
    '/payment/fail',
  ];
  const shouldHideHeader = hideHeaderPaths.includes(pathname);

  if (shouldHideHeader) {
    return null;
  }

  return <Header />;
}
