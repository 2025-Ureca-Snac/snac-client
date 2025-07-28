import Image from 'next/image';
import { useAuthStore } from '../stores/auth-store';
import { SOCIALS } from '../constants/social-login-data';
import { useRouter } from 'next/navigation';

/**
 * @author 이승우
 * @description 소셜 로그인 버튼 컴포넌트( 브랜드별 맞춤 스타일 )
 */
export default function SocialLoginButtons() {
  const { linkSocialAccount } = useAuthStore();
  const router = useRouter();

  const handleSocialLogin = async (providerId: string) => {
    try {
      // auth-store의 소셜 로그인 기능 사용
      const success = await linkSocialAccount(providerId);

      if (success) {
        console.log('소셜 로그인 성공');
        router.push('/');
      }
    } catch (error) {
      console.error('소셜 로그인 실패:', error);
      alert(
        `소셜 로그인 중 오류가 발생했습니다: ${error instanceof Error ? error.message : '알 수 없는 오류'}`
      );
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, providerId: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleSocialLogin(providerId);
    }
  };

  return (
    <div className="flex justify-center">
      {SOCIALS.map(({ name, src, providerId }, index) => (
        <div key={name} className="flex items-center">
          <div className="w-22 h-22 md:w-34 md:h-34 rounded-full flex items-center justify-center">
            <button
              type="button"
              className="p-0 border-none bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-full focus:bg-gray-100 focus:bg-opacity-20"
              onClick={() => handleSocialLogin(providerId)}
              onKeyDown={(e) => handleKeyDown(e, providerId)}
              aria-label={`${name}로 로그인`}
              role="button"
              tabIndex={0}
            >
              <Image
                src={src}
                alt={name}
                width={90}
                height={90}
                className="object-contain w-18 h-18 md:w-[90px] md:h-[90px] pointer-events-none"
              />
            </button>
          </div>
          {index < SOCIALS.length - 1 && (
            <span className="mx-3 md:mx-5 text-transparent">|</span>
          )}
        </div>
      ))}
    </div>
  );
}
