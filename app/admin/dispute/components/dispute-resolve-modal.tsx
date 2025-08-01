'use client';

import React, { useState, useEffect } from 'react';
import {
  useDisputeStore,
  Dispute,
} from '@/app/(shared)/stores/use-dispute-store';

export function DisputeResolveModal() {
  const {
    isModalOpen,
    closeModal,
    selectedDisputeId,
    resolveDispute,
    fetchDisputeById,
  } = useDisputeStore();

  const [result, setResult] = useState<Dispute['status'] | ''>('');
  const [answer, setAnswer] = useState('');
  const [currentDispute, setCurrentDispute] = useState<Dispute | null>(null);

  // 모달이 열리거나 selectedDisputeId가 변경될 때 해당 분쟁의 상세 정보를 불러옴
  useEffect(() => {
    const loadDispute = async () => {
      if (isModalOpen && selectedDisputeId) {
        const dispute = await fetchDisputeById(selectedDisputeId);
        setCurrentDispute(dispute);
        // 불러온 분쟁 정보로 모달 폼 초기화
        if (dispute) {
          setResult(dispute.status);
          setAnswer(dispute.answer || '');
        }
      } else {
        // 모달이 닫히거나 ID가 없을 때 상태 초기화
        setCurrentDispute(null);
        setResult('');
        setAnswer('');
      }
    };
    loadDispute();
  }, [isModalOpen, selectedDisputeId, fetchDisputeById]);

  // 폼 제출 핸들러
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedDisputeId && result && answer.trim()) {
      const success = await resolveDispute(
        selectedDisputeId,
        result,
        answer.trim()
      );
      if (success) {
        closeModal(); // 성공 시 모달 닫기
      }
      // 실패 시 에러 메시지는 useDisputeStore에서 처리됨
    } else {
      alert('처리 결과와 답변 내용을 모두 입력해주세요.');
    }
  };

  if (!isModalOpen || !selectedDisputeId) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-lg w-full">
        <h3 className="text-regular-lg font-semibold text-gray-800 mb-4">
          분쟁 해결하기 (ID: {selectedDisputeId})
        </h3>
        {currentDispute ? (
          <div className="mb-4 text-regular-sm text-gray-700">
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
          <div className="text-center py-4 text-gray-500 text-regular">
            분쟁 상세 정보를 불러오는 중...
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="result"
              className="block text-regular-sm font-medium text-gray-700 mb-1"
            >
              처리 결과
            </label>
            <select
              id="result"
              value={result}
              onChange={(e) => setResult(e.target.value as Dispute['status'])}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-500 focus:border-gray-500 text-regular-sm"
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
              className="block text-regular-sm font-medium text-gray-700 mb-1"
            >
              답변 내용
            </label>
            <textarea
              id="answer"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              rows={4}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-500 focus:border-gray-500 text-regular-sm"
              placeholder="분쟁 처리 내용을 입력하세요."
              required
            ></textarea>
          </div>
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={closeModal}
              className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 text-regular-sm"
            >
              취소
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-md bg-gray-700 text-white hover:bg-gray-800 text-regular-sm"
            >
              해결하기
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
