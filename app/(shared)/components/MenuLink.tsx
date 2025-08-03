import React from 'react';
import Link from 'next/link';

interface MenuLinkProps {
  href: string;
  IconComponent: React.ElementType;
  alt: string;
  text: string;
  isDarkmode?: boolean;
}
export const MenuLink = ({
  href,
  IconComponent,
  alt,
  text,
  isDarkmode = false,
}: MenuLinkProps) => (
  <Link
    href={href}
    className={`flex items-center gap-1 transition-all duration-300 ${
      isDarkmode ? 'hover:opacity-70 hover:scale-105' : 'hover:opacity-50'
    }`}
    aria-label={alt}
  >
    <IconComponent
      width={24}
      height={24}
      aria-hidden="true"
      className={isDarkmode ? 'text-gray-200' : ''}
    />
    <span
      className={`hidden md:flex text-regular-sm font-medium ${
        isDarkmode ? 'text-gray-200 hover:text-white' : 'text-midnight-black'
      }`}
    >
      {text}
    </span>
  </Link>
);
