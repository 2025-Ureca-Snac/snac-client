import { useState } from 'react';
import Image from 'next/image';

/**
 * @author 이승우
 * @description 비밀번호 입력 필드 Props
 */
interface PasswordInputFieldProps {
  /** 비밀번호 값 */
  value: string;
  /** 값 변경 핸들러 */
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  /** 플레이스홀더 */
  placeholder?: string;
  /** 필수 여부 */
  required?: boolean;
  /** 비활성화 여부 */
  disabled?: boolean;
  /** 추가 클래스명 */
  className?: string;
}

/**
 * @author 이승우
 * @description 비밀번호 입력 필드 컴포넌트
 */
export default function PasswordInputField({
  value,
  onChange,
  placeholder = '비밀번호',
  required = false,
  disabled = false,
  className = '',
}: PasswordInputFieldProps) {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  return (
    <div className={`relative flex items-center w-full ${className}`}>
      <input
        type={showPassword ? 'text' : 'password'}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        className="text-regular-md block w-full border-b-2 border-gray-300 p-2 py-4 pr-10 focus:outline-none focus:border-b-2 focus:border-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
      />
      <button
        type="button"
        className="absolute right-2 top-1/2 -translate-y-1/2 p-1"
        onClick={() => setShowPassword((prev) => !prev)}
        aria-label={showPassword ? '비밀번호 숨기기' : '비밀번호 보기'}
        disabled={disabled}
      >
        {showPassword ? (
          <Image
            src="/eye-open.png"
            width={22}
            height={22}
            alt="비밀번호 보기"
          />
        ) : (
          <Image
            src="/eye-closed.png"
            width={22}
            height={22}
            alt="비밀번호 숨기기"
          />
        )}
      </button>
    </div>
  );
}
