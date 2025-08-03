/**
 * @author 이승우
 * @description 오류 메시지 컴포넌트 Props
 */
interface ErrorMessageProps {
  /** 오류 메시지 */
  message: string;
  /** 추가 클래스명 */
  className?: string;
}

/**
 * @author 이승우
 * @description 오류 메시지 컴포넌트
 */
export default function ErrorMessage({
  message,
  className = '',
}: ErrorMessageProps) {
  return (
    <div
      className={`flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg ${className}`}
    >
      <div className="flex-shrink-0 mt-0.5">
        <svg
          className="w-4 h-4 text-red-500"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
            clipRule="evenodd"
          />
        </svg>
      </div>
      <p className="text-sm text-red-800">{message}</p>
    </div>
  );
}
