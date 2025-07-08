import Logo from './Logo';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex">
      <Logo />
      {children}
    </div>
  );
}
