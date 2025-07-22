import Image from 'next/image';
import { useAuthStore } from '../stores/auth-store';
import { SOCIALS } from '../constants/social-login-data';

/**
 * @author 이승우
 * @description 소셜 로그인 버튼 컴포넌트( 브랜드별 맞춤 스타일 )
 */
export default function SocialLoginButtons() {
  const { linkSocialAccount } = useAuthStore();

  const handleSocialLogin = async (providerId: string) => {
    try {
      // auth-store의 소셜 로그인 기능 사용
      const success = await linkSocialAccount(providerId);
      if (success) {
        console.log('소셜 로그인 성공');
      }
    } catch (error) {
      console.error('소셜 로그인 실패:', error);
      alert(
        `소셜 로그인 중 오류가 발생했습니다: ${error instanceof Error ? error.message : '알 수 없는 오류'}`
      );
    }
  };

  return (
    <div className="flex justify-center space-x-4">
      {SOCIALS.map(({ name, src, providerId }) => (
        <div key={name} className="flex flex-col items-center space-y-2">
          <div className="w-36 h-36 rounded-full flex items-center justify-center">
            <Image
              src={src}
              alt={name}
              width={90}
              height={90}
              className="object-contain cursor-pointer"
              onClick={() => handleSocialLogin(providerId)}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
