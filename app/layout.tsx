import { Noto_Sans_KR } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from './theme-provider';
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

function LayoutContent({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full md:max-w-[1440px] mx-auto min-h-screen flex flex-col">
      <Header />

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
