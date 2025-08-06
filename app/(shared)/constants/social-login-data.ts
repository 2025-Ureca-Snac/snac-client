/**
 * @author 이승우
 * @description 소셜 로그인 제공자 인터페이스
 */
export interface SocialProvider {
  name: string;
  src: string;
  srcDark: string; // 다크 모드용 이미지 경로 추가
  providerId: string;
}

/**
 * @author 이승우
 * @description 소셜 로그인 제공자 목록 (카카오, 네이버, 구글)
 */
export const SOCIALS: SocialProvider[] = [
  {
    name: '카카오',
    src: '/kakao.svg',
    srcDark: '/kakao_dark.svg',
    providerId: 'kakao',
  },
  {
    name: '네이버',
    src: '/naver.svg',
    srcDark: '/naver_dark.svg',
    providerId: 'naver',
  },
  {
    name: '구글',
    src: '/google.svg',
    srcDark: '/google_dark.svg',
    providerId: 'google',
  },
];
