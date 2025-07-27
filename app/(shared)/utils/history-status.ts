export function getHistoryStatusText(
  type: 'purchase' | 'sales',
  status: string
) {
  if (status === 'completed') return '거래완료';
  if (type === 'purchase' && status === 'purchasing') return '구매요청';
  if (type === 'sales' && status === 'selling') return '판매중';
  return '';
}

export function getHistoryStatusColor(
  type: 'purchase' | 'sales',
  status: string
) {
  if (status === 'completed') return 'bg-black text-white';
  if (type === 'purchase' && status === 'purchasing')
    return 'bg-red-500 text-white';
  if (type === 'sales' && status === 'selling')
    return 'bg-green-500 text-white';
  return 'bg-gray-500 text-white';
}
