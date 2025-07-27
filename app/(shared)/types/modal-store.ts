/**
 * @author 이승우
 * @description 모달 타입
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
