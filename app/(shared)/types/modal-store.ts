/**
 * @author 이승우
 * @description 모달 타입
 * @interface ModalType
 * @property {string} search 검색
 * @property {string} payment 결제
 * @property {string} confirm 확인
 * @property {string} alert 알림
 * @property {string} blog 블로그
 * @property {string} favorite-list 단골 목록
 * @property {string} change-password 비밀번호 변경
 * @property {string} change-phone 전화번호 변경
 * @property {string} change-nickname 닉네임 변경
 * @property {string} social-login 소셜 로그인 연동
 * @property {string} service-guide 서비스 가이드
 * @property {string} privacy-policy 개인정보처리방침
 * @property {string} theme 화면 테마
 * @property {null} null 모달 타입 없음
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
  | 'trade-cancel'
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
