import { KeyboardEvent, forwardRef } from 'react';
import type { VerificationInputProps } from '../types/formComponents';

/**
 * @author 이승우
 * @description 인증코드 입력 필드 컴포넌트
 * @param {string} label 라벨
 * @param {string} id ID
 * @param {string} name 이름
 * @param {string} value 값
 * @param {Function} onChange 변경 함수
 * @param {string} placeholder 플레이스홀더
 * @param {boolean} required 필수 여부
 * @param {boolean} disabled 비활성화 여부
 * @param {Function} onVerify 인증 함수
 * @param {boolean} verifyDisabled 인증 비활성화 여부
 * @param {string} helpText 도움말 텍스트
 * @param {boolean} showHelpText 도움말 표시 여부
 */
const VerificationInput = forwardRef<HTMLInputElement, VerificationInputProps>(
  (
    {
      label,
      id,
      name,
      value,
      onChange,
      placeholder = '인증코드',
      required = false,
      disabled = false,
      onVerify,
      verifyDisabled = false,
      helpText,
      showHelpText = false,
      autoComplete,
    },
    ref
  ) => {
    return (
      <div>
        <label
          htmlFor={id}
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          {label}
        </label>
        <div className="flex space-x-2">
          <input
            ref={ref}
            type="text"
            id={id}
            name={name}
            value={value}
            onChange={onChange}
            onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
              if (e.key === 'Enter' && !verifyDisabled && onVerify) {
                e.preventDefault();
                onVerify();
              }
            }}
            placeholder={placeholder}
            required={required}
            disabled={disabled}
            autoComplete={autoComplete}
            className="flex-1 px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed h-[48px] min-w-0"
          />
          <button
            type="button"
            onClick={onVerify}
            disabled={verifyDisabled}
            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap h-[48px] flex items-center justify-center flex-shrink-0"
          >
            확인
          </button>
        </div>
        <p className="text-red-500 text-sm mt-2 min-h-[20px]">
          {showHelpText && helpText ? helpText : ''}
        </p>
      </div>
    );
  }
);
VerificationInput.displayName = 'VerificationInput';
export default VerificationInput;
