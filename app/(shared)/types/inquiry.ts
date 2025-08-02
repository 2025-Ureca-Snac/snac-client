export interface InquiryItem {
  disputeId: number;
  status: string;
  type: string;
  title: string;
  description: string;
  createdAt: string;
  answerAt: string | null;
  trade: unknown | null;
}

export enum DisputeType {
  DATA_NONE = 'DATA_NONE',
  DATA_PARTIAL = 'DATA_PARTIAL',
  PAYMENT = 'PAYMENT',
  ACCOUNT = 'ACCOUNT',
  TECHNICAL_PROBLEM = 'TECHNICAL_PROBLEM',
  OTHER = 'OTHER',
}

export interface CreateInquiryRequest {
  title: string;
  type: DisputeType;
  description: string;
  attachmentKeys?: string[];
}

export interface InquiryListResponse {
  content: InquiryItem[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      empty: boolean;
      unsorted: boolean;
      sorted: boolean;
    };
    offset: number;
    unpaged: boolean;
    paged: boolean;
  };
  totalElements: number;
  totalPages: number;
  last: boolean;
  size: number;
  number: number;
  sort: {
    empty: boolean;
    unsorted: boolean;
    sorted: boolean;
  };
  numberOfElements: number;
  first: boolean;
  empty: boolean;
}

export interface InquiryDetailItem {
  id: number;
  status: string;
  type: string;
  title: string;
  description: string;
  answer: string | null;
  attachmentUrls: string[];
  createdAt: string;
  answerAt: string | null;
}

export interface InquiryDetailResponse {
  data: InquiryDetailItem;
}

export interface ApiResponse<T> {
  status: number;
  message: string;
  data: T;
}
