import { useModalStore } from '@/app/(shared)/stores/modal-store';

/**
 * @author 이승우
 * @description SettingList에서 항목 클릭 시 모달 오픈하는 핸들러
 * @param item - 클릭된 설정 항목
 */
export const handleSettingClick = (item: string) => {
  if (item === '비밀번호 변경')
    useModalStore.getState().openModal('change-password');
  if (item === '번호 변경') useModalStore.getState().openModal('change-phone');
  if (item === '닉네임 변경')
    useModalStore.getState().openModal('change-nickname');
  if (item === '소셜 로그인 연동')
    useModalStore.getState().openModal('social-login');
  if (item === '서비스 가이드')
    useModalStore.getState().openModal('service-guide');
  if (item === '개인정보 처리방침')
    useModalStore.getState().openModal('privacy-policy');
  if (item === '화면 테마') useModalStore.getState().openModal('theme');
};
