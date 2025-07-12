import UserLogo from '../(shared)/components/user-logo';

/**
 * @author 이승우
 * @description 로그인 레이아웃 컴포넌트
 * @param children 자식 컴포넌트
 */
export default function LoginLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <UserLogo />
      {children}
    </div>
  );
}
