import { create } from 'zustand';
import { ModalState, ModalType } from '../types/modal-store';

export const useModalStore = create<ModalState>((set) => ({
  // 초기 상태
  isOpen: false,
  modalType: null,
  modalData: null,

  // 모달 열기
  openModal: (type: ModalType, data?: Record<string, unknown>) => {
    set({
      isOpen: true,
      modalType: type,
      modalData: data ?? null,
    });
  },

  // 모달 닫기
  closeModal: () => {
    set({
      isOpen: false,
      modalType: null,
      modalData: null,
    });
  },

  // 모달 데이터 설정
  setModalData: (data: Record<string, unknown>) => {
    set({ modalData: data });
  },
}));
