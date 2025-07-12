import UserLogo from '../(shared)/components/user-logo';

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
