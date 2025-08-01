'use client';

import React, { useState, useEffect } from 'react';
import {
  useDisputeStore,
  Dispute,
} from '@/app/(shared)/stores/use-dispute-store';
import { toast } from 'sonner';

export function DisputeResolveModal() {
  const {
    isResolveModalOpen,
    closeResolveModal,
    selectedDisputeId,
    resolveDispute,
    fetchDisputeById,
  } = useDisputeStore();

  const [result, setResult] = useState<Dispute['status'] | ''>('');
  const [answer, setAnswer] = useState('');
  const [currentDispute, setCurrentDispute] = useState<Dispute | null>(null);

  useEffect(() => {
    const loadDispute = async () => {
      if (isResolveModalOpen && selectedDisputeId) {
        const dispute = await fetchDisputeById(selectedDisputeId);
        setCurrentDispute(dispute);

        if (dispute) {
          setResult(dispute.status);
          setAnswer(dispute.answer || '');
        }
      } else {
        setCurrentDispute(null);
        setResult('');
        setAnswer('');
      }
    };
    loadDispute();
  }, [isResolveModalOpen, selectedDisputeId, fetchDisputeById]);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedDisputeId && result && answer.trim()) {
      const success = await resolveDispute(
        selectedDisputeId,
        result,
        answer.trim()
      );
      if (success) {
        closeResolveModal();
      }
    } else {
      toast.error('처리 결과와 답변 내용을 모두 입력해주세요.');
    }
  };

  if (!isResolveModalOpen || !selectedDisputeId) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-lg w-full">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          분쟁 해결하기 (ID: {selectedDisputeId})
        </h3>
        {currentDispute ? (
          <div className="mb-4 text-sm text-gray-700 space-y-1">
            <p>
              <strong>신고자:</strong> {currentDispute.reporter}
            </p>
            <p>
              <strong>분쟁 유형:</strong> {currentDispute.type}
            </p>
            <p>
              <strong>현재 상태:</strong> {currentDispute.status}
            </p>
            <p>
              <strong>생성일:</strong>{' '}
              {new Date(currentDispute.createdAt).toLocaleDateString()}
            </p>
          </div>
        ) : (
          <div className="text-center py-4 text-gray-500">
            분쟁 상세 정보를 불러오는 중...
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="result"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              처리 결과
            </label>
            <select
              id="result"
              value={result}
              onChange={(e) => setResult(e.target.value as Dispute['status'])}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-500 focus:border-gray-500 text-sm"
              required
            >
              <option value="">선택하세요</option>
              <option value="IN_PROGRESS">진행 중</option>
              <option value="ANSWERED">답변 완료</option>
              <option value="NEED_MORE">정보 요청</option>
              <option value="REJECTED">거부됨</option>
            </select>
          </div>
          <div className="mb-6">
            <label
              htmlFor="answer"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              답변 내용
            </label>
            <textarea
              id="answer"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              rows={4}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-500 focus:border-gray-500 text-sm"
              placeholder="분쟁 처리 내용을 입력하세요."
              required
            ></textarea>
          </div>
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={closeResolveModal}
              className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 text-sm"
            >
              취소
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-md bg-gray-700 text-white hover:bg-gray-800 text-sm"
            >
              해결하기
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
