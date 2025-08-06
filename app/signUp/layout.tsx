import { Metadata } from 'next';
import UserLogo from '../(shared)/components/user-logo';

export const metadata: Metadata = {
  title: '회원가입 - Snac',
  description:
    '스낵에 회원가입하여 데이터 거래를 시작하세요. 안전하고 편리한 데이터 마켓플레이스입니다.',
  keywords: ['회원가입', '스낵', '데이터거래', '데이터마켓플레이스'],
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: '회원가입 - Snac',
    description: '스낵에 회원가입하여 데이터 거래를 시작하세요.',
    type: 'website',
  },
};

/**
 * @author 이승우
 * @description 회원가입 레이아웃 컴포넌트
 * @param children 자식 컴포넌트
 */
export default function SignupLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col md:flex-row h-screen">
      <UserLogo />
      <div className="flex-1 overflow-y-auto">{children}</div>
    </div>
  );
}
