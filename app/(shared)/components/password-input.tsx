import { useState } from 'react';
import Image from 'next/image';
import type { PasswordInputProps } from '../types/formComponents';

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
