/**
 * @author 이승우
 * @description 문의 데이터
 */
export interface InquiryData {
  title: string;
  content: string;
  category: string;
  images?: File[];
}

/**
 * @author 이승우
 * @description 문의 모달 컴포넌트 Props
 */
export interface InquiryModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (inquiry: InquiryData) => Promise<void>;
}
