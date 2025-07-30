import type { HistoryCardProps } from '../types/history-card';
import {
  getHistoryStatusText,
  getHistoryStatusColor,
} from '../utils/history-status';

/**
 * @author 이승우
 * @description 거래 내역 카드 컴포넌트{@link HistoryCardProps(item, type, onClick)}
 * @param {HistoryItem} item 거래 내역 아이템
 * @param {'purchase' | 'sales'} type 거래 유형
 * @param {Function} onClick 거래 내역 클릭 함수
 */
export default function HistoryCard({ item, type, onClick }: HistoryCardProps) {
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
          <span
            className={`text-xs px-2 py-1 rounded ${getHistoryStatusColor(type, item.status)}`}
          >
            {getHistoryStatusText(type, item.status)}
          </span>
          <span className="text-gray-900">{item.price.toLocaleString()}원</span>
        </div>
      </div>
    </div>
  );
}
