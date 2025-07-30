import type { Metadata } from 'next';
import { Noto_Sans_KR } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from './theme-provider';
import WwwRedirect from './(shared)/components/www-redirect';
import { Toaster } from 'sonner';

const notoSansKr = Noto_Sans_KR({
  weight: ['400', '500', '700'],
  display: 'swap',
  preload: false,
});

export const metadata: Metadata = {
  title: 'Snac',
  description: 'Snac - 데이터 거래 플랫폼',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <WwwRedirect />
      <body className={`${notoSansKr.className} antialiased`}>
        <ThemeProvider>
          <div className="w-full md:max-w-[1440px] mx-auto">
            {children} <Toaster richColors position="top-center" />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
