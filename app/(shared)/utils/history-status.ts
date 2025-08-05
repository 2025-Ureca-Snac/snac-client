export function getHistoryStatusText(
  type: 'purchase' | 'sales',
  status: string
) {
  switch (status) {
    case 'BUY_REQUESTED':
      return '거래 요청';
    case 'SELL_REQUESTED':
      return '판매 요청';
    case 'ACCEPTED':
      return '거래 수락';
    case 'PAYMENT_CONFIRMED':
      return '결제 완료';
    case 'PAYMENT_CONFIRMED_ACCEPTED':
      return '매칭 완료';
    case 'DATA_SENT':
      return '데이터 보냄';
    case 'COMPLETED':
      return '거래 완료';
    case 'CANCELED':
      return '거래 취소';
    case 'AUTO_REFUND':
      return '자동 환불';
    case 'AUTO_PAYOUT':
      return '자동 확정';
    case 'completed':
      return '거래 완료';
    case 'purchasing':
      return type === 'purchase' ? '구매요청' : '판매요청';
    case 'selling':
      return type === 'sales' ? '판매중' : '구매중';
    case 'REPORTED':
      return '신고 접수';
    default:
      return '거래 완료';
  }
}

export function getHistoryStatusColor(
  type: 'purchase' | 'sales',
  status: string
) {
  switch (status) {
    case 'BUY_REQUESTED':
    case 'ACCEPTED':
    case 'PAYMENT_CONFIRMED':
    case 'PAYMENT_CONFIRMED_ACCEPTED':
    case 'DATA_SENT':
      return 'bg-orange-500 text-white';
    case 'COMPLETED':
    case 'AUTO_PAYOUT':
      return 'bg-green-500 text-white';
    case 'CANCELED':
    case 'AUTO_REFUND':
      return 'bg-red-500 text-white';
    case 'completed':
      return 'bg-black text-white';
    case 'purchasing':
      return type === 'purchase'
        ? 'bg-red-500 text-white'
        : 'bg-green-500 text-white';
    case 'selling':
      return type === 'sales'
        ? 'bg-green-500 text-white'
        : 'bg-red-500 text-white';
    case 'REPORTED':
      return 'bg-red-200 text-white';
    default:
      return 'bg-gray-500 text-white';
  }
}
