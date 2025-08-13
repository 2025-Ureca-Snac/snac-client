import type { InputFieldProps } from '../types/formComponents';
import { forwardRef } from 'react';

/**
 * @author 이승우
 * @description 일반 입력 필드 컴포넌트
 */
const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
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
      className = '',
      max,
    },
    ref
  ) => {
    return (
      <div>
        <label
          htmlFor={id}
          className="block text-sm font-medium text-foreground mb-2"
        >
          {label}
        </label>
        <input
          ref={ref}
          type={type}
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          max={max}
          className={`w-full px-3 py-3 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-secondary disabled:cursor-not-allowed h-[48px] ${className}`}
        />
        <div className="min-h-[20px] mt-2"></div>
      </div>
    );
  }
);
InputField.displayName = 'InputField';
export default InputField;
