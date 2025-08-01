import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface MenuLinkProps {
  href: string;
  imgSrc: string;
  alt: string;
  text: string;
  isDarkMode?: boolean;
}

export const MenuLink = ({
  href,
  imgSrc,
  alt,
  text,
  isDarkMode = false,
}: MenuLinkProps) => (
  <Link
    href={href}
    className={`flex items-center gap-2 transition-all duration-300 ${
      isDarkMode ? 'hover:opacity-70 hover:scale-105' : 'hover:opacity-50'
    }`}
  >
    <Image
      src={imgSrc}
      alt={alt}
      width={24}
      height={24}
      className={isDarkMode ? 'filter brightness-0 invert' : ''}
    />
    <span
      className={`hidden md:flex text-regular-sm font-medium ${
        isDarkMode ? 'text-gray-200 hover:text-white' : 'text-midnight-black'
      }`}
    >
      {text}
    </span>
  </Link>
);
