'use client';

import { useMediaQuery } from '../hooks/useMediaQuery';
import { MobileFooter } from './MobileFooter';
import { DesktopFooter } from './DesktopFooter';

export const Footer = () => {
  const isDesktop = useMediaQuery('(min-width: 1024px)');

  return isDesktop ? <DesktopFooter /> : <MobileFooter />;
};
