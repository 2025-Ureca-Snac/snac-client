/**
 * @author 김현훈
 * @description 거래 취소 사유 enum
 */
export enum CancelReason {
  BUYER_CHANGE_MIND = 'BUYER_CHANGE_MIND',
  BUYER_LIMIT_EXCEEDED = 'BUYER_LIMIT_EXCEEDED',
  SELLER_CHANGE_MIND = 'SELLER_CHANGE_MIND',
  SELLER_LIMIT_EXCEEDED = 'SELLER_LIMIT_EXCEEDED',
  NOT_SELECTED = 'NOT_SELECTED',
  SELLER_FORCED_TERMINATION = 'SELLER_FORCED_TERMINATION',
  BUYER_FORCED_TERMINATION = 'BUYER_FORCED_TERMINATION',
}

/**
 * @author 김현훈
 * @description 취소 사유별 메시지 정보
 */
export interface CancelMessageInfo {
  title: string;
  message: string;
  icon: string;
}

/**
 * @author 김현훈
 * @description 취소 사유별 메시지 매핑
 */
export const CANCEL_MESSAGES: Record<CancelReason, CancelMessageInfo> = {
  [CancelReason.BUYER_CHANGE_MIND]: {
    title: '거래가 취소되었습니다',
    message: '구매자가 거래를 취소했습니다.',
    icon: '🔄',
  },
  [CancelReason.BUYER_LIMIT_EXCEEDED]: {
    title: '거래가 취소되었습니다',
    message: '구매자가 응답 대기 시간을 초과하여 거래를 취소했습니다.',
    icon: '⏰',
  },
  [CancelReason.SELLER_CHANGE_MIND]: {
    title: '거래가 취소되었습니다',
    message: '판매자가 거래를 취소했습니다.',
    icon: '🔄',
  },
  [CancelReason.SELLER_LIMIT_EXCEEDED]: {
    title: '거래가 취소되었습니다',
    message: '판매자가 응답 대기 시간을 초과하여 거래를 취소했습니다.',
    icon: '⏰',
  },
  [CancelReason.NOT_SELECTED]: {
    title: '선택되지 않았습니다',
    message: '다른 구매자가 선택되어 거래가 진행됩니다.',
    icon: '❌',
  },
  [CancelReason.SELLER_FORCED_TERMINATION]: {
    title: '거래가 중단되었습니다',
    message: '판매자가 페이지를 종료하여 거래가 중단되었습니다.',
    icon: '⚠️',
  },
  [CancelReason.BUYER_FORCED_TERMINATION]: {
    title: '거래가 중단되었습니다',
    message: '구매자가 페이지를 종료하여 거래가 중단되었습니다.',
    icon: '⚠️',
  },
};

/**
 * @author 김현훈
 * @description 취소 사유별 메시지 가져오기 함수
 */
export const getCancelMessage = (cancelReason: string): CancelMessageInfo => {
  const reason = cancelReason as CancelReason;

  if (reason in CANCEL_MESSAGES) {
    return CANCEL_MESSAGES[reason];
  }

  // 기본 메시지 (알 수 없는 취소 사유)
  return {
    title: '거래가 취소되었습니다',
    message: '알 수 없는 이유로 거래가 취소되었습니다.',
    icon: '❓',
  };
};
