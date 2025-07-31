'use client';

import { useParams } from 'next/navigation';
import TradingHistoryPage from '@/app/(shared)/components/trading-history-page';

export default function PurchaseHistoryDetailPage() {
  const params = useParams();
  const id = params.id as string;

  return <TradingHistoryPage type="purchase" selectedId={id} />;
}
