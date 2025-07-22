interface HistoryItem {
  id: number;
  date: string;
  title: string;
  price: number;
  status: 'purchasing' | 'selling' | 'completed';
  transactionNumber?: string;
  carrier?: string;
  dataAmount?: string;
  phoneNumber?: string;
}

interface HistoryCardProps {
  item: HistoryItem;
  type: 'purchase' | 'sales';
  onClick: (item: HistoryItem) => void;
}

export default function HistoryCard({ item, type, onClick }: HistoryCardProps) {
  const getStatusText = () => {
    if (item.status === 'completed') return '거래완료';
    if (type === 'purchase' && item.status === 'purchasing') return '구매요청';
    if (type === 'sales' && item.status === 'selling') return '판매중';
    return '';
  };

  const getStatusColor = () => {
    if (item.status === 'completed') return 'bg-black text-white';
    if (type === 'purchase' && item.status === 'purchasing')
      return 'bg-red-500 text-white';
    if (type === 'sales' && item.status === 'selling')
      return 'bg-green-500 text-white';
    return 'bg-gray-500 text-white';
  };

  return (
    <div
      className="bg-gray-50 rounded-lg p-4 flex items-start gap-3 cursor-pointer hover:bg-gray-100 transition-colors"
      onClick={() => onClick(item)}
    >
      {/* 아이콘 */}
      <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
        <span className="text-blue-600 font-bold text-lg">T</span>
      </div>

      {/* 내용 */}
      <div className="flex-1 min-w-0">
        <div className="text-sm text-gray-500 mb-1">{item.date}</div>
        <div className="font-semibold text-gray-900 mb-1">{item.title}</div>
        <div className="flex items-center gap-2">
          <span className={`text-xs px-2 py-1 rounded ${getStatusColor()}`}>
            {getStatusText()}
          </span>
          <span className="text-gray-900">{item.price.toLocaleString()}원</span>
        </div>
      </div>
    </div>
  );
}

export type { HistoryItem };
