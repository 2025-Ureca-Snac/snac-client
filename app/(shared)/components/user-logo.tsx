'use client';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

/**
 * @author 이승우
 * @description 회원가입, 로그인 화면 로고 컴포넌트
 */
export default function UserLogo() {
  const [percent, setPercent] = useState('40%'); // SSR 기본값
  const router = useRouter();

  useEffect(() => {
    const updatePercent = () => {
      setPercent(
        window.matchMedia('(min-width: 768px)').matches ? '50%' : '40%'
      );
    };
    updatePercent();
    window.addEventListener('resize', updatePercent);
    return () => window.removeEventListener('resize', updatePercent);
  }, []);

  const handleLogoClick = () => {
    router.push('/');
  };

  return (
    <div
      className="flex justify-center items-center w-full h-64 md:w-1/2 md:h-screen"
      style={{
        background: `linear-gradient(to bottom right, #000000 ${percent}, #384838 100%)`,
      }}
    >
      <Image
        src="/logo.png"
        alt="logo"
        width={300}
        height={300}
        className="w-48 h-48 md:w-[300px] md:h-[300px] object-contain cursor-pointer"
        onClick={handleLogoClick}
      />
    </div>
  );
}
