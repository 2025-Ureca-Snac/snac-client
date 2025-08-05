import {
  AssetType,
  PointHistoryItem,
  MoneyCategory,
  PointCategory,
} from './point-history';
import { BalanceResponse } from './point-history';

/**
 * @author 이승우
 * @description 포인트/머니 내역 컨텐츠 컴포넌트 Props
 */
export interface PointContentProps {
  tabs: { id: string; label: string }[];
  activeTab: AssetType;
  setActiveTab: (tabId: AssetType) => void;
  pointsHistory: PointHistoryItem[];
  moneyHistory: PointHistoryItem[];
  hasNext: boolean;
  onLoadMore: () => void;
  isLoadingMore: boolean;
  balance: BalanceResponse;
  selectedYear?: number;
  selectedMonth?: number;
  onYearChange?: (year: number) => void;
  onMonthChange?: (month: number) => void;
  onRefreshData?: () => void;
  isDragging?: boolean;
}

/**
 * @author 이승우
 * @description 머니 필터 타입
 */
export type MoneyFilterType = 'all' | MoneyCategory;

/**
 * @author 이승우
 * @description 포인트 필터 타입
 */
export type PointFilterType = 'all' | PointCategory;
