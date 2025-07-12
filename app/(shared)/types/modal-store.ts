/**
 * @author 이승우
 * @description 모달 타입( search(검색), payment(결제), confirm(확인), alert(알림) )
 */
export type ModalType = 'search' | 'payment' | 'confirm' | 'alert' | null;

/**
 * @author 이승우
 * @description 모달 상태
 * @param isOpen 모달 열림 여부
 * @param modalType 모달 타입
 * @param modalData 모달 데이터
 *
 * @param openModal 모달 열기 액션
 * @param closeModal 모달 닫기 액션
 * @param setModalData 모달 데이터 설정 액션
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
