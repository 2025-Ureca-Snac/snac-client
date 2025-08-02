'use client';

import { useEffect, useState } from 'react';
import {
  useDisputeStore,
  Dispute,
  DisputeStatus,
  DisputeType,
} from '@/app/(shared)/stores/use-dispute-store';
import { ResolveModal } from '../components/resolve-modal';
import DisputeDetailModal from '../components/dispute-detail-modal';

const QNA_TYPE_LABELS: Record<string, string> = {
  PAYMENT: '결제 관련',
  ACCOUNT: '계정 관련',
  TECHNICAL_PROBLEM: '기술적 문제',
  QNA_OTHER: '기타 문의',
};

const STATUS_LABELS: Record<string, string> = {
  IN_PROGRESS: '처리중',
  NEED_MORE: '자료요청',
  ANSWERED: '답변완료',
};

const qnaTypeFilterCategories: Array<{
  value: DisputeType | 'ALL';
  label: string;
}> = [
  { value: 'ALL', label: '전체 유형' },
  { value: 'PAYMENT', label: '결제 관련' },
  { value: 'ACCOUNT', label: '계정 관련' },
  { value: 'TECHNICAL_PROBLEM', label: '기술적 문제' },
  { value: 'QNA_OTHER', label: '기타 문의' },
];

const statusFilterCategories: Array<{
  value: DisputeStatus | 'ALL';
  label: string;
}> = [
  { value: 'ALL', label: '전체 상태' },
  { value: 'IN_PROGRESS', label: '처리중' },
  { value: 'ANSWERED', label: '답변완료' },
  { value: 'NEED_MORE', label: '자료요청' },
];

const StatusBadge = ({ status }: { status: DisputeStatus }) => (
  <div className="flex items-center">
    <span
      className={`h-2 w-2 rounded-full mr-2 ${
        {
          IN_PROGRESS: 'bg-yellow-500',
          NEED_MORE: 'bg-orange-500',
          ANSWERED: 'bg-green-500',
        }[status]
      }`}
    ></span>
    <span className="text-regular-sm text-gray-700 dark:text-gray-300">
      {STATUS_LABELS[status]}
    </span>
  </div>
);

export default function AdminQnaPage() {
  const {
    disputes,
    fetchDisputes,
    loading,
    filters,
    setFilters,
    openResolveModal,
    fetchDisputeById,
  } = useDisputeStore();

  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedDispute, setSelectedDispute] = useState<Dispute | null>(null);
  const [visibleStatusRowId, setVisibleStatusRowId] = useState<string | null>(
    null
  );

  useEffect(() => {
    setFilters({ category: 'QNA', type: 'ALL', status: 'ALL' });
  }, [setFilters]);

  useEffect(() => {
    if (filters.category === 'QNA') {
      fetchDisputes();
      setVisibleStatusRowId(null);
    }
  }, [filters, fetchDisputes]);

  const handleFilterChange = (filterType: 'type' | 'status', value: any) => {
    setFilters({ [filterType]: value });
    setVisibleStatusRowId(null);
  };

  const handleOpenDetailModal = async (disputeId: string) => {
    setVisibleStatusRowId(disputeId);
    const data = await fetchDisputeById(disputeId);
    if (data) {
      setSelectedDispute(data);
      setIsDetailModalOpen(true);
    }
  };

  const renderDisputeList = () => {
    if (loading)
      return (
        <div className="text-center py-20 text-regular-md text-gray-400">
          데이터를 불러오는 중입니다...
        </div>
      );
    if (disputes.length === 0)
      return (
        <div className="text-center py-20 text-regular-md text-gray-400">
          조건에 맞는 문의 내역이 없습니다.
        </div>
      );

    return (
      <div className="relative w-full">
        <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 shadow-light">
          <table
            className="
              w-full
              min-w-[800px]
              md:min-w-0
              divide-y divide-gray-200 dark:divide-gray-700
            "
          >
            <thead className="bg-gray-100 dark:bg-gray-800">
              <tr>
                <th className="px-3 py-2 md:px-6 md:py-3 text-left text-regular-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap">
                  상태
                </th>
                <th className="px-3 py-2 md:px-6 md:py-3 text-left text-regular-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap">
                  유형
                </th>
                <th className="px-3 py-2 md:px-6 md:py-3 text-left text-regular-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap">
                  제목
                </th>
                <th className="px-3 py-2 md:px-6 md:py-3 text-left text-regular-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap">
                  문의자 ID
                </th>
                <th className="px-3 py-2 md:px-6 md:py-3 text-left text-regular-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap">
                  접수일
                </th>
                <th className="px-3 py-2 md:px-6 md:py-3 text-right text-regular-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap">
                  답변
                </th>
              </tr>
            </thead>
            <tbody>
              {disputes.map((d) => (
                <tr
                  key={d.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <td className="px-3 py-3 md:px-6 md:py-4 whitespace-nowrap text-regular-sm">
                    {visibleStatusRowId === d.id && d.status ? (
                      <StatusBadge status={d.status} />
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-3 py-3 md:px-6 md:py-4 whitespace-nowrap text-regular-sm text-gray-600 dark:text-gray-400">
                    {QNA_TYPE_LABELS[d.type] ?? d.type}
                  </td>
                  <td className="px-3 py-3 md:px-6 md:py-4 whitespace-nowrap text-regular-sm font-medium text-gray-900 dark:text-gray-200">
                    <button
                      onClick={() => handleOpenDetailModal(d.id)}
                      className="hover:underline text-left break-all"
                    >
                      {d.title}
                    </button>
                  </td>
                  <td className="px-3 py-3 md:px-6 md:py-4 whitespace-nowrap text-regular-sm text-gray-600 dark:text-gray-400">
                    {d.reporter}
                  </td>
                  <td className="px-3 py-3 md:px-6 md:py-4 whitespace-nowrap text-regular-sm text-gray-600 dark:text-gray-400">
                    {new Date(d.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-3 py-3 md:px-6 md:py-4 whitespace-nowrap text-right text-regular-sm font-medium">
                    <button
                      onClick={() => {
                        setVisibleStatusRowId(d.id);
                        openResolveModal(d.id);
                      }}
                      className="text-indigo-500 hover:text-indigo-400"
                    >
                      상세/답변
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full max-w-full mx-auto px-2 md:px-6 py-4 md:py-6 bg-white dark:bg-gray-900 min-h-screen">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8 text-gray-900 dark:text-gray-100">
        문의 관리
      </h1>
      <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mb-4 md:mb-6">
        <select
          onChange={(e) => handleFilterChange('type', e.target.value)}
          value={filters.type}
          className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-regular-sm text-gray-800 dark:text-gray-200 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none w-full md:w-auto"
        >
          {qnaTypeFilterCategories.map((cat) => (
            <option key={cat.value} value={cat.value}>
              {cat.label}
            </option>
          ))}
        </select>
        <select
          onChange={(e) => handleFilterChange('status', e.target.value)}
          value={filters.status}
          className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-regular-sm text-gray-800 dark:text-gray-200 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none w-full md:w-auto"
        >
          {statusFilterCategories.map((cat) => (
            <option key={cat.value} value={cat.value}>
              {cat.label}
            </option>
          ))}
        </select>
      </div>
      {renderDisputeList()}
      <ResolveModal />
      {selectedDispute && (
        <DisputeDetailModal
          open={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          dispute={selectedDispute}
        />
      )}
    </div>
  );
}
