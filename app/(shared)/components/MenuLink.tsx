import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface MenuLinkProps {
  href: string;
  imgSrc: string;
  alt: string;
  text: string;
}

export const MenuLink = ({ href, imgSrc, alt, text }: MenuLinkProps) => (
  <Link href={href} className="flex items-center gap-2">
    <Image src={imgSrc} alt={alt} width={24} height={24} />
    <span className="hidden md:flex text-midnight-black text-regular-sm">
      {text}
    </span>
  </Link>
);
