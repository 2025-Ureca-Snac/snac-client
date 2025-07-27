/**
 * @author 이승우
 * @description 소셜 로그인 제공자 인터페이스
 */
export interface SocialProvider {
  name: string;
  src: string;
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
    providerId: 'kakao',
  },
  {
    name: '네이버',
    src: '/naver.svg',
    providerId: 'naver',
  },
  {
    name: '구글',
    src: '/google.svg',
    providerId: 'google',
  },
];
