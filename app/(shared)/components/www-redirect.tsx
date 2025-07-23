'use client';
import { useEffect } from 'react';

/**
 * @author 이승우
 * @description www가 붙은 URL을 www 없이 리다이렉트하는 컴포넌트
 */
export default function WwwRedirect() {
  useEffect(() => {
    // www가 붙은 URL을 www 없이 리다이렉트
    if (typeof window !== 'undefined') {
      const { hostname, protocol, pathname, search, hash } = window.location;

      if (hostname.startsWith('www.')) {
        const newHostname = hostname.replace(/^www\./, '');
        const newUrl = `${protocol}//${newHostname}${pathname}${search}${hash}`;
        window.location.href = newUrl;
      }
    }
  }, []);

  // 이 컴포넌트는 UI를 렌더링하지 않음
  return null;
}
