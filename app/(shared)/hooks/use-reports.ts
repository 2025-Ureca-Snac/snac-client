import { useCallback } from 'react';
import { toast } from 'sonner';
import { api } from '@/app/(shared)/utils/api';
import { DisputeType } from '@/app/(shared)/types/inquiry';

export const useReports = () => {
  // 신고하기 제출
  const createReport = useCallback(
    async (data: {
      title: string;
      content: string;
      category: string;
      images: File[];
      tradeId?: string;
      tradeType?: string;
    }) => {
      try {
        // 이미지 업로드 로직 (필요시 구현)
        const attachmentKeys: string[] = [];

        const reportData = {
          title: data.title,
          type: data.category as DisputeType,
          description: data.content,
          attachmentKeys,
          tradeId: data.tradeId,
          tradeType: data.tradeType,
        };

        // 신고하기 API 엔드포인트 사용
        await api.post(`/trades/${data.tradeId}/disputes`, reportData);
        toast.success('신고가 성공적으로 접수되었습니다.');
        return true;
      } catch (error) {
        console.error('신고 제출 실패:', error);
        toast.error('신고 제출에 실패했습니다.');
        return false;
      }
    },
    []
  );

  return {
    createReport,
  };
};
