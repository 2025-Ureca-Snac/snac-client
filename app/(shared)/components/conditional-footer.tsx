'use client';

import { usePathname } from 'next/navigation';
import { Footer } from './Footer';

export default function ConditionalFooter() {
  const pathname = usePathname();

  // 푸터를 숨길 경로들
  const hideFooterPaths = ['/login', '/signUp', '/certification'];
  const shouldHideFooter = hideFooterPaths.includes(pathname);

  if (shouldHideFooter) {
    return null;
  }

  return <Footer />;
}
