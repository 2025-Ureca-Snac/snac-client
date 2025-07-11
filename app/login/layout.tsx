import UserLogo from '../(shared)/components/UserLogo';

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
