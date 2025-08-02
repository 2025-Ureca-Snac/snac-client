'use client';

import { useParams } from 'next/navigation';
import TradingHistoryPage from '@/app/(shared)/components/trading-history-page';

export default function SalesHistoryDetailPage() {
  const params = useParams();
  const id = params.id as string;

  return <TradingHistoryPage type="sales" selectedId={id} />;
}
