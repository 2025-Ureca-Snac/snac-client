/**
 * @author 이승우
 * @description 액션 버튼 인터페이스(라벨, 아이콘, 링크)
 */
export interface ActionButton {
  label: string;
  icon: string;
  href: string;
}

/**
 * @author 이승우
 * @description 액션 버튼 목록 (판매 내역, 구매 내역, 신고 내역)
 */
export const actionButtons: ActionButton[] = [
  {
    label: '판매 내역',
    icon: '📄',
    href: '/mypage/sales-history',
  },
  {
    label: '구매 내역',
    icon: '📄',
    href: '/mypage/purchase-history',
  },
  {
    label: '문의 내역',
    icon: '⚠️',
    href: '/mypage/report-history',
  },
];
