import Image from 'next/image';

const SOCIALS = [
  {
    name: '카카오',
    pcSrc: '/kakao_login.svg',
    mobileSrc: '/kakao_mobile_login.svg',
  },
  {
    name: '네이버',
    pcSrc: '/naver_login.svg',
    mobileSrc: '/naver_mobile_login.svg',
  },
];

export default function SocialLoginButtons() {
  return (
    <div className="space-y-3">
      {SOCIALS.map(({ name, pcSrc, mobileSrc }) => (
        <button className="block w-full" key={name}>
          <Image
            src={pcSrc}
            alt={name}
            width={100}
            height={100}
            className="w-full object-contain hidden md:block"
          />
          <Image
            src={mobileSrc}
            alt={name}
            width={100}
            height={100}
            className="w-full object-contain block md:hidden"
          />
        </button>
      ))}
    </div>
  );
}
