/**
 * @author 이승우
 * @description 소셜 로그인 모달 관련 상수 및 타입 통합
 */
export interface SocialModalProvider {
  id: string;
  name: string;
  color: string;
  textColor: string;
  icon: string;
  border?: string;
}

export const SOCIAL_MODAL_PROVIDERS: SocialModalProvider[] = [
  {
    id: 'kakao',
    name: '카카오',
    color: 'bg-yellow-400',
    textColor: 'text-black',
    icon: 'K',
  },
  {
    id: 'naver',
    name: '네이버',
    color: 'bg-green-500',
    textColor: 'text-white',
    icon: 'N',
  },
  {
    id: 'google',
    name: '구글',
    color: 'bg-white',
    textColor: 'text-gray-700',
    icon: 'G',
    border: 'border border-gray-300',
  },
];

export const SOCIAL_LOGIN_MODAL_INITIAL_STATE = {
  kakao: false,
  naver: false,
  google: false,
} as const;
