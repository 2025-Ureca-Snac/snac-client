import Image from 'next/image';

/**
 * @author 이승우
 * @description 회원가입, 로그인 화면 로고 컴포넌트
 * @returns 로고 컴포넌트
 */
export default function UserLogo() {
  return (
    <div
      className="flex justify-center items-center w-full h-64 md:w-1/2 md:h-screen"
      {...(typeof window !== 'undefined' &&
      window.matchMedia('(min-width: 768px)').matches
        ? {
            style: {
              background:
                'linear-gradient(to bottom right, #000000 50%, #384838 100%)',
            },
          }
        : {
            style: {
              background:
                'linear-gradient(to bottom right, #000000 40%, #384838 100%)',
            },
          })}
    >
      <Image
        src="/logo.png"
        alt="logo"
        width={300}
        height={300}
        className="w-48 h-48 md:w-[300px] md:h-[300px] object-contain"
      />
    </div>
  );
}
