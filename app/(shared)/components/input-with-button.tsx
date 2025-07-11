import type { InputWithButtonProps } from '../types/formComponents';

/**
 * @author 이승우
 * @description {@link InputField} 컴포넌트와 버튼을 결합한 컴포넌트
 * @param props 컴포넌트 속성 {@link InputWithButtonProps}(label, type='text', id, name, value, onChange, placeholder, required=false, disabled=false, buttonText, onButtonClick, buttonDisabled=false)
 * @returns 버튼 입력 필드 컴포넌트
 */
export default function InputWithButton({
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
}: InputWithButtonProps) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-700 mb-2"
      >
        {label}
      </label>
      <div className="flex gap-2">
        <input
          type={type}
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          className="flex-1 px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
        />
        <button
          type="button"
          onClick={onButtonClick}
          disabled={buttonDisabled}
          className="px-6 py-3 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {buttonText}
        </button>
      </div>
      <div className="min-h-[20px] mt-2"></div>
    </div>
  );
}
