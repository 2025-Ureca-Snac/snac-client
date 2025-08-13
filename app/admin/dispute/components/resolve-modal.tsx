'use client';

import { useEffect, useState } from 'react';
import {
  useDisputeStore,
  Dispute,
  DisputeStatus,
} from '@/app/(shared)/stores/use-dispute-store';
import ModalPortal from '@/app/(shared)/components/modal-portal';
import { toast } from 'sonner';

export function ResolveModal() {
  const {
    isResolveModalOpen,
    closeResolveModal,
    selectedDisputeId,
    fetchDisputeById,
    resolveDispute,
  } = useDisputeStore();

  const [dispute, setDispute] = useState<Dispute | null>(null);
  const [answer, setAnswer] = useState('');
  const [newStatus, setNewStatus] = useState<DisputeStatus>('ANSWERED');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isResolveModalOpen && selectedDisputeId) {
      setIsLoading(true);
      fetchDisputeById(selectedDisputeId)
        .then((data) => {
          if (data) {
            setDispute(data);
            setAnswer(data.answer || '');
            const validStatuses: DisputeStatus[] = [
              'IN_PROGRESS',
              'ANSWERED',
              'NEED_MORE',
            ];
            if (validStatuses.includes(data.status)) {
              setNewStatus(data.status);
            } else {
              setNewStatus('ANSWERED');
            }
          }
        })
        .finally(() => setIsLoading(false));
    } else {
      setDispute(null);
      setAnswer('');
      setNewStatus('ANSWERED');
    }
  }, [isResolveModalOpen, selectedDisputeId, fetchDisputeById]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDisputeId || !answer.trim()) {
      toast.error('답변 내용을 입력해주세요.');
      return;
    }
    setIsLoading(true);
    const success = await resolveDispute(selectedDisputeId, newStatus, answer);
    setIsLoading(false);

    if (success) {
      closeResolveModal();
    }
  };

  return (
    <ModalPortal isOpen={isResolveModalOpen} onClose={closeResolveModal}>
      <div
        className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50"
        onClick={closeResolveModal}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-xs md:max-w-2xl bg-card rounded-2xl shadow-light flex flex-col max-h-[90vh] border border-border"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          {/* 헤더 */}
          <div className="flex items-start justify-between p-4 md:p-5 border-b border-border bg-muted bg-background rounded-t-2xl">
            <h2
              id="modal-title"
              className="text-regular-lg md:text-regular-xl font-bold text-card-foreground"
            >
              답변 및 처리
            </h2>
            <button
              onClick={closeResolveModal}
              className="text-muted-foreground hover:text-foreground"
            >
              <span className="sr-only">닫기</span>
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* 내용 */}
          <div className="p-3 md:p-6 space-y-4 overflow-y-auto">
            {isLoading && !dispute ? (
              <div className="py-10 text-center text-regular-md text-muted-foreground">
                정보를 불러오는 중...
              </div>
            ) : (
              dispute && (
                <form onSubmit={handleSubmit}>
                  {/* 원본 내용 */}
                  <div className="p-3 md:p-4 bg-secondary rounded-md mb-4">
                    <h3 className="font-semibold text-regular-md text-card-foreground">
                      {dispute.title}
                    </h3>
                    <p className="mt-2 text-regular-sm text-foreground whitespace-pre-wrap">
                      {dispute.description}
                    </p>
                    <p className="mt-3 text-regular-xs text-muted-foreground">
                      작성자 ID: {dispute.reporter}
                    </p>
                  </div>

                  {/* 답변 입력 */}
                  <div>
                    <label
                      htmlFor="answer"
                      className="block text-regular-sm font-medium text-foreground mb-1"
                    >
                      답변 내용
                    </label>
                    <textarea
                      id="answer"
                      rows={6}
                      value={answer}
                      onChange={(e) => setAnswer(e.target.value)}
                      className="w-full p-2 text-regular-sm bg-muted border border-border rounded-md focus:ring-2 focus:ring-gray-400:ring-gray-500 focus:outline-none text-foreground"
                      placeholder="답변을 입력하세요..."
                    />
                  </div>

                  {/* 상태 변경 */}
                  <div className="mt-4">
                    <label
                      htmlFor="status"
                      className="block text-regular-sm font-medium text-foreground mb-1"
                    >
                      처리 상태 변경
                    </label>
                    <select
                      id="status"
                      value={newStatus}
                      onChange={(e) =>
                        setNewStatus(e.target.value as DisputeStatus)
                      }
                      className="w-full p-2 text-regular-sm bg-muted border border-border rounded-md focus:ring-2 focus:ring-gray-400:ring-gray-500 focus:outline-none text-foreground"
                    >
                      <option value="ANSWERED">답변완료</option>
                      <option value="NEED_MORE">자료요청</option>
                      <option value="IN_PROGRESS">처리중</option>
                    </select>
                  </div>

                  {/* 푸터 및 제출 버튼 */}
                  <div className="mt-6 flex justify-end">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="px-6 py-2 font-semibold text-regular-md bg-muted text-primary-foreground rounded-md hover:bg-card:bg-muted0 disabled:bg-muted:bg-muted disabled:cursor-not-allowed"
                    >
                      {isLoading ? '제출 중...' : '답변 제출'}
                    </button>
                  </div>
                </form>
              )
            )}
          </div>
        </div>
      </div>
    </ModalPortal>
  );
}
