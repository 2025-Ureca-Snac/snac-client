/**
 * @author 이승우
 * @description 정산 모달 컴포넌트 타입
 * @interface SettlementModalProps
 * @property {boolean} open 모달 열림/닫힘 상태
 * @property {() => void} onClose 모달 닫기 함수
 * @property {number} currentMoney 현재 머니 잔액
 * @property {(amount: number, type: string) => void} onSettlementSuccess 정산 성공 콜백
 */
export interface SettlementModalProps {
  open: boolean;
  onClose: () => void;
  currentMoney: number;
  onSettlementSuccess?: (amount: number, type: string) => void;
}

/**
 * @author 이승우
 * @description 정산 요청 데이터 타입
 * @interface SettlementRequest
 * @property {number} amount 정산 금액
 * @property {string} message 정산 메모 (선택사항)
 */
export interface SettlementRequest {
  amount: number;
  message?: string;
}

/**
 * @author 이승우
 * @description 은행 정보 타입
 * @interface Bank
 * @property {number} id 은행 ID
 * @property {string} name 은행명
 */
export interface Bank {
  id: number;
  name: string;
}

/**
 * @author 이승우
 * @description 계좌 정보 타입
 * @interface BankAccount
 * @property {string} id 계좌 ID
 * @property {string} bankName 은행명
 * @property {string} accountNumber 계좌번호
 * @property {string} accountHolder 예금주명
 * @property {boolean} isDefault 기본 계좌 여부
 */
export interface BankAccount {
  id: string;
  bankName: string;
  accountNumber: string;
  accountHolder: string;
  isDefault: boolean;
}

/**
 * @author 이승우
 * @description 계좌 등록/수정 요청 데이터 타입
 * @interface BankAccountRequest
 * @property {number} bankId 은행 ID
 * @property {string} accountNumber 계좌번호
 * @property {string} accountHolder 예금주명
 */
export interface BankAccountRequest {
  bankId: number;
  accountNumber: string;
  accountHolder: string;
}
