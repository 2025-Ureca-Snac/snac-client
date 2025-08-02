import React from 'react';
import Link from 'next/link';

interface MenuLinkProps {
  href: string;
  IconComponent: React.ElementType;
  alt: string;
  text: string;
}
export const MenuLink = ({ href, IconComponent, alt, text }: MenuLinkProps) => (
  <Link
    href={href}
    className="flex items-center gap-2 transition-opacity hover:opacity-50"
    aria-label={alt}
  >
    <IconComponent width={24} height={24} aria-hidden="true" />
    <span className="hidden md:flex text-midnight-black dark:text-white text-regular-sm">
      {text}
    </span>
  </Link>
);
