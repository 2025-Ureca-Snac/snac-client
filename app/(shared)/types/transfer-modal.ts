/**
 * @author 이승우
 * @description 송금 모달 컴포넌트 타입
 * @interface TransferModalProps
 * @property {boolean} open 모달 열림/닫힘 상태
 * @property {() => void} onClose 모달 닫기 함수
 * @property {number} currentMoney 현재 머니 잔액
 * @property {(amount: number, recipientId: string) => void} onTransferSuccess 송금 성공 콜백
 */
export interface TransferModalProps {
  open: boolean;
  onClose: () => void;
  currentMoney: number;
  onTransferSuccess?: (amount: number, recipientId: string) => void;
}

/**
 * @author 이승우
 * @description 송금 요청 데이터 타입
 * @interface TransferRequest
 * @property {string} recipientId 받는 사람 ID
 * @property {number} amount 송금 금액
 * @property {string} message 송금 메시지 (선택사항)
 */
export interface TransferRequest {
  recipientId: string;
  amount: number;
  message?: string;
}
