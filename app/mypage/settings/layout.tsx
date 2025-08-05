import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '설정 | SNAC',
  description: '계정 설정 및 개인정보 관리',
};

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
