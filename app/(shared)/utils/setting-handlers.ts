import { useModalStore } from '@/app/(shared)/stores/modal-store';
import { ModalType } from '@/app/(shared)/types/modal-store';

/**
 * @author 이승우
 * @description 설정 항목과 모달 타입 매핑
 */
const SETTING_MODAL_MAP = new Map<string, ModalType>([
  ['비밀번호 변경', 'change-password'],
  ['전화번호 변경', 'change-phone'],
  ['닉네임 변경', 'change-nickname'],
  ['소셜 로그인 연동', 'social-login'],
  ['서비스 가이드', 'service-guide'],
  ['개인정보 처리방침', 'privacy-policy'],
  ['화면 테마', 'theme'],
]);

/**
 * @author 이승우
 * @description SettingList에서 항목 클릭 시 모달 오픈하는 핸들러
 * @param item - 클릭된 설정 항목
 */
export const handleSettingClick = (item: string) => {
  const modalType = SETTING_MODAL_MAP.get(item);

  if (modalType) {
    useModalStore.getState().openModal(modalType);
  } else {
    console.warn(`알 수 없는 설정 항목: ${item}`);
  }
};
