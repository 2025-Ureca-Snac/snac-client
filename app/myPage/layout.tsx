export default function MyPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex justify-center items-start bg-[#FAFAFA]">
      {children}
    </div>
  );
}
