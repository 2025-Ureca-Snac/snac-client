import { Metadata } from 'next';
import HomePage from './HomePage'; // 클라이언트 컴포넌트 분리

export const metadata: Metadata = {
  alternates: {
    canonical: 'https://snac-app.com/',
  },
};

export default function Page() {
  return <HomePage />; // 클라이언트 컴포넌트
}
