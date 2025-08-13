/**
 * @author 이승우
 * @description 제출 버튼 컴포넌트 Props
 */
interface SubmitButtonProps {
  /** 버튼 텍스트 */
  text: string;
  /** 비활성화 여부 */
  disabled?: boolean;
  /** 로딩 상태 */
  loading?: boolean;
  /** 로딩 시 텍스트 */
  loadingText?: string;
  /** 추가 클래스명 */
  className?: string;
  /** 버튼 타입 */
  type?: 'submit' | 'button';
  /** 클릭 핸들러 */
  onClick?: () => void;
}

/**
 * @author 이승우
 * @description 제출 버튼 컴포넌트
 */
export default function SubmitButton({
  text,
  disabled = false,
  loading = false,
  loadingText = '처리 중...',
  className = '',
  type = 'submit',
  onClick,
}: SubmitButtonProps) {
  const isDisabled = disabled || loading;
  const buttonText = loading ? loadingText : text;

  return (
    <button
      type={type}
      disabled={isDisabled}
      onClick={onClick}
      className={`w-full py-3 px-4 bg-black text-primary-foreground rounded-md hover:bg-card transition-colors font-medium disabled:bg-muted disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${className}`}
    >
      {buttonText}
    </button>
  );
}
