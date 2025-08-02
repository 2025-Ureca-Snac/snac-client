'use client';

import React from 'react';
import {
  useDisputeStore,
  Dispute,
  DisputeStatus,
  DisputeType,
} from '@/app/(shared)/stores/use-dispute-store';

interface DisputeTableProps {
  activeTab: 'all' | 'pending';
}

export function DisputeTable({ activeTab }: DisputeTableProps) {
  const {
    disputes,
    pendingDisputes,
    openConfirmModal,
    openResolveModal,
    openDeleteModal,
    refundAndCancel,
    penaltySeller,
    finalize,
  } = useDisputeStore();

  const disputesToDisplay = activeTab === 'all' ? disputes : pendingDisputes;

  if (!Array.isArray(disputesToDisplay) || disputesToDisplay.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500">
        표시할 분쟁이 없습니다.
      </div>
    );
  }

  const handleAction = (
    dispute: Dispute,
    actionType: 'resolve' | 'refund' | 'penalty' | 'finalize' | 'delete'
  ) => {
    switch (actionType) {
      case 'resolve':
        openResolveModal(dispute.id);
        break;
      case 'refund':
        openConfirmModal(
          `분쟁 ID ${dispute.id}를 환불 및 취소 처리하시겠습니까?`,
          () => refundAndCancel(dispute.id)
        );
        break;
      case 'penalty':
        openConfirmModal(
          `분쟁 ID ${dispute.id}에 대해 판매자에게 패널티를 부과하시겠습니까?`,
          () => penaltySeller(dispute.id)
        );
        break;
      case 'finalize':
        openConfirmModal(`분쟁 ID ${dispute.id}를 종결 처리하시겠습니까?`, () =>
          finalize(dispute.id)
        );
        break;
      case 'delete':
        openDeleteModal(dispute.id);
        break;
      default:
        console.error('Unknown action type:', actionType);
    }
  };

  const getStatusKorean = (status: DisputeStatus) => {
    const statusMap: Record<DisputeStatus, string> = {
      IN_PROGRESS: '진행 중',
      ANSWERED: '답변 완료',
      NEED_MORE: '정보 요청',
      REJECTED: '거부됨',
    };
    return statusMap[status] || status;
  };

  const getTypeKorean = (type: DisputeType) => {
    const typeMap: Record<DisputeType, string> = {
      DATA_NONE: '데이터 없음',
      DATA_PARTIAL: '데이터 부분 제공',
      OTHER: '기타',
    };
    return typeMap[type] || type;
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              ID
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              상태
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              유형
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              신고자
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              생성일
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              작업
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {disputesToDisplay.map((dispute) => (
            <tr key={dispute.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {dispute.id}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                <span
                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    {
                      IN_PROGRESS: 'bg-blue-100 text-blue-800',
                      ANSWERED: 'bg-green-100 text-green-800',
                      NEED_MORE: 'bg-yellow-100 text-yellow-800',
                      REJECTED: 'bg-red-100 text-red-800',
                    }[dispute.status]
                  }`}
                >
                  {getStatusKorean(dispute.status)}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {getTypeKorean(dispute.type)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {dispute.reporter}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {new Date(dispute.createdAt).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-left text-sm font-medium">
                <button
                  onClick={() => handleAction(dispute, 'resolve')}
                  className="text-indigo-600 hover:text-indigo-900 mr-2"
                >
                  해결
                </button>
                <button
                  onClick={() => handleAction(dispute, 'refund')}
                  className="text-purple-600 hover:text-purple-900 mr-2"
                >
                  환불/취소
                </button>
                <button
                  onClick={() => handleAction(dispute, 'penalty')}
                  className="text-orange-600 hover:text-orange-900 mr-2"
                >
                  판매자 패널티
                </button>
                <button
                  onClick={() => handleAction(dispute, 'finalize')}
                  className="text-gray-600 hover:text-gray-900"
                >
                  종결
                </button>
                <button
                  onClick={() => handleAction(dispute, 'delete')}
                  className="text-red-600 hover:text-red-900 ml-2"
                >
                  삭제
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
