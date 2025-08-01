'use client';

import React from 'react';
import {
  useDisputeStore,
  Dispute,
} from '@/app/(shared)/stores/use-dispute-store';

interface DisputeTableProps {
  activeTab: 'all' | 'pending';
}

export function DisputeTable({ activeTab }: DisputeTableProps) {
  const {
    disputes,
    pendingDisputes,
    setSelectedDisputeId,
    openModal,
    refundAndCancel,
    penaltySeller,
    finalizeDispute,
  } = useDisputeStore();

  const disputesToDisplay = activeTab === 'all' ? disputes : pendingDisputes;

  if (!disputesToDisplay || disputesToDisplay.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500">
        표시할 분쟁이 없습니다.
      </div>
    );
  }

  const handleAction = (
    dispute: Dispute,
    actionType: 'resolve' | 'refund' | 'penalty' | 'finalize' | 'delete' // 'delete' 추가 (만약 삭제 버튼이 있다면)
  ) => {
    setSelectedDisputeId(dispute.id);

    if (actionType === 'resolve') {
      openModal(); // '해결' 모달 열기
    } else if (actionType === 'refund') {
      if (confirm(`분쟁 ID ${dispute.id}를 환불 및 취소 처리하시겠습니까?`)) {
        refundAndCancel(dispute.id);
      }
    } else if (actionType === 'penalty') {
      if (
        confirm(
          `분쟁 ID ${dispute.id}에 대해 판매자에게 패널티를 부과하시겠습니까?`
        )
      ) {
        penaltySeller(dispute.id);
      }
    } else if (actionType === 'finalize') {
      if (confirm(`분쟁 ID ${dispute.id}를 종결 처리하시겠습니까?`)) {
        finalizeDispute(dispute.id);
      }
    }
    // else if (actionType === 'delete') {
    //   // delete-confirm-modal을 열기 위한 로직
    //   // 예: setItemToDeleteId(dispute.id); openDeleteConfirmModal();
    // }
  };

  const getStatusKorean = (status: Dispute['status']) => {
    switch (status) {
      case 'IN_PROGRESS':
        return '진행 중';
      case 'ANSWERED':
        return '답변 완료';
      case 'NEED_MORE':
        return '정보 요청';
      case 'REJECTED':
        return '거부됨';
      default:
        return status;
    }
  };

  const getTypeKorean = (type: Dispute['type']) => {
    switch (type) {
      case 'DATA_NONE':
        return '데이터 없음';
      case 'DATA_PARTIAL':
        return '데이터 부분적';
      case 'OTHER':
        return '기타';
      default:
        return type;
    }
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
                    dispute.status === 'IN_PROGRESS'
                      ? 'bg-blue-100 text-blue-800'
                      : dispute.status === 'ANSWERED'
                        ? 'bg-green-100 text-green-800'
                        : dispute.status === 'NEED_MORE'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
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
                {/* 만약 삭제 버튼이 테이블에 필요하다면: */}
                {/* <button
                  onClick={() => handleAction(dispute, 'delete')}
                  className="text-red-600 hover:text-red-900 ml-2"
                >
                  삭제
                </button> */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
