import { KeyboardEvent, forwardRef } from 'react';
import type { InputWithButtonProps } from '../types/formComponents';

/**
 * @author 이승우
 * @description {@link InputField} 컴포넌트와 버튼을 결합한 컴포넌트{@link InputWithButtonProps(label, type='text', id, name, value, onChange, placeholder, required=false, disabled=false, buttonText, onButtonClick, buttonDisabled=false)}
 * @param {string} label 라벨
 * @param {string} type 타입
 * @param {string} id ID
 * @param {string} name 이름
 * @param {string} value 값
 * @param {Function} onChange 변경 함수
 * @param {string} placeholder 플레이스홀더
 * @param {boolean} required 필수 여부
 * @param {boolean} disabled 비활성화 여부
 * @param {string} buttonText 버튼 텍스트
 * @param {Function} onButtonClick 버튼 클릭 함수
 * @param {boolean} buttonDisabled 버튼 비활성화 여부
 */
const InputWithButton = forwardRef<HTMLInputElement, InputWithButtonProps>(
  (
    {
      label,
      type = 'text',
      id,
      name,
      value,
      onChange,
      placeholder,
      required = false,
      disabled = false,
      buttonText,
      onButtonClick,
      buttonDisabled = false,
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
            type={type}
            id={id}
            name={name}
            value={value}
            onChange={onChange}
            onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
              if (e.key === 'Enter' && !buttonDisabled && onButtonClick) {
                e.preventDefault();
                onButtonClick();
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
            onClick={onButtonClick}
            disabled={buttonDisabled}
            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap h-[48px] flex items-center justify-center flex-shrink-0"
          >
            {buttonText}
          </button>
        </div>
        <div className="min-h-[20px] mt-2"></div>
      </div>
    );
  }
);
InputWithButton.displayName = 'InputWithButton';
export default InputWithButton;
