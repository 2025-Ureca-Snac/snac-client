'use client';

import { useEffect, useState } from 'react';
import {
  useDisputeStore,
  Dispute,
  DisputeStatus,
  DisputeType,
} from '@/app/(shared)/stores/use-dispute-store';
import { ResolveModal } from '../components/resolve-modal';
import { ConfirmModal } from '../components/confirm-modal';
import DisputeDetailModal from '../components/dispute-detail-modal';
import { StatusBadge } from '../components/StatusBadge';
import {
  REPORT_TYPE_LABELS,
  reportTypeFilterCategories,
  statusFilterCategories,
} from '../lib/constants';

export default function AdminReportPage() {
  const {
    disputes,
    fetchDisputes,
    loading,
    filters,
    setFilters,
    openResolveModal,
    openConfirmModal,
    refundAndCancel,
    penalizeSeller,
    finalize,
    fetchDisputeById,
  } = useDisputeStore();

  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedDispute, setSelectedDispute] = useState<Dispute | null>(null);

  useEffect(() => {
    setFilters({ category: 'REPORT', type: 'ALL', status: 'ALL' });
  }, [setFilters]);

  useEffect(() => {
    if (filters.category === 'REPORT') {
      fetchDisputes();
    }
  }, [filters, fetchDisputes]);

  const handleTypeChange = (value: DisputeType | 'ALL') => {
    setFilters({ type: value });
  };

  const handleStatusChange = (value: DisputeStatus | 'ALL') => {
    setFilters({ status: value });
  };

  const handleOpenDetailModal = async (disputeId: string) => {
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
          조건에 맞는 신고 내역이 없습니다.
        </div>
      );

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {disputes.map((d) => (
          <div
            key={d.id}
            className="bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow-light flex flex-col justify-between"
          >
            <div>
              <div className="flex justify-between items-start mb-3">
                <div className="flex flex-col mr-2">
                  <span className="text-regular-xs text-gray-500 dark:text-gray-400">
                    {REPORT_TYPE_LABELS[d.type] ?? d.type}
                  </span>
                  <button
                    onClick={() => handleOpenDetailModal(d.id)}
                    className="text-regular-md font-bold text-gray-900 dark:text-gray-100 hover:underline text-left mt-1 break-words"
                  >
                    {d.title}
                  </button>
                </div>
                {d.status && <StatusBadge status={d.status} />}
              </div>
              <div className="text-regular-sm text-gray-600 dark:text-gray-400 space-y-2 border-t border-gray-200 dark:border-gray-700 pt-3 mt-3">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-500">작성자 ID:</span>
                  <span className="truncate ml-2">{d.id}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-500">
                    작성자 닉네임:
                  </span>
                  <span className="truncate ml-2">
                    {d.reporterNickname ?? '-'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-500">접수일:</span>
                  <span>{new Date(d.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex flex-wrap items-center justify-end gap-x-4 gap-y-2">
              <button
                onClick={() => openResolveModal(d.id)}
                className="font-medium text-teal-green hover:font-semibold"
              >
                상세/답변
              </button>
              {d.status === 'ANSWERED' && (
                <>
                  <button
                    onClick={() =>
                      openConfirmModal(
                        '환불 및 거래 취소 확인',
                        '해당 건에 대해 환불 및 거래 취소를 진행하시겠습니까?',
                        () => refundAndCancel(d.id)
                      )
                    }
                    className="text-gray-400 hover:text-gray-300 font-medium"
                  >
                    환불
                  </button>
                  <button
                    onClick={() =>
                      openConfirmModal(
                        '패널티 부여 확인',
                        '판매자에게 패널티를 부여하시겠습니까?',
                        () => penalizeSeller(d.id)
                      )
                    }
                    className="text-yellow-400 hover:text-yellow-300 font-medium"
                  >
                    패널티
                  </button>
                  <button
                    onClick={() =>
                      openConfirmModal(
                        '최종 처리 확인',
                        '해당 건을 최종 처리하고 거래를 원상 복구하시겠습니까?',
                        () => finalize(d.id)
                      )
                    }
                    className="text-gray-400 hover:text-gray-300 font-medium"
                  >
                    최종처리
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row md:items-center gap-2 mb-6">
        <select
          onChange={(e) =>
            handleTypeChange(e.target.value as DisputeType | 'ALL')
          }
          value={filters.type}
          className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-regular-sm text-gray-800 dark:text-gray-200 rounded-md px-3 py-2 focus:ring-2 focus:ring-teal-green focus:outline-none w-full md:w-auto"
        >
          {reportTypeFilterCategories.map((cat) => (
            <option key={cat.value} value={cat.value}>
              {cat.label}
            </option>
          ))}
        </select>
        <select
          onChange={(e) =>
            handleStatusChange(e.target.value as DisputeStatus | 'ALL')
          }
          value={filters.status}
          className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-regular-sm text-gray-800 dark:text-gray-200 rounded-md px-3 py-2 focus:ring-2 focus:ring-teal-green focus:outline-none w-full md:w-auto"
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
      <ConfirmModal />
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
