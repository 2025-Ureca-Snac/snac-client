import { useState, forwardRef } from 'react';
import Image from 'next/image';
import type { PasswordInputProps } from '../types/formComponents';
import { validatePassword } from '../utils/password-validation';

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
const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  (
    {
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
      showValidation = false,
      ...props
    },
    ref
  ) => {
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

    // 비밀번호 유효성 검사 결과
    const passwordValidation =
      showValidation && value.trim() ? validatePassword(value) : null;

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
            ref={ref}
            type={showPassword ? 'text' : 'password'}
            id={id}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            disabled={disabled}
            className={`w-full px-3 py-3 pr-10 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed h-[48px] ${
              showValidation && value.trim() && passwordValidation
                ? passwordValidation.isValid
                  ? 'border-green-300 focus:ring-green-200'
                  : 'border-red-300 focus:ring-red-200'
                : 'border-gray-300 focus:ring-blue-500'
            }`}
            {...props}
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
        {/* 비밀번호 일치 여부 표시 */}
        {showHelpText && helpText && (
          <p
            className={`text-sm mt-2 min-h-[20px] ${helpTextColorClass[helpTextColor] || 'text-gray-500'}`}
          >
            {helpText}
          </p>
        )}

        {/* 비밀번호 유효성 검사 체크리스트 */}
        {showValidation && (
          <div className="text-sm mt-2 space-y-1">
            <div className="flex items-center gap-2">
              <div
                className={`w-3 h-3 rounded-full flex items-center justify-center ${
                  value.length >= 6 && value.length <= 12
                    ? 'bg-green-500'
                    : 'bg-red-300'
                }`}
              >
                {value.length >= 6 && value.length <= 12 && (
                  <svg
                    className="w-2 h-2 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>
              <span
                className={
                  value.length >= 6 && value.length <= 12
                    ? 'text-green-600'
                    : 'text-red-500'
                }
              >
                6~12자 길이
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div
                className={`w-3 h-3 rounded-full flex items-center justify-center ${
                  /[a-zA-Z]/.test(value) ? 'bg-green-500' : 'bg-red-300'
                }`}
              >
                {/[a-zA-Z]/.test(value) && (
                  <svg
                    className="w-2 h-2 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>
              <span
                className={
                  /[a-zA-Z]/.test(value) ? 'text-green-600' : 'text-red-500'
                }
              >
                영어 포함 (대소문자 구분 없음)
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div
                className={`w-3 h-3 rounded-full flex items-center justify-center ${
                  /\d/.test(value) ? 'bg-green-500' : 'bg-red-300'
                }`}
              >
                {/\d/.test(value) && (
                  <svg
                    className="w-2 h-2 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>
              <span
                className={/\d/.test(value) ? 'text-green-600' : 'text-red-500'}
              >
                숫자 포함
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div
                className={`w-3 h-3 rounded-full flex items-center justify-center ${
                  /[!?@#$%^&*()~`+\-_]/.test(value)
                    ? 'bg-green-500'
                    : 'bg-red-300'
                }`}
              >
                {/[!?@#$%^&*()~`+\-_]/.test(value) && (
                  <svg
                    className="w-2 h-2 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>
              <span
                className={
                  /[!?@#$%^&*()~`+\-_]/.test(value)
                    ? 'text-green-600'
                    : 'text-red-500'
                }
              >
                특수기호 포함 (! ? @ # $ % ^ & * ( ) ~ ` + - _)
              </span>
            </div>
          </div>
        )}
      </div>
    );
  }
);
PasswordInput.displayName = 'PasswordInput';
export default PasswordInput;
