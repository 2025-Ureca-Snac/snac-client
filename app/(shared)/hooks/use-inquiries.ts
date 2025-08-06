import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { api } from '@/app/(shared)/utils/api';
import {
  InquiryItem,
  InquiryListResponse,
  DisputeType,
} from '@/app/(shared)/types/inquiry';
import { uploadImage } from '@/app/(shared)/utils/inquiry-api';

export const useInquiries = () => {
  const [inquiries, setInquiries] = useState<InquiryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  // 문의 목록 조회
  const fetchInquiries = useCallback(
    async (page: number = 0, category: string = 'ALL') => {
      try {
        setIsLoading(true);
        const params = new URLSearchParams({
          page: page.toString(),
          size: '10',
        });

        if (category !== 'ALL') {
          params.append('type', category);
        }

        const response = await api.get<InquiryListResponse>(
          `/disputes/mine?${params}`
        );
        setInquiries(response.data.content);
        setTotalPages(response.data.totalPages);
        setCurrentPage(page);
      } catch {
        toast.error('문의 목록을 불러오는데 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // 문의 작성
  const createInquiry = useCallback(
    async (data: {
      title: string;
      content: string;
      category: string;
      images?: File[];
    }) => {
      try {
        // 이미지가 있으면 먼저 업로드
        let attachmentKeys: string[] = [];
        if (data.images && data.images.length > 0) {
          const uploadPromises = data.images.map((image) => uploadImage(image));
          attachmentKeys = await Promise.all(uploadPromises);
        }

        const inquiryData = {
          title: data.title,
          type: data.category as DisputeType,
          description: data.content,
          attachmentKeys:
            attachmentKeys.length > 0 ? attachmentKeys : undefined,
        };

        await api.post('/qna', inquiryData);
        toast.success('문의가 성공적으로 등록되었습니다.');

        // 목록 새로고침
        await fetchInquiries(currentPage, selectedCategory);
        return true;
      } catch {
        toast.error('문의 등록에 실패했습니다.');
        return false;
      }
    },
    [currentPage, selectedCategory, fetchInquiries]
  );

  // 카테고리 변경
  const changeCategory = useCallback(
    (category: string) => {
      setSelectedCategory(category);
      fetchInquiries(0, category);
    },
    [fetchInquiries]
  );

  // 페이지 변경
  const changePage = useCallback(
    (page: number) => {
      fetchInquiries(page, selectedCategory);
    },
    [fetchInquiries, selectedCategory]
  );

  return {
    inquiries,
    isLoading,
    currentPage,
    totalPages,
    selectedCategory,
    fetchInquiries,
    createInquiry,
    changeCategory,
    changePage,
  };
};
