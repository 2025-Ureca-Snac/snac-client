/**
 * @author 이승우
 * @description 취소 모달 관련 타입 정의
 */

export interface CancelModalProps {
  open: boolean;
  onClose: () => void;
  amount: number;
  paymentKey: string;
  onCancelSuccess: (amount: number) => void;
  onRefreshData?: () => void; // 데이터 새로고침 함수 (선택적)
}

export interface CancelRequest {
  reason: string;
}

export interface CancelHistory {
  id: string;
  amount: number;
  reason: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'COMPLETED';
  createdAt: string;
  completedAt?: string;
}
