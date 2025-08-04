import { useCallback } from 'react';
import { toast } from 'sonner';
import { api } from '@/app/(shared)/utils/api';
import { DisputeType } from '@/app/(shared)/types/inquiry';
import { uploadImage } from '@/app/(shared)/utils/inquiry-api';

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
        // 이미지가 있으면 먼저 업로드
        let attachmentKeys: string[] = [];
        if (data.images && data.images.length > 0) {
          const uploadPromises = data.images.map((image) => uploadImage(image));
          attachmentKeys = await Promise.all(uploadPromises);
        }

        const reportData = {
          title: data.title,
          type: data.category as DisputeType,
          description: data.content,
          attachmentKeys:
            attachmentKeys.length > 0 ? attachmentKeys : undefined,
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
