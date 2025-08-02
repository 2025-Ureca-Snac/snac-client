import { InquiryDetailItem } from './inquiry';

/**
 * @author 이승우
 * @description 문의 상세 모달 컴포넌트 Props
 */
export interface InquiryDetailModalProps {
  open: boolean;
  onClose: () => void;
  inquiry: InquiryDetailItem | null;
}
