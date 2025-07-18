import Image from 'next/image';

const SOCIALS = [
  {
    name: '카카오',
    pcSrc: '/kakao_login.svg',
    mobileSrc: '/kakao_mobile_login.svg',
    providerId: 'kakao',
  },
  {
    name: '네이버',
    pcSrc: '/naver_login.svg',
    mobileSrc: '/naver_mobile_login.svg',
    providerId: 'naver',
  },
  {
    name: '구글',
    pcSrc: '/google_login.svg',
    mobileSrc: '/google_mobile_login.svg',
    providerId: 'google',
  },
];

/**
 * @author 이승우
 * @description 소셜 로그인 버튼 컴포넌트( 카카오, 네이버, 구글 )
 */
export default function SocialLoginButtons() {
  const handleSocialLogin = async (providerId: string) => {
    try {
      // 팝업으로 OAuth2 인증 페이지 열기
      const popup = window.open(
        `http://localhost:8080/oauth2/authorization/${providerId}`,
        'socialLogin',
        'width=500,height=600,scrollbars=yes,resizable=yes'
      );

      // 팝업이 차단되었는지 확인
      if (!popup || popup.closed || typeof popup.closed === 'undefined') {
        alert('팝업이 차단되었습니다. 팝업 차단을 해제하고 다시 시도해주세요.');
        return;
      }

      // 팝업 창이 닫힐 때까지 대기
      const checkClosed = setInterval(() => {
        if (popup.closed) {
          clearInterval(checkClosed);
          // 팝업이 닫히면 로그인 성공으로 간주하고 페이지 새로고침
          window.location.reload();
        }
      }, 1000);
    } catch (error) {
      console.error('소셜 로그인 실패:', error);
      alert('소셜 로그인 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="space-y-3">
      {SOCIALS.map(({ name, pcSrc, mobileSrc, providerId }) => (
        <button
          className="block w-full"
          key={name}
          onClick={() => handleSocialLogin(providerId)}
        >
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
