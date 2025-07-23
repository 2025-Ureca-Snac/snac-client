import type { Metadata } from 'next';
import { Noto_Sans_KR } from 'next/font/google';
import './globals.css';
import WwwRedirect from './components/www-redirect';

const notoSansKr = Noto_Sans_KR({
  weight: ['400', '500', '700'],
  display: 'swap',
  preload: false,
});

export const metadata: Metadata = {
  title: 'Snac',
  description: 'Snac - 스낵 거래 플랫폼',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={`${notoSansKr.className} antialiased`}>
        <WwwRedirect />
        <div className="w-full  md:max-w-[1440px] mx-auto ">{children}</div>
      </body>
    </html>
  );
}
