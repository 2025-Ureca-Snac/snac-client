'use client';

import React, { useEffect, useState } from 'react';
import { useDisputeStore } from '@/app/(shared)/stores/use-dispute-store';
import { DisputeTable } from './components/dispute-table';
import { DisputeResolveModal } from './components/dispute-resolve-modal';
import { DeleteConfirmModal } from './components/delete-confirm-modal';

export default function Page() {
  const {
    fetchDisputes,
    fetchPendingDisputes,
    loading,
    error,
    currentPage,
    totalPages,
    setCurrentPage,
  } = useDisputeStore();

  const [filterStatus, setFilterStatus] = useState<string>('');
  const [filterType, setFilterType] = useState<string>('');
  const [filterReporter, setFilterReporter] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'all' | 'pending'>('all');

  useEffect(() => {
    setCurrentPage(0);
  }, [activeTab, filterStatus, filterType, filterReporter, setCurrentPage]);

  useEffect(() => {
    if (activeTab === 'all') {
      fetchDisputes(
        filterStatus as any,
        filterType as any,
        filterReporter,
        currentPage,
        20
      );
    } else {
      fetchPendingDisputes(currentPage, 20);
    }
  }, [
    fetchDisputes,
    fetchPendingDisputes,
    activeTab,
    filterStatus,
    filterType,
    filterReporter,
    currentPage,
  ]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 0 && newPage < totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <>
      <div className="flex-1 overflow-x-hidden overflow-y-auto p-6">
        <div className="bg-white p-8 rounded-xl shadow-light mb-6 border border-gray-100">
          <h2 className="text-regular-lg font-semibold text-gray-800 mb-4">
            분쟁 필터링 및 검색
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label
                htmlFor="statusFilter"
                className="block text-regular-sm font-medium text-gray-700 mb-1"
              >
                상태
              </label>
              <select
                id="statusFilter"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-gray-400 focus:border-gray-400 text-regular-sm"
              >
                <option value="">모든 상태</option>
                <option value="IN_PROGRESS">진행 중</option>
                <option value="ANSWERED">답변 완료</option>
                <option value="NEED_MORE">정보 요청</option>
                <option value="REJECTED">거부됨</option>
              </select>
            </div>
            <div>
              <label
                htmlFor="typeFilter"
                className="block text-regular-sm font-regular-medium text-gray-700 mb-1"
              >
                유형
              </label>
              <select
                id="typeFilter"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-gray-400 focus:border-gray-400 text-regular-sm"
              >
                <option value="">모든 유형</option>
                <option value="DATA_NONE">데이터 없음</option>
                <option value="DATA_PARTIAL">데이터 부분적</option>
                <option value="OTHER">기타</option>
              </select>
            </div>
            <div>
              <label
                htmlFor="reporterFilter"
                className="block text-regular-sm font-medium text-gray-700 mb-1"
              >
                신고자
              </label>
              <input
                type="text"
                id="reporterFilter"
                value={filterReporter}
                onChange={(e) => setFilterReporter(e.target.value)}
                placeholder="신고자 ID 입력"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-400 focus:border-gray-400 text-regular-sm"
              />
            </div>
          </div>
        </div>
        <div className="flex bg-white rounded-t-xl overflow-hidden shadow-light border-b border-gray-200">
          <button
            onClick={() => setActiveTab('all')}
            className={`flex-1 py-3 px-4 text-center text-regular-sm font-medium transition-all duration-200 ease-in-out ${
              activeTab === 'all'
                ? 'text-gray-700 border-b-2 border-gray-500'
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
            }`}
          >
            모든 분쟁
          </button>
          <button
            onClick={() => setActiveTab('pending')}
            className={`flex-1 py-3 px-4 text-center text-regular-sm font-medium transition-all duration-200 ease-in-out ${
              activeTab === 'pending'
                ? 'text-gray-700 border-b-2 border-gray-500'
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
            }`}
          >
            대기 중인 분쟁
          </button>
        </div>
        <div className="bg-white p-8 rounded-b-xl shadow-light mt-0 border border-t-0 border-gray-100">
          <h3 className="text-regular-lg font-semibold text-gray-800 mb-4">
            {activeTab === 'all' ? '모든 분쟁 목록' : '대기 중인 분쟁 목록'}
          </h3>
          {loading && (
            <div className="text-center py-10 text-gray-600 font-medium text-regular">
              데이터를 불러오는 중...
            </div>
          )}
          {error && (
            <div className="text-center py-10 text-red-500 text-regular">
              {error}
            </div>
          )}
          {!loading && !error && <DisputeTable activeTab={activeTab} />}
        </div>
        {!loading && totalPages > 1 && (
          <div className="flex justify-center mt-8">
            <nav
              className="relative z-0 inline-flex rounded-lg shadow-sm overflow-hidden border border-gray-200"
              aria-label="Pagination"
            >
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 0}
                className="relative inline-flex items-center px-4 py-2 rounded-l-lg border-r border-gray-200 bg-white text-regular-sm font-medium text-gray-700 hover:bg-gray-100 focus:z-10 focus:outline-none focus:ring-1 focus:ring-gray-400 transition duration-200 ease-in-out"
              >
                이전
              </button>
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => handlePageChange(i)}
                  className={`relative inline-flex items-center px-4 py-2 border-r border-gray-200 bg-white text-regular-sm font-medium ${
                    currentPage === i
                      ? 'z-10 bg-gray-50 text-gray-700 focus:outline-none focus:ring-1 focus:ring-gray-400'
                      : 'text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-gray-400'
                  } transition duration-200 ease-in-out`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages - 1}
                className="relative inline-flex items-center px-4 py-2 rounded-r-lg bg-white text-regular-sm font-medium text-gray-700 hover:bg-gray-100 focus:z-10 focus:outline-none focus:ring-1 focus:ring-gray-400 transition duration-200 ease-in-out"
              >
                다음
              </button>
            </nav>
          </div>
        )}
      </div>

      <DisputeResolveModal />

      <DeleteConfirmModal />
    </>
  );
}
