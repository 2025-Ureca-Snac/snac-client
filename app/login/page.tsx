import { Metadata } from 'next';
import Login from './Login';

export const metadata: Metadata = {
  title: '로그인 - Snac',
  description:
    '스낵에 로그인하여 데이터 거래를 시작하세요. 안전하고 편리한 데이터 마켓플레이스입니다.',
  keywords: ['로그인', '스낵', '데이터거래', '데이터마켓플레이스'],
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: '로그인 - Snac',
    description: '스낵에 로그인하여 데이터 거래를 시작하세요.',
    type: 'website',
  },
};

/**
 * @author 이승우
 * @description 로그인 페이지 컴포넌트
 */
export default function LoginPage() {
  return <Login />;
}
