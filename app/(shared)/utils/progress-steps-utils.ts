export interface ProgressStep {
  id: number;
  label: string;
  isActive: boolean;
}

// 구매글 거래 진행 단계 (4단계)
export const getPurchaseSteps = (currentStep: number): ProgressStep[] => [
  {
    id: 1,
    label: '거래글 확인',
    isActive: currentStep >= 1,
  },
  {
    id: 2,
    label: '결제완료',
    isActive: currentStep >= 2,
  },
  {
    id: 3,
    label: '판매자 확인',
    isActive: currentStep >= 3,
  },
  {
    id: 4,
    label: '판매자 데이터 송신',
    isActive: currentStep >= 4,
  },
  {
    id: 5,
    label: '거래완료',
    isActive: currentStep >= 5,
  },
];

// 판매글 거래 진행 단계 (5단계)
export const getSalesSteps = (currentStep: number): ProgressStep[] => [
  {
    id: 1,
    label: '거래글 확인',
    isActive: currentStep >= 1,
  },
  {
    id: 2,
    label: '결제완료',
    isActive: currentStep >= 2,
  },
  {
    id: 3,
    label: '구매자 매칭',
    isActive: currentStep >= 3,
  },
  {
    id: 4,
    label: '판매자 데이터 송신',
    isActive: currentStep >= 4,
  },
  {
    id: 5,
    label: '거래완료',
    isActive: currentStep >= 5,
  },
];

// 상태별 진행 단계 계산
export const getCurrentStep = (
  status: string,
  type: 'purchase' | 'sales'
): number => {
  if (type === 'purchase') {
    switch (status) {
      case 'BUY_REQUESTED':
        return 1;
      case 'PAYMENT_CONFIRMED':
        return 2; // 결제만 된 상태, 판매자 미신청
      case 'PAYMENT_CONFIRMED_ACCEPTED':
        return 3; // 판매자 매칭됨
      case 'DATA_SENT':
        return 4; // 판매자가 데이터 전송
      case 'COMPLETED':
      case 'AUTO_REFUND':
      case 'AUTO_PAYOUT':
        return 5;
      case 'CANCELED':
      case 'REPORTED':
        return 0;
      default:
        return 1;
    }
  } else if (type === 'sales') {
    switch (status) {
      case 'SELL_REQUESTED':
        return 1;
      case 'ACCEPTED':
        return 2;
      case 'PAYMENT_CONFIRMED':
      case 'PAYMENT_CONFIRMED_ACCEPTED':
        return 3; // 구매자가 결제 → 바로 매칭
      case 'DATA_SENT':
        return 4; // 판매자가 데이터 전송
      case 'COMPLETED':
      case 'AUTO_REFUND':
      case 'AUTO_PAYOUT':
        return 5;
      case 'CANCELED':
      case 'REPORTED':
        return 0;
      default:
        return 1;
    }
  }
  return 1;
};

// 타입과 상태에 따른 진행 단계 생성
export const getProgressSteps = (
  type: 'purchase' | 'sales',
  status: string
): ProgressStep[] => {
  const currentStep = getCurrentStep(status, type);

  if (type === 'purchase') {
    return getPurchaseSteps(currentStep);
  } else {
    return getSalesSteps(currentStep);
  }
};
