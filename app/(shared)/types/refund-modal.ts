/**
 * @author 이승우
 * @description 환불 모달 관련 타입 정의
 */

export interface RefundModalProps {
  open: boolean;
  onClose: () => void;
  amount: number;
  paymentKey: string;
  onRefundSuccess: (amount: number) => void;
}

export interface RefundRequest {
  reason: string;
}

export interface RefundHistory {
  id: string;
  amount: number;
  reason: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'COMPLETED';
  createdAt: string;
  completedAt?: string;
}
