/**
 * @author 이승우
 * @description 메뉴 아이템 인터페이스
 */
export interface MenuItem {
  id: string;
  label: string;
  path: string;
  icon?: string;
  badge?: number;
  disabled?: boolean;
}

/**
 * @author 이승우
 * @description 사이드 메뉴 아이템 데이터
 */
export const menuItems: MenuItem[] = [
  {
    id: 'purchase-info',
    label: '구매 정보',
    path: '/mypage/purchase-history',
  },
  {
    id: 'sales-history',
    label: '판매 내역',
    path: '/mypage/sales-history',
  },
  {
    id: 'report-history',
    label: '신고 내역',
    path: '/mypage/report-history',
  },
  {
    id: 'point',
    label: '포인트',
    path: '/mypage/point',
  },
];
