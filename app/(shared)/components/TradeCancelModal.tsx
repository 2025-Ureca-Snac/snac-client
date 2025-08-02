'use client';

import { useModalStore } from '../stores/modal-store';
import ModalPortal from './modal-portal';
import { Button } from './Button';
import { getCancelMessage } from '../constants';

export default function TradeCancelModal() {
  const { isOpen, modalType, modalData, closeModal } = useModalStore();

  // trade-cancel 모달이 아닌 경우 렌더링하지 않음
  if (modalType !== 'trade-cancel' || !isOpen) {
    return null;
  }

  const cancelReason = (modalData?.cancelReason as string) || '';
  const { title, message, icon } = getCancelMessage(cancelReason);

  const handleConfirm = () => {
    closeModal();

    window.location.reload();
  };

  return (
    <ModalPortal isOpen={isOpen} onClose={closeModal}>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
          {/* 아이콘 */}
          <div className="text-center mb-4">
            <div className="text-4xl mb-2">{icon}</div>
          </div>

          {/* 제목 */}
          <h2 className="text-xl font-bold text-center mb-3 text-gray-800">
            {title}
          </h2>

          {/* 메시지 */}
          <p className="text-center mb-6 text-gray-600 leading-relaxed">
            {message}
          </p>

          {/* 버튼 */}
          <div className="flex justify-center">
            <Button
              onClick={handleConfirm}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              확인
            </Button>
          </div>
        </div>
      </div>
    </ModalPortal>
  );
}
