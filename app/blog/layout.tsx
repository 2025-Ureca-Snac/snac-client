import { blogLayoutMetadata } from './metadata';

export const metadata = blogLayoutMetadata;

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div>{children}</div>;
}
