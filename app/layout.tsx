import { Noto_Sans_KR } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from './theme-provider';
import WwwRedirect from './(shared)/components/www-redirect';
import { Toaster } from 'sonner';
import { Metadata } from 'next';
// 2. Header와 Footer, 그리고 useEffect 훅을 임포트합니다.
import ConditionalHeader from './(shared)/components/conditional-header';
import ConditionalFooter from './(shared)/components/conditional-footer';

const notoSansKr = Noto_Sans_KR({
  weight: ['400', '500', '700'],
  display: 'swap',
  preload: false,
});

// 메타데이터 설정
export const metadata: Metadata = {
  title: {
    default: '스낵 - 데이터 거래 플랫폼',
    template: '%s | 스낵',
  },
  description:
    '스낵은 안전하고 편리한 데이터 거래 플랫폼입니다. 데이터 판매와 구매를 통해 데이터를 자유롭게 사용하고, 실시간 매칭으로 빠른 거래를 경험하세요.',
  keywords: [
    '데이터거래',
    '데이터마켓플레이스',
    '데이터판매',
    '데이터구매',
    '모바일데이터',
    '통신사데이터',
    '스낵',
    '데이터거래소',
  ],
  authors: [{ name: '스낵팀' }],
  creator: '스낵',
  publisher: '스낵',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://snac-app.com'),
  alternates: {
    canonical: 'https://snac-app.com/',
  },
  verification: {
    google: 'ZyDbxMLQ1UsdJrNj45pOk18xpt7KQNivFtcYjfW74Go',
  },
  openGraph: {
    title: '스낵 - 데이터 거래 플랫폼',
    description:
      '안전하고 편리한 데이터 거래 플랫폼. 데이터 판매와 구매를 통해 데이터를 자유롭게 사용하세요.',
    url: 'https://snac-app.com',
    siteName: '스낵',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: '스낵 - 데이터 거래 플랫폼',
      },
    ],
    locale: 'ko_KR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '스낵 - 데이터 거래 플랫폼',
    description:
      '안전하고 편리한 데이터 거래 플랫폼. 데이터 판매와 구매를 통해 데이터를 자유롭게 사용하세요.',
    images: ['/logo.png'],
    creator: '@snac_app',
    site: '@snac_app',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  other: {
    'application-name': '스낵',
    'apple-mobile-web-app-title': '스낵',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'mobile-web-app-capable': 'yes',
    'msapplication-TileColor': '#000000',
    'theme-color': '#000000',
  },
};

function LayoutContent({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full md:max-w-[1440px] mx-auto min-h-screen flex flex-col">
      <ConditionalHeader />
      <main className="flex-1 bg-background pt-[57px] md:pt-[67px]">
        {children}
      </main>
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
      <WwwRedirect />
      <body className={`${notoSansKr.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <LayoutContent>{children}</LayoutContent>
        </ThemeProvider>
      </body>
    </html>
  );
}
