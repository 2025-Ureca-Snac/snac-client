/**
 * @author 이승우
 * @description 모달 타입
 * @interface ModalType
 * @property {string} search 검색 모달
 * @property {string} payment 결제 모달
 * @property {string} confirm 확인 모달
 * @property {string} alert 알림 모달
 * @property {string} blog 블로그 모달
 * @property {string} favorite-list 즐겨찾기 모달
 * @property {string} change-password 비밀번호 변경 모달
 * @property {string} change-phone 전화번호 변경 모달
 * @property {string} change-nickname 닉네임 변경 모달
 * @property {string} social-login 소셜 로그인 모달
 * @property {string} service-guide 서비스 가이드 모달
 * @property {string} privacy-policy 개인정보 처리방침 모달
 * @property {string} theme 테마 모달
 * @property {null} null 모달 없음
 */
export type ModalType =
  | 'search'
  | 'payment'
  | 'confirm'
  | 'alert'
  | 'blog'
  | 'favorite-list'
  | 'change-password'
  | 'change-phone'
  | 'change-nickname'
  | 'social-login'
  | 'service-guide'
  | 'privacy-policy'
  | 'theme'
  | null;

/**
 * @author 이승우
 * @description 모달 상태
 * @interface ModalState
 * @property {boolean} isOpen 모달 열림 여부
 * @property {ModalType} modalType 모달 타입
 * @property {Record<string, unknown>} modalData 모달 데이터
 *
 * @property {Function} openModal 모달 열기 액션
 * @property {Function} closeModal 모달 닫기 액션
 * @property {Function} setModalData 모달 데이터 설정 액션
 */
export interface ModalState {
  // 상태
  isOpen: boolean;
  modalType: ModalType;
  modalData: Record<string, unknown> | null;

  // 액션
  openModal: (type: ModalType, data?: Record<string, unknown>) => void;
  closeModal: () => void;
  setModalData: (data: Record<string, unknown>) => void;
}
