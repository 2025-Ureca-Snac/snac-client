import { api } from './api';
import {
  InquiryItem,
  InquiryDetailItem,
  CreateInquiryRequest,
  InquiryListResponse,
  ApiResponse,
} from '../types/inquiry';

/**
 * @author 이승우
 * @description 문의 목록 조회 API
 * @param page - 페이지 번호 (기본값: 0)
 * @param size - 페이지당 항목 수 (기본값: 20)
 * @returns 문의 목록 데이터
 */
export const getInquiryList = async (
  page: number = 0,
  size: number = 20
): Promise<InquiryListResponse> => {
  const url = `/disputes/mine?page=${page}&size=${size}`;

  const response = await api.get<ApiResponse<InquiryListResponse>>(url);
  return response.data.data;
};

/**
 * @author 이승우
 * @description 문의 상세 조회 API
 * @param inquiryId - 문의 ID
 * @returns 문의 상세 데이터
 */
export const getInquiryDetail = async (
  inquiryId: number
): Promise<InquiryDetailItem> => {
  const response = await api.get<ApiResponse<InquiryDetailItem>>(
    `/disputes/${inquiryId}`
  );
  return response.data.data;
};

/**
 * @author 이승우
 * @description 문의 작성 API
 * @param inquiryData - 문의 작성 데이터
 * @returns 생성된 문의 데이터
 */
export const createInquiry = async (
  inquiryData: CreateInquiryRequest
): Promise<InquiryItem> => {
  const response = await api.post<ApiResponse<{ data: InquiryItem }>>(
    '/qna',
    inquiryData
  );

  return response.data.data.data;
};

/**
 * @author 이승우
 * @description 이미지 업로드 API
 * @param image - 업로드할 이미지 파일
 * @returns 업로드된 이미지의 S3 Key
 */
export const uploadImage = async (image: File): Promise<string> => {
  const response = await api.post<
    ApiResponse<{ uploadUrl: string; s3Key: string }>
  >(`/attachments/upload-url?filename=${image.name}`);

  // S3에 직접 업로드
  const uploadResponse = await fetch(response.data.data.uploadUrl, {
    method: 'PUT',
    body: image,
    headers: {
      'Content-Type': image.type,
    },
  });

  if (!uploadResponse.ok) {
    throw new Error('이미지 업로드에 실패했습니다.');
  }

  return response.data.data.s3Key;
};
