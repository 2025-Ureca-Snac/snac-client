import { useState } from 'react';
import Image from 'next/image';
import type { PasswordInputProps } from '../types/formComponents';

/**
 * @author 이승우
 * @description 비밀번호 입력 필드 컴포넌트{@link PasswordInputProps(label, id, name, value, onChange, placeholder, required=false, disabled=false, helpText, showHelpText=false, helpTextColor='gray')}
 * @param {string} label 라벨
 * @param {string} id ID
 * @param {string} name 이름
 * @param {string} value 값
 * @param {Function} onChange 변경 함수
 * @param {string} placeholder 플레이스홀더
 * @param {boolean} required 필수 여부
 * @param {boolean} disabled 비활성화 여부
 * @param {string} helpText 도움말 텍스트
 * @param {boolean} showHelpText 도움말 표시 여부
 * @param {string} helpTextColor 도움말 색상
 */
export default function PasswordInput({
  label,
  id,
  name,
  value,
  onChange,
  placeholder,
  required = false,
  disabled = false,
  helpText,
  showHelpText = false,
  helpTextColor = 'gray',
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  /**
   * @author 이승우
   * @description 레드 : 비밀번호 불일치, 그린 : 비밀번호 일치, 그레이 : 비밀번호 입력 전
   */
  const helpTextColorClass: Record<string, string> = {
    red: 'text-red-500',
    green: 'text-green-500',
    gray: 'text-gray-500',
  };

  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-700 mb-2"
      >
        {label}
      </label>
      <div className="relative">
        <input
          type={showPassword ? 'text' : 'password'}
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          className="w-full px-3 py-3 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute inset-y-0 right-0 pr-3 flex items-center"
        >
          <Image
            src={showPassword ? '/eye-open.png' : '/eye-closed.png'}
            alt={showPassword ? '비밀번호 숨기기' : '비밀번호 보기'}
            width={20}
            height={20}
          />
        </button>
      </div>
      <p
        className={`text-sm mt-2 min-h-[20px] ${helpTextColorClass[helpTextColor] || 'text-gray-500'}`}
      >
        {showHelpText && helpText ? helpText : ''}
      </p>
    </div>
  );
}
