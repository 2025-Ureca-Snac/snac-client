import { Noto_Sans_KR } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from './theme-provider';
import WwwRedirect from './(shared)/components/www-redirect';
import { Toaster } from 'sonner';
// 2. Header와 Footer, 그리고 useEffect 훅을 임포트합니다.
import ConditionalHeader from './(shared)/components/conditional-header';
import ConditionalFooter from './(shared)/components/conditional-footer';

const notoSansKr = Noto_Sans_KR({
  weight: ['400', '500', '700'],
  display: 'swap',
  preload: false,
});

function LayoutContent({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full md:max-w-[1440px] mx-auto min-h-screen flex flex-col">
      <ConditionalHeader />
      <main className="flex-1 bg-white dark:bg-gray-900">{children}</main>
      <ConditionalFooter />
      <Toaster richColors position="top-center" />
    </div>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <meta
          name="google-site-verification"
          content="ZyDbxMLQ1UsdJrNj45pOk18xpt7KQNivFtcYjfW74Go"
        />
      </head>
      <WwwRedirect />
      <body className={`${notoSansKr.className} antialiased`}>
        <ThemeProvider>
          <LayoutContent>{children}</LayoutContent>
        </ThemeProvider>
      </body>
    </html>
  );
}
