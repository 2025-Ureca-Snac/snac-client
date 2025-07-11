import UserLogo from '../(shared)/components/UserLogo';

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
