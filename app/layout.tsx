// 1. 훅을 사용하기 위해 파일 최상단에 'use client'를 추가합니다.
'use client';

// import type { Metadata } from 'next'; // 'use client' 파일에서는 metadata export가 동작하지 않습니다.
import { Noto_Sans_KR } from 'next/font/google';
import './globals.css';
import { ThemeProvider, useTheme } from './theme-provider';
import WwwRedirect from './(shared)/components/www-redirect';
import { Toaster } from 'sonner';
// 2. Header와 Footer, 그리고 useEffect 훅을 임포트합니다.
import { Header } from './(shared)/components/Header';
import { Footer } from './(shared)/components/Footer';

const notoSansKr = Noto_Sans_KR({
  weight: ['400', '500', '700'],
  display: 'swap',
  preload: false,
});

// ℹ️ 참고: 'use client'를 사용하면 이 metadata export는 무시됩니다.
// 메타데이터는 서버 컴포넌트에서만 export할 수 있습니다.
/*
export const metadata: Metadata = {
  title: 'Snac',
  description: 'Snac - 데이터 거래 플랫폼',
};
*/

// ThemeProvider 내부에서 훅을 사용하기 위해 컴포넌트를 분리합니다.
// 이렇게 하면 ThemeProvider의 컨텍스트에 접근할 수 있습니다.
function LayoutContent({ children }: { children: React.ReactNode }) {
  // 3. useTheme 훅으로 테마 상태와 변경 함수를 가져옵니다.
  const { actualTheme, changeTheme } = useTheme();
  const isDarkmode = actualTheme === 'dark';

  const handleToggle = () => {
    changeTheme(isDarkmode ? 'light' : 'dark');
  };

  return (
    <div className="w-full md:max-w-[1440px] mx-auto min-h-screen flex flex-col">
      <Header isDarkmode={isDarkmode} onToggle={handleToggle} />

      <main className="flex-1 bg-white dark:bg-gray-900">{children}</main>

      <Footer />
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
      <WwwRedirect />
      <body className={`${notoSansKr.className} antialiased`}>
        <ThemeProvider>
          <LayoutContent>{children}</LayoutContent>
        </ThemeProvider>
      </body>
    </html>
  );
}
