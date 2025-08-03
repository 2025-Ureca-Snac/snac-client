import {
  DisputeStatus,
  DisputeType,
} from '@/app/(shared)/stores/use-dispute-store';

export const QNA_TYPE_LABELS: Record<string, string> = {
  PAYMENT: '결제 관련',
  ACCOUNT: '계정 관련',
  TECHNICAL_PROBLEM: '기술적 문제',
  QNA_OTHER: '기타 문의',
};

export const REPORT_TYPE_LABELS: Record<string, string> = {
  DATA_NONE: '데이터 없음',
  DATA_PARTIAL: '데이터 일부',
  REPORT_OTHER: '기타 신고',
};

export const STATUS_LABELS: Record<DisputeStatus, string> = {
  IN_PROGRESS: '처리중',
  NEED_MORE: '자료요청',
  ANSWERED: '답변완료',
};

export const qnaTypeFilterCategories: Array<{
  value: DisputeType | 'ALL';
  label: string;
}> = [
  { value: 'ALL', label: '전체 유형' },
  { value: 'PAYMENT', label: '결제 관련' },
  { value: 'ACCOUNT', label: '계정 관련' },
  { value: 'TECHNICAL_PROBLEM', label: '기술적 문제' },
  { value: 'QNA_OTHER', label: '기타 문의' },
];

export const reportTypeFilterCategories: Array<{
  value: DisputeType | 'ALL';
  label: string;
}> = [
  { value: 'ALL', label: '전체 유형' },
  { value: 'DATA_NONE', label: '데이터 없음' },
  { value: 'DATA_PARTIAL', label: '데이터 일부' },
  { value: 'REPORT_OTHER', label: '기타 신고' },
];

export const statusFilterCategories: Array<{
  value: DisputeStatus | 'ALL';
  label: string;
}> = [
  { value: 'ALL', label: '전체 상태' },
  { value: 'IN_PROGRESS', label: '처리중' },
  { value: 'ANSWERED', label: '답변완료' },
  { value: 'NEED_MORE', label: '자료요청' },
];

